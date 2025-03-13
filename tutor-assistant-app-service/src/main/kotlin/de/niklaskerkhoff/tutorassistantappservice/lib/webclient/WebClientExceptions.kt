package de.niklaskerkhoff.tutorassistantappservice.lib.webclient

/**
 * Exception to be thrown when the response body of a request is empty.
 */
class EmptyResponseBodyException : RuntimeException("Response body must not be null")
