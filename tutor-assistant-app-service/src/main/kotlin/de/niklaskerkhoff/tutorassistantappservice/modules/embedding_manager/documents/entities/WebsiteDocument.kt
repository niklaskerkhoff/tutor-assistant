package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import jakarta.persistence.Embeddable
import jakarta.persistence.Entity


/**
 * Document from a website.
 */
@Entity
class WebsiteDocument(
    title: String,
    loaderType: String,
    collection: String?,
    isCalendar: Boolean,

    /**
     * Specifies how to load the website.
     */
    val loaderParams: LoaderParams,
) : Document(title, loaderType, collection, isCalendar) {
    override fun accept(visitor: DocumentVisitor) {
        visitor.visit(this)
    }

    @Embeddable
    data class LoaderParams(
        /**
         * URL from which the website is loaded.
         */
        val url: String,

        /**
         * HTML selector to identify the element from which the content shall be used.
         * Returns a list of elements matching the selector.
         */
        val htmlSelector: String,

        /**
         * Index of element to use in the selected elements
         */
        val htmlSelectionIndex: Int
    )
}
