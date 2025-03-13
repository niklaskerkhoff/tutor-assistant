package de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntityRepo

interface CalendarRepo : AppEntityRepo<Calendar> {
    fun findFirstByOrderByCreatedDateDesc(): Calendar?
}
