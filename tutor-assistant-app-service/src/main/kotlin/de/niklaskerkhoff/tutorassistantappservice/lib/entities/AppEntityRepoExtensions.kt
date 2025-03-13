package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import org.springframework.data.repository.findByIdOrNull
import java.util.*

/**
 * @param id of the Entity which is searched.
 * @returns Entity of the particular inherited AppEntityRepo with the given id.
 * @throws IllegalArgumentException iff the id is not found.
 */
fun <T> AppEntityRepo<T>.findByIdOrThrow(id: UUID) = findByIdOrNull(id) ?: throw IllegalArgumentException(id.toString())
