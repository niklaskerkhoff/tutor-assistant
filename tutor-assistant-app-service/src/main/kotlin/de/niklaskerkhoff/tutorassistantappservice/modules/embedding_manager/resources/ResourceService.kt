package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.resources

import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreFileReferenceDefaultRepo
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

/**
 * Helper for managing resources.
 */
@Service
class ResourceService(
    private val fileReferenceDefaultRepo: FileStoreFileReferenceDefaultRepo
) {
    companion object {
        private const val UNIQUE_START_N = 1
    }

    /**
     * Generates a unique filename from the original filename.
     */
    fun getUniqueFilename(file: MultipartFile): String {
        val filename = file.originalFilename ?: throw BadRequestException("Filename must not be null")
        return getUniqueFilename(filename)
    }

    private fun getUniqueFilename(filename: String, n: Int? = null): String {
        val newFilename = if (n == null) filename else addNumberToFilename(filename, n)

        val fileReferences = fileReferenceDefaultRepo.findAllByDisplayName(newFilename)
        if (fileReferences.size > 1) throw UnknownError("Filenames must be unique")

        if (fileReferences.isEmpty()) return newFilename

        val newN = n?.plus(1) ?: UNIQUE_START_N
        return getUniqueFilename(filename, newN)
    }

    private fun addNumberToFilename(filename: String, number: Int): String {
        val dotIndex = filename.lastIndexOf('.')
        return if (dotIndex != -1) {
            val name = filename.substring(0, dotIndex)
            val extension = filename.substring(dotIndex)
            "$name.$number$extension"
        } else {
            "$filename.$number"
        }
    }
}
