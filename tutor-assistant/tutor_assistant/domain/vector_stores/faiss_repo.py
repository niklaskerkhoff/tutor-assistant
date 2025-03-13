import os

import faiss
from langchain_community.docstore import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain_core.embeddings import Embeddings

from tutor_assistant.domain.vector_stores.vector_store_repo import VectorStoreRepo


class FaissRepo(VectorStoreRepo):

    def __init__(self, store_path: str, embeddings: Embeddings):
        self._store_path = store_path
        self._embeddings = embeddings

    def create_if_not_exists(self) -> FAISS:
        if os.path.exists(self._store_path):
            return self.load()

        index = faiss.IndexFlatL2(len(self._embeddings.embed_query("hello world")))

        store = FAISS(
            embedding_function=self._embeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

        self.save(store)

        return store

    def save(self, store: FAISS) -> None:
        store.save_local(self._store_path)

    def load(self) -> FAISS:
        return FAISS.load_local(self._store_path, self._embeddings, allow_dangerous_deserialization=True)
