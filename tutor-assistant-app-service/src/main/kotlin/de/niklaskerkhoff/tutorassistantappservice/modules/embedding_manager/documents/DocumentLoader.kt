package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents

import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.Document

interface DocumentLoader {
    fun loadDocuments(): List<Document>
}