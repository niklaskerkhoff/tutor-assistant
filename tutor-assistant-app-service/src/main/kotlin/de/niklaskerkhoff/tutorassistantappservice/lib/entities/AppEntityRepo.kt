package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import java.util.*

/**
 * Interface from which every entity's repository should inherit from.
 * Leads to concise implementation and can provide additional methods through extension functions.
 */
@NoRepositoryBean
interface AppEntityRepo<E> : JpaRepository<E, UUID>
