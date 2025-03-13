package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.RagDocumentService
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.*
import org.springframework.stereotype.Service
import java.util.*

/**
 * Manges Documents
 *      * returns them
 *      * embeds them
 *      * deletes them
 */
@Service
class DocumentService(
    private val fileDocumentRepo: FileDocumentRepo,
    private val websiteDocumentRepo: WebsiteDocumentRepo,
    private val documentLoader: DocumentLoader,
    private val applierVisitor: ApplierVisitor,
    private val ragDocumentService: RagDocumentService
) : AppService() {

    /**
     * @returns all file documents.
     */
    fun getFileDocuments(): List<FileDocument> = fileDocumentRepo.findAll()

    /**
     * @returns all website documents.
     */
    fun getWebsiteDocuments(): List<WebsiteDocument> = websiteDocumentRepo.findAll()

    /**
     * Embeds the documents
     */
    fun embed() {
        val documents = documentLoader.loadDocuments()
        documents.forEach { it.accept(applierVisitor) }
    }

    /**
     * Deletes the embedding of a file and embeds it again.
     *
     * @param id of the file.
     */
    fun reembedFileDocument(id: UUID) = reembed(id, fileDocumentRepo)

    /**
     * Deletes the embedding of a website and embeds it again.
     *
     * @param id of the website.
     */
    fun reembedWebsiteDocument(id: UUID) = reembed(id, websiteDocumentRepo)

    /**
     * Deletes an embedding of a file.
     *
     * @param id of the file.
     */
    fun deleteFileDocument(id: UUID) = delete(id, fileDocumentRepo)

    /**
     * Deletes an embedding of a website.
     *
     * @param id of the website.
     */
    fun deleteWebsiteDocument(id: UUID) = delete(id, websiteDocumentRepo)

    private fun <T : Document> reembed(id: UUID, documentRepo: DocumentRepo<T>) {
        val existingDocument = documentRepo.findByIdOrThrow(id)
        val title = existingDocument.title
        val allDocuments = documentLoader.loadDocuments()
        val documentToReembed = allDocuments.find { it.title == title }
            ?: throw BadRequestException("Document $title not specified in main settings")

        delete(existingDocument, documentRepo)
        documentToReembed.accept(applierVisitor)
    }

    private fun <T : Document> delete(id: UUID, documentRepo: DocumentRepo<T>) {
        val document = documentRepo.findByIdOrThrow(id)
        delete(document, documentRepo)
    }

    private fun <T : Document> delete(document: T, documentRepo: DocumentRepo<T>) {
        ragDocumentService.deleteDocument(document.chunksIds).also {
            log.info("Deleted ${document.chunksIds} from Tutor-Assistant")
        }
        documentRepo.delete(document).also {
            log.info("Deleted document with id ${document.id}")
        }
    }
}
