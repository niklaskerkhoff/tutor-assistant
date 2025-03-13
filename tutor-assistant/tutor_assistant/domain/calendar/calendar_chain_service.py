from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.utils.templates import prepend_base_template


class CalendarChainService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def create(self):
        """
        :return: chain for generating a new calendar
        """
        template = self._config.resources['prompt_templates']['calendar_chat_model.txt']
        complete_template = prepend_base_template(self._config, template)
        prompt_template = ChatPromptTemplate.from_template(complete_template)
        model_chain = self._get_model_chain(prompt_template)

        retriever_prompt = self._config.resources['prompt_templates']['calendar_vector_store.txt']
        retriever_chain = self._get_retriever_chain(retriever_prompt)

        return (
            RunnablePassthrough
            .assign(context=retriever_chain)
            .assign(answer=model_chain)
        )

    def _get_model_chain(self, prompt):
        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt | model | parser

    def _get_retriever_chain(self, query: str):
        return lambda _: self._retriever(query)

    def _retriever(self, query: str) -> list[Document]:
        vector_store = self._config.vector_store_manager.load()
        try:
            docs, scores = zip(*vector_store.similarity_search_with_score(query, k=1000))
        except:
            return []
        result = []
        doc: Document
        for doc, score in zip(docs, scores):
            if 'isCalendar' in doc.metadata and doc.metadata['isCalendar']:
                doc.metadata["score"] = score
                result.append(doc)

        return result
