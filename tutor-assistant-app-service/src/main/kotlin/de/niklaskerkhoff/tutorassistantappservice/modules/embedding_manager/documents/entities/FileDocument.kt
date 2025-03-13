package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import jakarta.persistence.Entity
import java.util.UUID

/**
 * Document from a file
 */
@Entity
class FileDocument(
    title: String,
    loaderType: String,
    collection: String?,
    isCalendar: Boolean,

    /**
     * ID of the file in the file store
     */
    val fileStoreId: UUID,

    /**
     * URL of the file in the file store
     */
    val fileStoreUrl: String,
) : Document(title, loaderType, collection, isCalendar) {
    override fun accept(visitor: DocumentVisitor) {
        visitor.visit(this)
    }
}
