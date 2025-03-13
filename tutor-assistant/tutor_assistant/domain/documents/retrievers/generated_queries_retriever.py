from typing import Any
from uuid import uuid4

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

from tutor_assistant.domain.documents.retrievers.queries_from_chat_model_loader import get_queries
from tutor_assistant.domain.documents.utils.vector_store_utils import similarity_search_with_score
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.utils.list_utils import distinct_by


class GeneratedQueriesRetriever(BaseRetriever):
    """
    Retrieves documents from vectorstore by generating queries from chat model based on chat-messages.
    """
    def __init__(self, config: DomainConfig, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self._vector_store = config.vector_store_manager.load()
        self._config = config

    def _get_relevant_documents(
            self, messages: list[tuple[str, str]], *, run_manager: CallbackManagerForRetrieverRun
    ) -> list[Document]:
        queries = get_queries(self._config, messages)
        all_docs = []
        for query in queries:
            docs = similarity_search_with_score(self._vector_store, query)
            all_docs.extend(docs)
        return distinct_by(self._id_or_random, all_docs)

    @staticmethod
    def _id_or_random(doc: Document) -> Any:
        return doc.metadata['id'] if 'id' in doc.metadata else str(uuid4())
