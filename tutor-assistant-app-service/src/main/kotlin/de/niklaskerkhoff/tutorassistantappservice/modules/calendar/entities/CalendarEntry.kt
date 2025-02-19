package de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

/**
 * Class for representing calendar entries generated by the RAG-Service.
 */
@Embeddable
data class CalendarEntry(
    /**
     * title of the entry.
     */
    @Column(length = 1023)
    val title: String,

    /**
     * date of the entry.
     * Not converted to date-time as they are not further processed.
     */
    val date: String,

    /**
     * time of the entry.
     * Not converted to date-time as they are not further processed.
     */
    val time: String?,
)
