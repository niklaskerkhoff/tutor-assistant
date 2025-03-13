package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntityRepo

interface SettingRepo : AppEntityRepo<Setting> {
    fun deleteAllByType(type: SettingType)

    fun deleteAllByName(name: String)
}
