package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings

import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities.SettingDto
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings.entities.toDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("embedding_manager/settings")
@PreAuthorize("hasRole('document-manager')")
class SettingController(
    private val settingService: SettingService
) {

    /**
     * @see SettingService.getSettings
     */
    @GetMapping
    fun getSettings(): List<SettingDto> = settingService.getSettings().map { it.toDto() }

    /**
     * @see SettingService.addSettings
     */
    @PostMapping
    fun addSetting(@RequestPart("file") file: MultipartFile): SettingDto = settingService.addSettings(file).toDto()

    /**
     * @see SettingService.deleteSetting
     */
    @DeleteMapping("{id}")
    fun deleteSetting(@PathVariable id: UUID): Unit = settingService.deleteSetting(id)
}
