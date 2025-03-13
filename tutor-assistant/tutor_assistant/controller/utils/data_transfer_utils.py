import json
from typing import Any

from tutor_assistant.controller.utils.langchain_utils import escape_prompt


def messages_from_history(history: list[dict[str, str]]) -> list[tuple[str, str]]:
    """
    converts history from dict to tuple
    """

    messages = []

    for message in history:
        content = escape_prompt(message['content'])
        messages.append((message['role'], content))

    return messages


def json_output(text: str) -> dict[str, Any]:
    """
    Formats LLM-generated JSON-output
    """

    start_index = text.find('{')
    end_index = text.rfind('}')

    if start_index == -1 or end_index == -1 or start_index > end_index:
        return {}

    return json.loads(text[start_index:end_index + 1])
