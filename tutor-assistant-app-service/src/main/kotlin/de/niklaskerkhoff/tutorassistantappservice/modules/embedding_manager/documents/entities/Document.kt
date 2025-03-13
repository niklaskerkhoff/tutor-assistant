package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType

/**
 * Document to embed.
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class Document(
    /**
     * Human-readable id.
     */
    open val title: String,

    /**
     * Specifies how the document is loaded.
     */
    open val loaderType: String,

    /**
     * Assigns a collection to the document for grouping.
     */
    open val collection: String?,

    /**
     * Specifies if the document shall be used for generating the calendar.
     */
    open val isCalendar: Boolean
) : AppEntity() {

    /**
     * Ids of the embedded chunks returned by the rag service
     */
    @ElementCollection
    open var chunksIds: List<String> = emptyList()

    /**
     * Visitor method
     */
    abstract fun accept(visitor: DocumentVisitor)
}
