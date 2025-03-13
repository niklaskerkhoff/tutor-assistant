# RAG-Service

Der RAG-Service ermöglicht es, Antworten zu Fragen zu Dokumenten von einem Sprachmodell generieren zu lassen.

Die Dokumente, zu denen Fragen beantwortet werden sollen, müssen vorerst in einem Vectorstore gespeichert werden. Der
RAG-Service stellt einen API-Endpoint sowie verschiedene Strategien zum Laden und Verarbeiten von Dokumenten zur
Verfügung.
Diese Strategien sind teilweise explizit für die relevanten Dokumente der Programmieren-Vorlesung entwickelt und
verbessern die Ergebnisse der Anfragen an den Vectorstore.

## Setup

- Installiere `requirements.txt`
- Setze die Umgebungsvariablen basierend auf `template.env`
- Verzeichnis mit dem Namen `data` im Projekt-Verzeichnis erstellen (speichert Vectorstore und Logs)
- `main.py` im Projekt-Verzeichnis starten

## Konfiguration

Es wurde darauf geachtet, dass `domain` konfigurierbar und erweiterbar ist. Die Konfigurationen befinden sich in
`tutor_assistant/controller/config`

- `domain_config.py` spezifiziert insbesondere das verwendete ChatModel und den verwendeten Vectorstore
- `loaders_config.py` definiert unterstützte Strategien zur Einbettung von Dokumenten

## Struktur

`root`
- `data`: Speichern des VectorStores und der Logs
- `resources`: Statische Konfigurationsdateien
- `tutor_assistant`: Python-Code

`tutor_assistant`
- `controller`
    - Stellt API zur Verfügung
    - Konfiguriert die zu verwendenden Technologien, insbesondere ChatModel und Vectorstore
    - Konfiguriert die Erstellung der DocumentLoader

- `domain`
    - `chats`
        - Fragen zu Dokumenten per RAG von ChatModel beantworten
        - Chat-Verläufe von ChatModel zusammenfassen
    - `documents`
        - Dokumente laden, verarbeiten und im Vectorstore speichern
    - `calendar`
        - Termine und Fristen von ChatModel erfragen
    - `vector_stores`
        - Funktionalität zur Verwaltung von VectorStores

## Hinweis

Der RAG-Service hieß vorher Tutor-Assistant. Um keine Komplikationen beim Deployment zu verursachen, wurde er nicht vollständig umbenannt.
