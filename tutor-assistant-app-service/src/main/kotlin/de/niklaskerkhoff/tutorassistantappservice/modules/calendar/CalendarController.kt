package de.niklaskerkhoff.tutorassistantappservice.modules.calendar

import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("calendar")
class CalendarController(
    private val calendarService: CalendarService
) {
    /**
     * @see CalendarService.getCalendar
     */
    @GetMapping
    fun getCalendar(@RequestParam currentDate: String, @RequestParam currentTitle: String): List<CalendarFrontendData> =
        calendarService.getCalendar(currentDate, currentTitle)

    /**
     * @see CalendarService.loadNewCalendar
     */
    @PostMapping
    @PreAuthorize("hasRole('document-manager')")
    fun reloadInfo() = calendarService.loadNewCalendar()
}
