from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.controller.utils.data_transfer_utils import messages_from_history


class SummaryChainService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def create(self, history):
        """
        Chain for summarizing chat history
        """

        messages = messages_from_history(history)

        system_prompt = self._config.resources['prompt_templates']['chat_summary.txt']

        messages.append(('system', system_prompt))

        prompt_template = ChatPromptTemplate.from_messages(messages)

        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt_template | model | parser
