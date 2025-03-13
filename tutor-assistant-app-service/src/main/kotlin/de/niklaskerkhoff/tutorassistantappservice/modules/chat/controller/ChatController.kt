package de.niklaskerkhoff.tutorassistantappservice.modules.chat.controller

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppController
import de.niklaskerkhoff.tutorassistantappservice.lib.security.hasAuthority
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatBaseData
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatMainData
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatService
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.util.*

@RestController
@RequestMapping("chats")
class ChatController(
    private val chatService: ChatService
) : AppController() {

    /**
     * Chat details.
     * Can be accessed if it is their own chat, or they have ROLE_evaluator
     * @see ChatService.getChatById
     * @returns chat as ChatMainData
     */
    @GetMapping("{chatId}")
    fun getChatById(@PathVariable chatId: UUID, jwt: JwtAuthenticationToken): ChatMainData =
        chatService.getChatById(chatId, jwt.name, !jwt.hasAuthority("ROLE_evaluator"))

    /**
     * Overview of chats.
     * ROLE_evaluator can see all chats, others only their own.
     *
     * @see ChatService.getAllChats
     * @see ChatService.getUsersChats
     * @returns a list of chats as ChatBaseData.
     */
    @GetMapping
    fun getChats(jwt: JwtAuthenticationToken): List<ChatBaseData> =
        if (jwt.hasAuthority("ROLE_evaluator")) chatService.getAllChats()
        else chatService.getUsersChats(jwt.name)

    /**
     * @see ChatService.createChat
     */
    @PostMapping
    fun createChat(jwt: JwtAuthenticationToken): ChatBaseData = chatService.createChat(jwt.name)

    /**
     * @see ChatService.deleteChat
     */
    @DeleteMapping("{chatId}")
    fun deleteChat(@PathVariable chatId: UUID, jwt: JwtAuthenticationToken): Unit =
        chatService.deleteChat(chatId, jwt.name)

    /**
     * Send message to a chat.
     *
     * @see ChatService.sendMessage
     * @returns Tokens of the answer as event stream.
     */
    @PostMapping("{chatId}/messages", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun sendMessage(
        @PathVariable chatId: UUID,
        @RequestBody message: String,
        jwt: JwtAuthenticationToken
    ): ResponseEntity<Flux<String>> {
        val flux = chatService.sendMessage(chatId, message, jwt.name)
        val headers = HttpHeaders().apply {
            contentType = MediaType.TEXT_EVENT_STREAM
            cacheControl = CacheControl.noCache().headerValue
            this["X-Accel-Buffering"] = "no"
        }

        return ResponseEntity.ok().headers(headers).body(flux)
    }
}
