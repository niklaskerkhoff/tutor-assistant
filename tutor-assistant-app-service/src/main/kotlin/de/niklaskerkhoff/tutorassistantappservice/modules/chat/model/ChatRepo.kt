package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntityRepo
import org.springframework.data.jpa.repository.Query

interface ChatRepo : AppEntityRepo<Chat> {
    fun findByUserIdOrderByCreatedDateDesc(userId: String): List<Chat>

    fun findAllByOrderByCreatedDateDesc(): List<Chat>

    @Query("select c from Chat c where size(c._messages) <= 1")
    fun findEmptyChats(): List<Chat>
}
