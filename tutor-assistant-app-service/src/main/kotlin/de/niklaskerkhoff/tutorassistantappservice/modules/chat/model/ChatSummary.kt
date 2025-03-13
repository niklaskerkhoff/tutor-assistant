package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class ChatSummary(
    val title: String,
    val subtitle: String,
    @Column(columnDefinition = "text")
    val content: String,
)
