from langchain_core.vectorstores import VectorStore


class VectorStoreRepo:
    """
    Abstraction for handling vector stores as they do not provide a consistent interface for loading and persisting.
    """

    def create_if_not_exists(self) -> VectorStore:
        raise NotImplementedError()

    def save(self, store) -> None:
        raise NotImplementedError()

    def load(self) -> VectorStore:
        raise NotImplementedError()
