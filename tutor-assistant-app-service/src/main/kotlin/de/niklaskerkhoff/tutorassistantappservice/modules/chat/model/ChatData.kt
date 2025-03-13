package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.Message
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageContext
import java.util.*

/**
 * Chat data with messages. Used for displaying chat details.
 */
data class ChatMainData(
    val id: UUID?,
    val summary: ChatSummary?,
    val messages: List<MessageMainData>
) {
    constructor(chat: Chat) : this(
        chat.id,
        chat.summary,
        chat.messages.mapNotNull {
            if (it.role == "system") null
            else MessageMainData(it)
        }
    )
}

/**
 * Chat data without messages. Used for overview of chats.
 */
data class ChatBaseData(
    val id: UUID?,
    val summary: ChatSummary?,
) {
    constructor(chat: Chat) : this(chat.id, chat.summary)
}

data class MessageMainData(
    val id: UUID?,
    val role: String,
    val content: String,
    val contexts: List<MessageContext>?
) {
    constructor(message: Message) : this(message.id, message.role, message.content, message.contexts)
}
