from typing import Any
from uuid import uuid4

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.utils.list_utils import distinct_by


class WithReferencesRetriever(BaseRetriever):
    """
    Class responsible for retrieving documents with references.

    Documents which reference other documents are referred to as meta-documents.
    These meta-documents are not retrieved but used to retrieve the original document.
    Meta-documents are created from the headings of a document, that is split by headings.
    """

    def __init__(self, config: DomainConfig, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)

        self._vector_store = config.vector_store_manager.load()
        self._logger = config.logger

    def _get_relevant_documents(
            self, queries: list[str], *, run_manager: CallbackManagerForRetrieverRun) -> list[Document]:

        docs: list[Document] = []
        for query in queries:
            query = query.strip()
            self._logger.info(f'Searching for "{query}"')
            queried_docs = self._search_with_score(query.strip())
            docs.extend(queried_docs)
            self._logger.info(f'Retrieved {len(queried_docs)} documents')
            referenced_docs = self._get_referenced_docs(query, queried_docs)
            self._logger.info(f'Retrieved {len(referenced_docs)} referenced documents')
            docs.extend(referenced_docs)

        self._logger.info(f'Retrieved {len(docs)} documents in total')
        distinct = distinct_by(self._id_or_random, docs)
        self._logger.info(f'Retrieved {len(distinct)} distinct documents')
        real_docs = list(filter(lambda x: 'id' in x.metadata, distinct))
        self._logger.info(f'Retrieved {len(real_docs)} real documents')
        return real_docs

    def _search_with_score(self, query: str) -> list[Document]:
        try:
            docs, scores = zip(
                *self._vector_store.similarity_search_with_score(
                    query,
                    k=5
                )
            )
        except Exception as e:
            print('Exception:', e)
            return []
        result = []
        doc: Document
        for doc, np_score in zip(docs, scores):
            score = float(np_score)
            doc.metadata['score'] = score
            if np_score < 5:
                result.append(doc)

        return result

    def _get_referenced_docs(self, query: str, docs: list[Document]) -> list[Document]:
        referenced_docs: list[Document] = []
        for doc in docs:
            if 'references' in doc.metadata:
                ids: str = doc.metadata['references']
                queried_docs = self._vector_store.similarity_search(
                    query,
                    k=1000,
                    # filter=lambda metadata: (metadata['id'] in ids) if 'id' in metadata else False,
                    # filter={'id__in': ';'.join(ids)},
                )
                filtered_docs: list[Document] = list(filter(
                    lambda d: (d.metadata['id'] in ids) if 'id' in d.metadata else False,
                    queried_docs
                ))

                for filtered_doc in filtered_docs:
                    if 'score' in filtered_doc.metadata:
                        print('has already a score')
                    filtered_doc.metadata['score'] = doc.metadata['score']

                referenced_docs.extend(filtered_docs)
        return referenced_docs

    @staticmethod
    def _id_or_random(doc: Document) -> Any:
        return doc.metadata['id'] if 'id' in doc.metadata else str(uuid4())
