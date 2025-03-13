package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings

import com.fasterxml.jackson.databind.ObjectMapper
import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreService
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.DocumentLoader
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.Document
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities.Setting
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities.SettingRepo
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities.SettingType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.*

/**
 * Manages settings and the embedding process
 */
@Service
class SettingService(
    private val settingRepo: SettingRepo,
    private val fileStoreService: FileStoreService,
    private val objectMapper: ObjectMapper
) : AppService(), DocumentLoader {

    companion object {
        private val VALUE_STRATEGIES = mapOf<String, (String) -> String>(
            "plain" to { it },
            "underscored" to { it.replace(" ", "_") }
        )
    }

    /**
     * Embeds the resources based on the settings.
     *
     * @returns a list of the documents.
     */
    override fun loadDocuments(): List<Document> {
        val settings = settingRepo.findAll()
        val (tempMainSettings, tempValueSettings) = settings.partition { it.type == SettingType.MAIN }
        if (tempMainSettings.isEmpty()) throw BadRequestException("Main setting does not exist")

        val mainJson = tempMainSettings.first().content
        val values = tempValueSettings.associate { it.name to it.content.trim().split('\n') }
        val fileStoreIdsAndUrls = fileStoreService.listFiles().associate { it.displayName to Pair(it.id, it.storeUrl) }

        return SettingsParser(objectMapper, mainJson, values, fileStoreIdsAndUrls, VALUE_STRATEGIES).parse().also {
            log.info("Parsed ${it.size} documents")
        }
    }

    /**
     * @returns all settings.
     */
    fun getSettings(): List<Setting> = settingRepo.findAll()

    /**
     * Adds a setting file.
     * Deletes existing settings with the same filename.
     *
     * @param file which contains the setting content.
     * @returns the saved setting.
     * @throws BadRequestException if originalFilename of the MultipartFile is null.
     */
    @Transactional
    fun addSettings(file: MultipartFile): Setting {
        val name = file.originalFilename ?: throw BadRequestException("File name must not be null")
        val fileEnding = name.split(".").last()
        val value = file.inputStream.bufferedReader().use { it.readText() }
        val type = if (fileEnding == "json") SettingType.MAIN else SettingType.VALUES

        settingRepo.deleteAllByName(name).also {
            log.info("Deleted existing settings with name '$name'")
        }

        if (type == SettingType.MAIN) {
            settingRepo.deleteAllByType(type).also {
                log.info("Deleted main setting if existed")
            }
        }

        val setting = Setting(name, value, type)
        return settingRepo.save(setting).also {
            log.info("Saved new setting with name '$name'")
        }
    }

    /**
     * Deletes a setting.
     *
     * @param id of the setting to delete.
     */
    fun deleteSetting(id: UUID) {
        settingRepo.deleteById(id).also {
            log.info("Deleted setting with id $id")
        }
    }
}
