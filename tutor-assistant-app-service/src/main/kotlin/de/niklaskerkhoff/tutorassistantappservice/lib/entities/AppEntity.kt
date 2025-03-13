package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.*

/**
 * Abstract class every entity should inherit from.
 * Provides entity-id and JPA-Auditing.
 */
@Entity
@EntityListeners(AuditingEntityListener::class)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class AppEntity {
    /**
     * ID of the entity. This property is used as the primary key.
     * This property is set by JPA-Auditing. It must not be modified manually!
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    open val id: UUID? = null

    /**
     * Date, the entity is created in the database.
     * This property is set by JPA-Auditing. It must not be modified manually!
     */
    @CreatedDate
    open var createdDate: Instant? = null
        protected set

    /**
     * Date, the entity is updated in the database lastly.
     * This property is set by JPA-Auditing. It must not be modified manually!
     */
    @LastModifiedDate
    open var lastModifiedDate: Instant? = null
        protected set

    /**
     * ID of the user whose request created the entity in the database.
     * This property is set by JPA-Auditing. It must not be modified manually!
     */
    @CreatedBy
    open var createdBy: String? = null
        protected set

    /**
     * ID of the user whose request updated the entity in the database lastly.
     * This property is set by JPA-Auditing. It must not be modified manually!
     */
    @LastModifiedBy
    open var lastModifiedBy: String? = null
        protected set
}
