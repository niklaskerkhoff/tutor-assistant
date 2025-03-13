package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities

enum class SettingType {
    /**
     * main setting.
     * Contains the instructions for creating documents as JSON.
     */
    MAIN,

    /**
     * value setting.
     * Contains values that can be inserted into the main setting.
     */
    VALUES
}
