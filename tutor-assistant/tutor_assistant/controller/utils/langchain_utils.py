import json
from typing import Iterator

from langchain_core.documents import Document

from tutor_assistant.controller.utils.event_stream_utils import event_end, event_output


def stream_response(response: Iterator, answer_key='answer', context_key='context'):
    """
    outputs an event stream for a response
    """
    for item in response:
        if context_key in item:
            yield from _handle_context(item[context_key], context_key)
        elif answer_key in item:
            yield from _handle_answer(item[answer_key])
        else:
            yield from _handle_answer(item)

    yield event_end()


def _handle_context(tokens, context_key: str):
    if isinstance(tokens, list):
        token: Document
        for token in tokens:
            encoded_token = json.dumps(token.to_json())
            yield event_output(f'##########{context_key}:{encoded_token}')


def _handle_answer(token):
    if isinstance(token, str):
        token = token.replace('\n', '\\n')
        yield event_output(token)


def escape_prompt(content: str) -> str:
    """
    Escapes {} in prompt-templates
    """
    return content.replace('{', '{{').replace('}', '}}')
