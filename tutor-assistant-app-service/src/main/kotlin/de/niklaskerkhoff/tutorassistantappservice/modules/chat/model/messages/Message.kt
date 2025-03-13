package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity

@Entity
class Message(
    /**
     * Specifies who wrote the message e.g. ai or user
     */
    val role: String,

    /**
     * The actual content of the message that is written by the role
     */
    @Column(columnDefinition = "text")
    val content: String,
    @ElementCollection

    /**
     * The contexts based on which the content was created.
     * Only present if message from ai.
     */
    val contexts: List<MessageContext>? = null,

    /**
     * Feedback the user can provide if the message is from ai
     */
    var feedback: MessageFeedback = MessageFeedback(0, "")
) : AppEntity()
