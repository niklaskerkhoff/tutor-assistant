package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities

import java.util.*

data class SettingDto(
    val id: UUID?,
    val name: String,
    val content: String,
    val type: SettingType,
) {
    constructor(setting: Setting) : this(
        id = setting.id,
        name = setting.name,
        content = setting.content,
        type = setting.type
    )
}

fun Setting.toDto() = SettingDto(this)
