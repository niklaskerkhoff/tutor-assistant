/**
 * Main or value setting
 *
 * @property id unique string
 * @property name unique human-readable id
 * @property content specifying what setting to perform
 * @property type either 'MAIN' or 'VALUES'
 */
export interface Setting {
    id: string
    name: string
    content: string
    type: 'MAIN' | 'VALUES'
}

/**
 * Resource like a file
 *
 * @property id unique string
 * @property displayName unique human-readable id
 */
export interface Resource {
    id: string
    displayName: string
}

/**
 * Embedded document
 *
 * @property id unique string
 * @property title human readable string, must not be unique
 * @property loaderType specifying how the document is loaded
 * @property collection for grouping
 */
export interface RagDocument {
    id: string
    title: string
    loaderType: string
    collection?: string
}

/**
 * Embedded file document
 *
 * @property fileStoreId unique string from the file store
 */
export interface FileDocument extends RagDocument {
    fileStoreId: string
}

/**
 * Embedded website document
 *
 * @property url of the website
 */
export interface WebsiteDocument extends RagDocument {
    url: string
}