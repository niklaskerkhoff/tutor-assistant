from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings

from tutor_assistant.domain.vector_stores.vector_store_repo import VectorStoreRepo


class ChromaRepo(VectorStoreRepo):

    def __init__(self, store_path: str, embeddings: Embeddings):
        self._store_path = store_path
        self._embeddings = embeddings

    def create_if_not_exists(self) -> Chroma:
        return self.load()

    def save(self, store) -> None:
        pass

    def load(self) -> Chroma:
        return Chroma(embedding_function=self._embeddings, persist_directory=self._store_path)
