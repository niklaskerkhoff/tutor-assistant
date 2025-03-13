import uuid
from typing import Optional

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.domain.domain_config import DomainConfig


class DocumentService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def add(self, loader: BaseLoader, title: str, original_key: str, is_calendar: bool) -> list[str]:
        """
        Loads documents from loader and adds them to vector store.
        :param loader: to load the documents
        :param title: of the whole document
        :param original_key: for identifying the original file or website
        :param is_calendar: specifies if the document shall be used to generate the calendar
        :return: a list of ids of the added documents
        """

        documents = loader.load()
        ids: list[str] = []
        for i, doc in enumerate(documents):
            doc.id = str(uuid.uuid4())
            doc.metadata['id'] = doc.id
            doc.metadata['title'] = title
            doc.metadata['originalKey'] = original_key
            doc.metadata['isCalendar'] = is_calendar
            ids.append(doc.id)

        store = self._config.vector_store_manager.load()
        store_ids = store.add_documents(documents)

        if store_ids != ids:
            raise RuntimeError(
                f'ids and store_ids should be equal, but got ids={ids} and store_ids={store_ids}')

        if self._config.embed_meta_docs:
            meta_docs = self._get_meta_docs(documents)
            if len(meta_docs) > 0:
                meta_doc_ids = store.add_documents(meta_docs)
                store_ids.extend(meta_doc_ids)

        self._config.vector_store_manager.save(store)

        return store_ids

    def delete(self, ids: list[str]) -> Optional[bool]:
        """
        Deletes documents with the given ids from vector store.
        :param ids: of the documents to delete
        :return: true if successful
        """
        store = self._config.vector_store_manager.load()
        success = store.delete(ids)
        self._config.vector_store_manager.save(store)

        return success

    @staticmethod
    def _get_meta_docs(docs: list[Document]) -> list[Document]:
        meta_docs = []
        for doc in docs:
            if 'headings' in doc.metadata:
                meta_doc = Document(
                    doc.metadata['headings'],
                    metadata={'references': doc.metadata['id']}
                )
                meta_docs.append(meta_doc)

        return meta_docs


