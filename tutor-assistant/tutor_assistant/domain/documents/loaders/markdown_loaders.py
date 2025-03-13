import re
from typing import Iterator

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document

from tutor_assistant.domain.documents.text_splitters.heading_splitter import split_by_headings
from tutor_assistant.domain.documents.utils.content_loader_utils import load_content_from_url


class MarkdownUrlSplitByHeadingsLoader(BaseLoader):
    """
    Loads Markdown files from a given URL, removes comments and splits them by headings of level 1-3.
    For further information see split_by_headings.
    """

    def __init__(self, title: str, url: str):
        self._title = title
        self._url = url

    def lazy_load(self) -> Iterator[Document]:
        content = load_content_from_url(self._url)
        yield from _process_markdown_by_headings(self._title, content)


def _process_markdown_by_headings(title: str, content: str) -> list[Document]:
    cleaned = _remove_comments(content)
    return split_by_headings(cleaned, re.compile(r'(?P<level>#+)\s*(?P<heading>.+)'), title)


def _remove_comments(content: str) -> str:
    return re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
