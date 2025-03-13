package de.niklaskerkhoff.tutorassistantappservice.lib.filestore

import java.util.*

data class FileStoreFileReferenceDto(
    val id: UUID?,
    val displayName: String
) {
    constructor(fileReference: FileStoreFileReference) : this(
        id = fileReference.id,
        displayName = fileReference.displayName
    )
}

fun FileStoreFileReference.toDto() = FileStoreFileReferenceDto(this)
