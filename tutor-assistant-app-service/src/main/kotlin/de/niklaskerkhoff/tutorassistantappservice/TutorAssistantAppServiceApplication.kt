package de.niklaskerkhoff.tutorassistantappservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing
class TutorAssistantAppServiceApplication

fun main(args: Array<String>) {
    runApplication<TutorAssistantAppServiceApplication>(*args)
}
