package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.webclient.EmptyResponseBodyException
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

/**
 * Manages documents of the RAG-Service.
 */
@Service
class RagDocumentService(
    private val webClient: WebClient
) : AppService() {
    @Value("\${app.tutor-assistant.base-url}")
    private lateinit var baseUrl: String

    /**
     * Adds a document to the RAG-Service.
     *
     * @param title of the document.
     * @param originalKey id of the file in the file store or the url of a website.
     * @param loaderType specifies how to load and process the content.
     * @param loaderParams specifies how to access the ressource and its content.
     * @param isCalendar specifies if the document shall be used for the generation of the calendar.
     *
     * @returns the ids of the embedded chunks.
     */
    fun addDocument(
        title: String,
        originalKey: String,
        loaderType: String,
        loaderParams: Map<String, Any>,
        isCalendar: Boolean
    ): List<String> {
        val requestBody = mapOf(
            "title" to title,
            "originalKey" to originalKey,
            "loaderType" to loaderType,
            "loaderParams" to loaderParams,
            "isCalendar" to isCalendar
        )

        return webClient.post()
            .uri("$baseUrl/documents/add")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(object : ParameterizedTypeReference<List<String>>() {})
            .block() ?: throw EmptyResponseBodyException()
    }

    /**
     * Deletes a document.
     *
     * @param chunksIds ids of the embedded chunks of the document.
     *
     * @returns true if deletion was successful.
     */
    fun deleteDocument(chunksIds: List<String>): Boolean {
        return webClient.post()
            .uri("$baseUrl/documents/delete")
            .bodyValue(chunksIds)
            .retrieve()
            .bodyToMono(Boolean::class.java)
            .block() ?: throw EmptyResponseBodyException()
    }
}
