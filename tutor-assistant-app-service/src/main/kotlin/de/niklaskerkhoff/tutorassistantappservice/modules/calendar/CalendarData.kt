package de.niklaskerkhoff.tutorassistantappservice.modules.calendar

import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.CalendarEntry

data class CalendarFrontendData(
    val title: String,
    val date: String,
    val time: String?,
    val isCurrentDate: Boolean,
) {
    constructor(entry: CalendarEntry, isCurrentDate: Boolean) : this(
        entry.title,
        entry.date,
        entry.time,
        isCurrentDate,
    )
}
