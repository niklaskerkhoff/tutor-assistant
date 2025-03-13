package de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity

/**
 * Wraps Calendar entries.
 */
@Entity
class Calendar(
    /**
     * Entries of the calendar.
     * @see CalendarEntry
     */
    @ElementCollection
    val entries: List<CalendarEntry>
) : AppEntity()
