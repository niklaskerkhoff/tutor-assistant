package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

/**
 * Class for representing sources also referred to as contexts of a message from ai.
 */
@Embeddable
data class MessageContext(
    /**
     * Title of the context.
     */
    val title: String?,

    /**
     * Key used to open the context. Can be a URL or a file reference id.
     */
    val originalKey: String?,

    /**
     * Specifies if the context is used for generating the calendar.
     */
    val isCalendar: Boolean?,

    /**
     * Page number for resources split into pages like PDFs.
     */
    val page: Int?,

    /**
     * Actual content of the context on which similarity was calculated.
     */
    @Column(columnDefinition = "text")
    val content: String?,

    /**
     * Similarity score that states how similar the query is to the context.
     */
    val score: Double?
)
