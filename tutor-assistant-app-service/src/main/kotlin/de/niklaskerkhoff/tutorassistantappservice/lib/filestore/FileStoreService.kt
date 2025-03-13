package de.niklaskerkhoff.tutorassistantappservice.lib.filestore

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.lib.webclient.EmptyResponseBodyException
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.InputStreamResource
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.reactive.function.client.WebClient
import java.util.*

/**
 * Provides file store interaction.
 */
@Service
class FileStoreService(
    private val webClient: WebClient,
    private val fileStoreFileReferenceDefaultRepo: FileStoreFileReferenceDefaultRepo
) {
    @Value("\${app.seaweedfs.master-url}")
    private lateinit var masterUrl: String

    /**
     * @returns all stored FileStoreFileReferences.
     */
    fun listFiles(): List<FileStoreFileReference> = fileStoreFileReferenceDefaultRepo.findAll()

    /**
     * Loads the file content.
     *
     * @param id of the FileStoreFileReference whose file content shall be loaded.
     * @returns Pair of the FileStoreFileReference and content as InputStreamResource.
     */
    fun getFileById(id: UUID): Pair<FileStoreFileReference, InputStreamResource> {
        val fileReference = fileStoreFileReferenceDefaultRepo.findByIdOrThrow(id)

        val fileBytes = webClient.get()
            .uri(fileReference.storeUrl)
            .retrieve()
            .bodyToMono(ByteArray::class.java)
            .block() ?: throw EmptyResponseBodyException()

        return Pair(fileReference, InputStreamResource(fileBytes.inputStream()))
    }

    /**
     * Assigns and uploads a file.
     *
     * @see assign
     * @see upload
     * @param file to be uploaded.
     * @param displayName name of the file under which it is uploaded so the original file name must not be changed.
     */
    fun assignAndUpload(file: MultipartFile, displayName: String? = null): FileStoreFileReference {
        val assignment = assign()
        val storeUrl = "http://${assignment.publicUrl}/${assignment.fid}"
        val upload = upload(storeUrl, file)

        val fileReference = FileStoreFileReference(assignment, upload, storeUrl, displayName ?: upload.name)

        return fileStoreFileReferenceDefaultRepo.save(fileReference)
    }

    /**
     * Assigns a storage location for a new file.
     *
     * @returns an FileStoreAssignment containing a reference (url) to the storage location.
     */
    fun assign(): FileStoreAssignment {
        return webClient.get()
            .uri(masterUrl)
            .retrieve()
            .bodyToMono(FileStoreAssignment::class.java)
            .block() ?: throw EmptyResponseBodyException()
    }

    /**
     * Uploads a file to the file store.
     *
     * @param storeUrl to which the file shall be uploaded.
     * @param file to be uploaded.
     * @returns FileStoreUpload as the result of the file store.
     */
    fun upload(storeUrl: String, file: MultipartFile): FileStoreUpload {
        val body: MultiValueMap<String, Any> = LinkedMultiValueMap()
        body.add("file", file.resource)

        return webClient.post()
            .uri(storeUrl)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .bodyValue(body)
            .retrieve()
            .bodyToMono(FileStoreUpload::class.java)
            .block() ?: throw EmptyResponseBodyException()
    }

    /**
     * Deletes a file from a file from the file store and the FileStoreFileReference from the database.
     *
     * @param id of the FileStoreFileReference.
     * @returns FileStoreDelete as the result of the file store.
     */
    fun deleteById(id: UUID): FileStoreDelete {
        val fileReference = fileStoreFileReferenceDefaultRepo.findByIdOrThrow(id)

        val result = webClient.delete()
            .uri(fileReference.storeUrl)
            .retrieve()
            .bodyToMono(FileStoreDelete::class.java)
            .block() ?: throw EmptyResponseBodyException()

        fileStoreFileReferenceDefaultRepo.delete(fileReference)

        return result
    }
}
