package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.Message
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy

/**
 * Class for representing chats with LLMs through the RAG-Service.
 */
@Entity
class Chat(
    /**
     * Owner of the chat.
     */
    val userId: String,

    /**
     * Summary of the chat based on the messages.
     */
    @Embedded
    var summary: ChatSummary? = null,
) : AppEntity() {

    @OneToMany(orphanRemoval = true)
    @OrderBy("createdDate ASC")
    private val _messages = mutableListOf<Message>()

    /**
     * Messages also referred to as history of the chat.
     */
    @get:OneToMany
    val messages: List<Message> get() = _messages.toList()

    /**
     * Adds a message to the chat.
     */
    fun addMessage(message: Message) = _messages.add(message)
}
