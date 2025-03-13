package de.niklaskerkhoff.tutorassistantappservice.lib.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

/**
 * This exception acts as default exception if something goes wrong.
 *
 * @param message to specify the error.
 */
class BadRequestException(message: String) : ResponseStatusException(HttpStatus.BAD_REQUEST, message)
