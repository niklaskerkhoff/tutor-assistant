package de.niklaskerkhoff.tutorassistantappservice.modules.chat.controller

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageFeedback
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageRepo
import org.springframework.web.bind.annotation.*
import java.util.*

/**
 * Class for handling feedback for messages
 */
@RestController
@RequestMapping("chats/messages")
class MessageController(
    private val messageRepo: MessageRepo
) {
    /**
     * @return feedback by id
     */
    @GetMapping("{id}")
    fun getMessageFeedback(@PathVariable id: UUID) = messageRepo.findByIdOrThrow(id).feedback

    data class RatingPatch(val rating: Int)

    /**
     * Updates the rating of the feedback
     *
     * @returns the feedback
     */
    @PatchMapping("{id}/feedback-rating")
    fun setFeedbackRating(@PathVariable id: UUID, @RequestBody patch: RatingPatch): MessageFeedback {
        val message = messageRepo.findByIdOrThrow(id)
        message.feedback = message.feedback.copy(rating = patch.rating)
        messageRepo.save(message)
        return message.feedback
    }

    data class ContentPatch(val content: String)

    /**
     * Updates the content of the feedback
     *
     * @returns the feedback
     */
    @PatchMapping("{id}/feedback-content")
    fun setFeedbackContent(@PathVariable id: UUID, @RequestBody patch: ContentPatch): MessageFeedback {
        val message = messageRepo.findByIdOrThrow(id)
        message.feedback = message.feedback.copy(content = patch.content.trim())
        messageRepo.save(message)
        return message.feedback
    }
}
