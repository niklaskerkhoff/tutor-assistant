package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

interface DocumentVisitor {
    fun visit(fileDocument: FileDocument)
    fun visit(websiteDocument: WebsiteDocument)
}
