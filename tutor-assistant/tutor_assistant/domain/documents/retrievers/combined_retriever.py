from typing import Any

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

from tutor_assistant.domain.documents.retrievers.queries_from_chat_model_loader import get_queries
from tutor_assistant.domain.documents.retrievers.with_references_retriever import WithReferencesRetriever
from tutor_assistant.domain.domain_config import DomainConfig


class CombinedRetriever(BaseRetriever):
    """
    Generates queries from chat model based on chat-messages.
    Retrieves documents for these queries using the WithReferencesRetriever.
    """
    def __init__(self, config: DomainConfig, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self._config = config
        self._with_references_retriever = WithReferencesRetriever(config)

    def _get_relevant_documents(
            self, messages: list[tuple[str, str]], *, run_manager: CallbackManagerForRetrieverRun
    ) -> list[Document]:
        queries = get_queries(self._config, messages)

        return ((lambda _: queries) | self._with_references_retriever).invoke({})
