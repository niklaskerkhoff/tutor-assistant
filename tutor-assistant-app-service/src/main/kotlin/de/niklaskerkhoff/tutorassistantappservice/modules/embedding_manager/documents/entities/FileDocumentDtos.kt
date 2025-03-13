package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import java.util.UUID

data class FileDocumentDto(
    val id: UUID?,
    val title: String,
    val loaderType: String,
    val collection: String?,
    val fileStoreId: UUID
) {
    constructor(fileDocument: FileDocument) : this(
        id = fileDocument.id,
        title = fileDocument.title,
        loaderType = fileDocument.loaderType,
        collection = fileDocument.collection,
        fileStoreId = fileDocument.fileStoreId
    )
}

fun FileDocument.toDto() = FileDocumentDto(this)
