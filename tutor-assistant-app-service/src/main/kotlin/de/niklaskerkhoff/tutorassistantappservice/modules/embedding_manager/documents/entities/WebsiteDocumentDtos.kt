package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import java.util.*

data class WebsiteDocumentDto(
    val id: UUID?,
    val title: String,
    val loaderType: String,
    val collection: String?,
    val url: String,
) {
    constructor(websiteDocument: WebsiteDocument) : this(
        id = websiteDocument.id,
        title = websiteDocument.title,
        loaderType = websiteDocument.loaderType,
        collection = websiteDocument.collection,
        url = websiteDocument.loaderParams.url
    )
}

fun WebsiteDocument.toDto() = WebsiteDocumentDto(this)
