package de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.settings

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.Document
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.FileDocument
import de.niklaskerkhoff.tutorassistantappservice.modules.embedding_manager.documents.entities.WebsiteDocument
import java.util.*

/**
 * Parses the JSON of the main setting.
 */
class SettingsParser(
    /**
     * Reads the JSON.
     */
    private val objectMapper: ObjectMapper,

    /**
     * Main setting that is read and parsed.
     */
    private val mainJson: String,

    /**
     * Values from value settings.
     * The key of the map is the filename of the value setting
     *      and thus a proper value for the "values" keys in the main setting.
     * The value of the map is the list of the values specified by the value setting.
     */
    private val allValues: Map<String, List<String>>,

    /**
     * Maps the filename of a file resource to its file store id and url.
     * These filenames are a proper values for the "filename" keys in the main setting.
     */
    private val fileStoreIdsAndUrls: Map<String, Pair<UUID?, String>>,

    /**
     * Maps the name of a strategy to the strategy.
     * The keys can be used for inserting values from value settings in the main setting.
     * The value is transformed by the strategy.
     */
    private val valueStrategies: Map<String, (String) -> String>
) {
    companion object {
        private const val WEBSITE_TYPE = "Website"
        private const val FILE_TYPE = "File"
        private val VALUE_REGEX = "\\$\\{(\\w+)}".toRegex()
    }

    /**
     * Parses the main setting.
     *
     * @returns the resulting documents.
     */
    fun parse(): List<Document> {
        val json = objectMapper.readTree(mainJson)

        return parseRoot(json)
    }

    private fun parseRoot(json: JsonNode): List<Document> {
        json.requireArray()

        return json.elements().asSequence().map { parseCollectionOrDocument(it) }.flatten().toList()
    }

    private fun parseCollectionOrDocument(json: JsonNode): List<Document> {
        json.requireObject()

        return when {
            json.has("title") -> listOf(parseDocument(json, null, null))
            json.has("collection") -> parseCollection(json)
            else -> throw SettingsParserException("Failed parsing collection or document")
        }
    }

    private fun parseCollection(json: JsonNode): List<Document> {
        json.requireObjectKeys("collection")

        val collection = json["collection"].stringOrThrow()

        return when {
            json.has("elements") -> parseElements(json["elements"], collection)
            json.has("elementsBuilder") -> parseElementsBuilder(json["elementsBuilder"], collection, json.getValues())
            else -> throw SettingsParserException("Failed parsing collection")
        }
    }

    private fun parseElements(json: JsonNode, collection: String?): List<Document> {
        json.requireArray()

        return json.elements().asSequence().map { parseDocument(it, collection, null) }.toList()
    }

    private fun parseElementsBuilder(
        json: JsonNode,
        collection: String?,
        values: List<String>
    ): List<Document> {
        json.requireObject()

        return values.map { parseDocument(json, collection, it) }
    }

    private fun parseDocument(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("type")

        val type = json["type"].stringOrThrow()

        return when (type) {
            WEBSITE_TYPE -> parseWebsite(json, collection, value)
            FILE_TYPE -> parseFile(json, collection, value)
            else -> throw SettingsParserException("Failed parsing document")
        }
    }

    private fun parseFile(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("title", "loaderType", "filename")

        val (fileStoreId, fileStoreUrl) = json.getUrlFromFilename(value)

        return FileDocument(
            json["title"].stringWithValueOrThrow(value),
            json["loaderType"].stringWithValueOrThrow(value),
            collection,
            json["isCalendar"].booleanOrFalse(),
            fileStoreId,
            fileStoreUrl
        )
    }

    private fun parseWebsite(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("title", "loaderType", "loaderParams")

        return WebsiteDocument(
            json["title"].stringWithValueOrThrow(value),
            json["loaderType"].stringWithValueOrThrow(value),
            collection,
            json["isCalendar"].booleanOrFalse(),
            parseWebsiteLoaderParams(json["loaderParams"], value)
        )
    }

    private fun parseWebsiteLoaderParams(json: JsonNode, value: String?): WebsiteDocument.LoaderParams {
        json.requireObjectKeys("url", "htmlSelector", "htmlSelectionIndex")

        return WebsiteDocument.LoaderParams(
            json["url"].stringWithValueOrThrow(value),
            json["htmlSelector"].stringWithValueOrThrow(value),
            json["htmlSelectionIndex"].intOrThrow()
        )
    }

    private fun JsonNode?.requireNotNull() {
        if (this == null) throw SettingsParserException("Node is null")
    }

    private fun JsonNode.requireObject() {
        requireNotNull()
        if (!isObject) throw SettingsParserException("Node is not an object")
    }

    private fun JsonNode.requireArray() {
        requireNotNull()
        if (!isArray) throw SettingsParserException("Node is not an array")
    }

    private fun JsonNode.requireObjectKeys(vararg keys: String) {
        requireNotNull()
        keys.forEach { if (!has(it)) throw SettingsParserException("Key $it not found in node") }
    }

    private fun JsonNode.stringOrThrow(): String {
        requireNotNull()
        if (!isTextual) throw SettingsParserException("Node is not a string")
        return asText()
    }

    private fun JsonNode.intOrThrow(): Int {
        requireNotNull()
        if (!isInt) throw SettingsParserException("Node is not an int")
        return asInt()
    }

    private fun JsonNode.getValues(): List<String> {
        requireNotNull()
        requireObjectKeys("values")

        val key = this["values"].stringOrThrow()

        return allValues[key] ?: throw SettingsParserException("Values for key $key not found")
    }

    private fun JsonNode.getUrlFromFilename(value: String?): Pair<UUID, String> {
        requireNotNull()
        val filename = this["filename"].stringWithValueOrThrow(value)
        val idAndUrl = fileStoreIdsAndUrls[filename] ?: throw SettingsParserException("File $filename does not exist")
        val id = idAndUrl.first ?: throw SettingsParserException("File store id must not be null")
        return Pair(id, idAndUrl.second)
    }

    private fun JsonNode.stringWithValueOrThrow(value: String?): String {
        requireNotNull()
        val string = stringOrThrow()
        if (value == null) return string

        return VALUE_REGEX.replace(string) { matchResult ->
            val strategyName = matchResult.groups[1]?.value
                ?: throw SettingsParserException("Unknown error reading strategy name")
            val strategy = valueStrategies[strategyName]
                ?: throw SettingsParserException("Value strategy $strategyName does not exist")

            strategy(value)
        }
    }

    private fun JsonNode?.booleanOrFalse(): Boolean {
        if (this == null) return false
        return booleanValue()
    }
}
