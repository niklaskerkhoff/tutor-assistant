package de.niklaskerkhoff.tutorassistantappservice.lib.filestore

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.Embedded
import jakarta.persistence.Entity

/**
 * Instances of these class are stored in the database as references to the files stored in the file store.
 */
@Entity
class FileStoreFileReference(
    /**
     * @see FileStoreAssignment
     */
    @Embedded val assignment: FileStoreAssignment,
    /**
     * @see FileStoreUpload
     */
    @Embedded val upload: FileStoreUpload,

    /**
     * URL under which the file ist accessible.
     */
    val storeUrl: String,

    /**
     * For using a different name than the original file name.
     */
    val displayName: String = upload.name
) : AppEntity()

/**
 * Result of the file store for an assignment.
 */
@Embeddable
data class FileStoreAssignment(
    val fid: String,
    val url: String,
    val publicUrl: String,
    val count: Int,
)

/**
 * Result of the file store for an upload.
 */
@Embeddable
data class FileStoreUpload(
    val name: String,
    val size: Long,
    val eTag: String,
)

/**
 * Result of the file store for a deletion.
 */
data class FileStoreDelete(
    val size: Long,
)
