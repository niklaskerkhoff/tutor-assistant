package de.niklaskerkhoff.tutorassistantappservice.lib.filestore

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntityRepo

interface FileStoreFileReferenceDefaultRepo : AppEntityRepo<FileStoreFileReference> {
    fun findAllByDisplayName(name: String): List<FileStoreFileReference>
}
