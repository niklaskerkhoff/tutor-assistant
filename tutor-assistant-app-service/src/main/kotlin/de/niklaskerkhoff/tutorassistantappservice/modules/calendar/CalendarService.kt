package de.niklaskerkhoff.tutorassistantappservice.modules.calendar

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.webclient.EmptyResponseBodyException
import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.Calendar
import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.CalendarEntry
import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.CalendarRepo
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class CalendarService(
    private val webClient: WebClient,
    private val calendarRepo: CalendarRepo
) : AppService() {
    @Value("\${app.tutor-assistant.base-url}")
    private lateinit var baseUrl: String

    /**
     * Gets the current calendar inserting a given entry.
     *
     * @param currentDate of the entry to insert.
     * @param currentTitle of the entry to insert.
     * @returns a list of all calendar entries as CalendarFrontendData sorted by their date and time.
     */
    fun getCalendar(currentDate: String, currentTitle: String) =
        calendarRepo.findFirstByOrderByCreatedDateDesc()
            ?.let { listOf(CalendarEntry(currentTitle, currentDate, null)) + it.entries }
            ?.sorted()
            ?.map { CalendarFrontendData(it, it.date == currentDate) }
            ?: emptyList()

    /**
     * Loads a new calendar from the RAG-Service and saves it.
     *
     * @returns the new calendar entries sorted by their date and time.
     */
    fun loadNewCalendar(): List<CalendarEntry> {

        data class Response(val entries: List<CalendarEntry>)

        val response = webClient.post()
            .uri("$baseUrl/calendar")
            .retrieve()
            .bodyToMono(Response::class.java)
            .block() ?: throw EmptyResponseBodyException()

        log.info("Retrieved calendar from RAG-Service. Size: ${response.entries.size}")

        return calendarRepo.save(Calendar(response.entries))
            .also { log.info("Saved calendar: ${it.id}") }
            .entries.sorted()
    }

    private fun List<CalendarEntry>.sorted() = sortedBy {
        (it.date.split(".").reversed() + (it.time ?: "")).joinToString("")
    }
}
