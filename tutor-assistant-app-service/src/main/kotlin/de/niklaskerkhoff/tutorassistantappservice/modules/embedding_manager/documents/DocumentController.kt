package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents

import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.toDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("embedding_manager/documents")
class DocumentController(
    private val documentService: DocumentService
) {
    @GetMapping("files")
    fun getFileDocuments() = documentService.getFileDocuments().map { it.toDto() }

    @GetMapping("websites")
    fun getWebsiteDocuments() = documentService.getWebsiteDocuments().map { it.toDto() }

    @PostMapping("embed")
    @PreAuthorize("hasRole('document-manager')")
    fun embed(): Unit = documentService.embed()

    @PostMapping("files/{id}/reembed")
    @PreAuthorize("hasRole('document-manager')")
    fun reembedFile(@PathVariable id: UUID): Unit = documentService.reembedFileDocument(id)

    @PostMapping("websites/{id}/reembed")
    @PreAuthorize("hasRole('document-manager')")
    fun reembedWebsite(@PathVariable id: UUID): Unit = documentService.reembedWebsiteDocument(id)

    @DeleteMapping("files/{id}")
    @PreAuthorize("hasRole('document-manager')")
    fun deleteFile(@PathVariable id: UUID): Unit = documentService.deleteFileDocument(id)

    @DeleteMapping("websites/{id}")
    @PreAuthorize("hasRole('document-manager')")
    fun deleteWebsite(@PathVariable id: UUID): Unit = documentService.deleteWebsiteDocument(id)
}
