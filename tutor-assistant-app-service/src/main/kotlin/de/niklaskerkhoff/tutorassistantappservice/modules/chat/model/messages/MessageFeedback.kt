package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

/**
 * Class for representing feedback the user can provide to messages from ai.
 */
@Embeddable
data class MessageFeedback(
    /**
     * Numeric feedback.
     */
    val rating: Int,


    /**
     * Textual feedback.
     */
    @Column(name = "feedback_content", columnDefinition = "text")
    val content: String
)
