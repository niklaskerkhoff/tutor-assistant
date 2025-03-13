from typing import Any, Callable

from langchain.retrievers import SelfQueryRetriever
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableSerializable, chain

from tutor_assistant.controller.utils.data_transfer_utils import messages_from_history
from tutor_assistant.controller.utils.langchain_utils import escape_prompt
from tutor_assistant.domain.chats.message_multi_steps_response_loader import MessageMultiStepsResponseLoader
from tutor_assistant.domain.documents.retrievers.combined_retriever import CombinedRetriever
from tutor_assistant.domain.documents.retrievers.generated_queries_retriever import GeneratedQueriesRetriever
from tutor_assistant.domain.documents.retrievers.with_references_retriever import WithReferencesRetriever
from tutor_assistant.domain.documents.utils.vector_store_utils import similarity_search_with_score
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.utils.templates import prepend_base_template


class MessageChainService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def load_response(self, user_message_content: str, history: list[dict[str, str]]):
        """
        Load a response for the user message content and history based on the specified retriever configuration.

        :return:
            A generator that streams the responses generated based on the specific retriever configuration
            and the model chain.
        """

        retriever_name = self._config.retriever_name

        if retriever_name == 'multi-steps-retriever':
            yield from MessageMultiStepsResponseLoader(self._config).load_response(user_message_content, history)
            return

        messages = self._get_all_messages(user_message_content, history)

        retrievers: dict[str, Callable[[str], RunnableSerializable[Any, list[Document]]]] = {
            'base-retriever': self._get_base_retriever_chain,
            'self-query-retriever': self._get_self_query_retriever_chain,
            'generated-queries-retriever': lambda _: self._get_generated_queries_retriever(messages),
            'combined-retriever': lambda _: self._get_combined_retriever(messages),
            'with-references-retriever': self._get_with_references_retriever,
        }

        if retriever_name not in retrievers:
            raise ValueError(f'Retriever {retriever_name} not found')

        chat_prompt = self._get_chat_prompt(messages)
        model_chain = self._get_model_chain(chat_prompt)
        retriever = retrievers[retriever_name]
        retriever_chain = retriever(user_message_content)

        yield from (RunnablePassthrough.assign(context=retriever_chain).assign(answer=model_chain)).stream({})

    @staticmethod
    def _get_all_messages(user_message_content: str, history) -> list[tuple[str, str]]:
        messages = []
        for msg in messages_from_history(history):
            messages.append(msg)
        messages.append(('user', escape_prompt(user_message_content)))

        return messages

    def _get_chat_prompt(self, messages: list[tuple[str, str]]) -> ChatPromptTemplate:
        template = self._config.resources['prompt_templates']['chat_message.txt']
        complete_template = prepend_base_template(self._config, template)

        prompt_messages = [('system', complete_template)]
        prompt_messages.extend(messages)

        prompt_template = ChatPromptTemplate.from_messages(prompt_messages)

        return prompt_template

    def _get_model_chain(self, prompt) -> RunnableSerializable[Any, str]:
        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt | model | parser

    def _get_base_retriever_chain(self, query: str) -> RunnableSerializable[Any, list[Document]]:
        self._config.logger.info(f'BaseRetriever for "{query}"')

        @chain
        def search_chain(q: str):
            return similarity_search_with_score(self._config.vector_store_manager.load(), q)

        return (lambda _: query) | search_chain

    def _get_self_query_retriever_chain(self, query: str) -> RunnableSerializable[Any, list[Document]]:
        self._config.logger.info(f'SelfQueryRetriever for "{query}"')

        document_content_description = "Informationen zu Programmieren an der Uni"
        llm = self._config.chat_model
        retriever = SelfQueryRetriever.from_llm(
            llm, self._config.vector_store_manager.load(), document_content_description, [],
            enable_limit=True,
            verbose=True
        )

        query += " Gib mir maximal 5 Dokumente!"
        return (lambda _: query) | retriever

    def _get_combined_retriever(self, messages: list[tuple[str, str]]) -> RunnableSerializable[
        Any, list[Document]]:

        self._config.logger.info(f'CombinedRetriever for "{messages}"')

        return (lambda _: messages) | CombinedRetriever(self._config)

    def _get_generated_queries_retriever(self, messages: list[tuple[str, str]]) -> RunnableSerializable[
        Any, list[Document]]:

        self._config.logger.info(f'QueriesFromChatModelRetriever for "{messages}"')

        return (lambda _: messages) | GeneratedQueriesRetriever(self._config)

    def _get_with_references_retriever(self, query: str) -> RunnableSerializable[Any, list[Document]]:
        self._config.logger.info(f'WithReferencesRetriever for "{query}"')

        return (lambda _: [query]) | WithReferencesRetriever(self._config)
