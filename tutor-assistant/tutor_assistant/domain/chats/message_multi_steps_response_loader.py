from typing import Iterator, Generator, Any

from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableSerializable

from tutor_assistant.controller.utils.data_transfer_utils import messages_from_history
from tutor_assistant.controller.utils.langchain_utils import escape_prompt
from tutor_assistant.domain.documents.retrievers.with_references_retriever import WithReferencesRetriever
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.utils.templates import prepend_base_template


class MessageMultiStepsResponseLoader:
    """
    Alias MultiStepsRetriever.

    Tries to load a response for documents based on simple retrieving first.
    If LLM cannot answer the question it provides new vectorstore-queries.
        - New documents from WithReferencesRetriever and provided queries.
        - LLM response for these documents, no further queries.
    """


    def __init__(self, config: DomainConfig):
        self._config = config

    def load_response(self, user_message_content: str, history: list[dict[str, str]]) -> Generator[Any, Any, None]:
        messages = self._get_all_messages(user_message_content, history)
        yield from self._get_response_for_queries(messages, [user_message_content], ['first.txt', 'last.txt'])

    def _get_response_for_queries(
            self, messages: list[tuple[str, str]], queries: list[str], templates: list[str]
    ) -> Generator[Any, Any, None]:

        retriever_chain = self._get_retriever_chain(queries)
        model_chain = self._get_model_chain(messages, templates[0])

        result = RunnablePassthrough.assign(context=retriever_chain).assign(answer=model_chain).stream({})

        contexts = []
        answer_start = ''

        for item in result:
            if 'context' in item:
                contexts.append(item)
            elif 'answer' in item:
                answer_start += item['answer']

                if '!!!QUERIES!!!' in answer_start:
                    print('!!!QUERIES!!!')
                    queries = self._get_queries_from_answer(result)
                    yield from self._get_response_for_queries(messages, queries, templates[1:])
                    break
                elif '!!!RESPONSE!!!' in answer_start:
                    print('!!!RESPONSE!!!')
                    yield from contexts
                    yield from self._yield_response(result)
                    break
                elif len(answer_start) > 14:
                    print('Long enough')
                    yield from contexts
                    yield answer_start
                    yield from self._yield_response(result)
                    break

    @staticmethod
    def _get_all_messages(user_message_content: str, history) -> list[tuple[str, str]]:
        messages = []
        for msg in messages_from_history(history):
            messages.append(msg)
        messages.append(('user', escape_prompt(user_message_content)))

        return messages

    def _get_queries_from_answer(self, result: Iterator) -> list[str]:
        answer = ''
        for item in result:
            if 'answer' in item:
                answer += item['answer']

        queries = answer.split(';')
        self._config.logger.info(f'Queries from chat model: {queries}')
        return queries

    @staticmethod
    def _yield_response(result: Iterator) -> Generator[Any, Any, None]:
        for item in result:
            yield item

    def _get_retriever_chain(self, queries: list[str]) -> RunnableSerializable[Any, list[Document]]:
        return (lambda _: queries) | WithReferencesRetriever(self._config)

    def _get_model_chain(self, messages: list[tuple[str, str]], template: str):
        prompt = self._get_chat_prompt(messages, template)
        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt | model | parser

    def _get_chat_prompt(self, messages: list[tuple[str, str]], template: str) -> ChatPromptTemplate:
        template = self._config.resources['prompt_templates']['multi_steps'][template]
        complete_template = prepend_base_template(self._config, template)

        prompt_messages = [('system', complete_template)]
        prompt_messages.extend(messages)

        prompt_template = ChatPromptTemplate.from_messages(prompt_messages)

        return prompt_template
