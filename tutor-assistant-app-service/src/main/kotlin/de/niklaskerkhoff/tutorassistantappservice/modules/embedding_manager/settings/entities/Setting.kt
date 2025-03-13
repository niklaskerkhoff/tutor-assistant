package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity

/**
 * Setting for defining how resources shall be embedded.
 */
@Entity
class Setting(
    /**
     * Human-readable identifier.
     * In case this is a value setting, the name is used as value for "values" key in the main setting.
     */
    val name: String,

    /**
     * Actual specification of the setting.
     */
    @Column(columnDefinition = "text")
    val content: String,

    /**
     * Specifies how the setting is used.
     */
    val type: SettingType
) : AppEntity()
