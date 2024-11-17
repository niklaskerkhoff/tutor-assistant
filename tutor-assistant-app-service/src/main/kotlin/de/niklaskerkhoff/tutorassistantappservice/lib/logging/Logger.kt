package de.niklaskerkhoff.tutorassistantappservice.lib.logging

import org.slf4j.Logger
import org.slf4j.LoggerFactory

interface Logger {
    val log: Logger get() = LoggerFactory.getLogger(javaClass)
}