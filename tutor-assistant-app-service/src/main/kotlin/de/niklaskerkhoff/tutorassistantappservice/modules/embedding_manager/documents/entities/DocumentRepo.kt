package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntityRepo
import org.springframework.data.repository.NoRepositoryBean

@NoRepositoryBean
interface DocumentRepo<T : Document> : AppEntityRepo<T> {
    fun findByTitle(title: String): T?
}
