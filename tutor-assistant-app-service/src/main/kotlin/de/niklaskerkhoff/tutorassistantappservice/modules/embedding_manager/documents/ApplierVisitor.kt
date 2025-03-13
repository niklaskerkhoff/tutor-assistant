package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents

import de.niklaskerkhoff.tutorassistantappservice.lib.logging.Logger
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.RagDocumentService
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.*
import org.springframework.stereotype.Component


/**
 * Applies the setting
 */
@Component
class ApplierVisitor(
    private val fileDocumentRepo: FileDocumentRepo,
    private val websiteDocumentRepo: WebsiteDocumentRepo,
    private val ragDocumentService: RagDocumentService
) : DocumentVisitor, Logger {

    override fun visit(fileDocument: FileDocument) {
        log.info("Visiting fileDocument with title ${fileDocument.title}")

        val existing = fileDocumentRepo.findByTitle(fileDocument.title)
        if (existing != null) {
            logStopping(fileDocument.title)
            return
        }

        logContinuing(fileDocument.title)

        val loaderParams = mapOf("url" to fileDocument.fileStoreUrl)

        val tutorAssistantIds = ragDocumentService.addDocument(
            fileDocument.title,
            fileDocument.fileStoreId.toString(),
            fileDocument.loaderType,
            loaderParams,
            fileDocument.isCalendar
        ).also {
            logAddedToRagService(fileDocument.title, it)
        }

        fileDocument.chunksIds = tutorAssistantIds

        fileDocumentRepo.save(fileDocument).also {
            logSaved(it.title)
        }
    }

    override fun visit(websiteDocument: WebsiteDocument) {
        log.info("Visiting websiteDocument with title ${websiteDocument.title}")

        val existing = websiteDocumentRepo.findByTitle(websiteDocument.title)
        if (existing != null) {
            logStopping(websiteDocument.title)
            return
        }

        logContinuing(websiteDocument.title)

        val loaderParams = mapOf(
            "url" to websiteDocument.loaderParams.url,
            "htmlSelector" to websiteDocument.loaderParams.htmlSelector,
            "htmlSelectionIndex" to websiteDocument.loaderParams.htmlSelectionIndex,
        )

        val tutorAssistantIds = ragDocumentService.addDocument(
            websiteDocument.title,
            websiteDocument.loaderParams.url,
            websiteDocument.loaderType,
            loaderParams,
            websiteDocument.isCalendar
        ).also {
            logAddedToRagService(websiteDocument.title, it)
        }

        websiteDocument.chunksIds = tutorAssistantIds

        websiteDocumentRepo.save(websiteDocument).also {
            logSaved(websiteDocument.title)
        }
    }

    private fun logContinuing(title: String) {
        log.info("$title does not exist, continuing")
    }

    private fun logStopping(title: String) {
        log.info("$title already exists, stopping")
    }

    private fun logAddedToRagService(title: String, tutorAssistantIds: List<String>) {
        log.info("Added $title to Tutor-Assistant, got ${tutorAssistantIds.size} ids")
    }

    private fun logSaved(title: String) {
        log.info("Saved $title")
    }
}
