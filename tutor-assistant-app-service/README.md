# Tutor Assistant App Service

## Struktur

- `lib` enthält allgemein wiederverwendbare Quelldateien
- `modules` stellt die Funktionalität zur Verfügung

**Module**

- Stellen Funktionalität zur Verfügung
- Enthalten RestController, Services, Repository, Entities und ValueObjects

**Zentrale Dateien**

- `ChatService`: Verwaltet Chats mit ihrem Verlauf und ihrer Zusammenfassung in der Datenbank
    - Lädt Antworten zu Nachrichten (inklusive Chat-Verlauf) vom Tutor Assistant
        - Speichert die Nachricht des Benutzers
        - Lädt und speichert die Antwort-Nachricht und ihre RAG-Kontexte
        - Lädt eine neue Zusammenfassung des Chat-Verlaufs
    - Die Antwort einer Nachricht wird als `Flux<String>` zurückgegeben
        - Ermöglicht das Ausgeben der Tokens, bevor die gesamte Antwort geladen wurde
- `InfoService`: Lädt Termine und Fristen vom Tutor Assistant
- `FileStoreService`: Speichert und verwaltet Dokumente mit SeaweedFS
- `RAGServiceDocumentService`: Verwaltet Dokumente im Tutor Assistant (Dieser speichert sie in einem VectorStore)
- `FileService`: Verwaltet hochgeladene Dateien mit `FileStoreService`, `RagDocumentService` und einer
  Referenz in der Datenbank
- `WebsiteService`: Verwaltet zu verwendende Websites mit `RagDocumentService` und einer Referenz in der
  Datenbank
