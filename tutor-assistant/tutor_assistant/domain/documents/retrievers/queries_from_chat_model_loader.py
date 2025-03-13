from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.domain.domain_config import DomainConfig


def get_queries(config: DomainConfig, messages: list[tuple[str, str]]) -> list[str]:
    """
    Returns multiple vectorstore queries from a chat model based on given chat-messages
    """
    chain = _get_chat_prompt(config, messages) | config.chat_model
    content = chain.invoke({}).content
    print('content', content)
    queries = content.split(';')

    return queries


def _get_chat_prompt(config: DomainConfig, messages: list[tuple[str, str]]) -> ChatPromptTemplate:
    multiple_prompts = config.resources['prompt_templates']['generate_retriever_queries.txt']
    prompt_messages = messages + [('system', multiple_prompts)]
    return ChatPromptTemplate.from_messages(prompt_messages)
