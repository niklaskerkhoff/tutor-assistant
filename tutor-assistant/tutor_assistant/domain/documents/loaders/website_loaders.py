from typing import Iterator

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document

from tutor_assistant.domain.documents.text_splitters.heading_splitter import split_html_by_headings
from tutor_assistant.domain.documents.utils.content_loader_utils import load_website_html


class WebsiteSplitByHeadingsLoader(BaseLoader):
    """
    Loads the content from an HTML element on a website, removes comments and splits them by headings of level 1-3.
    For further information see split_by_headings.
    """

    def __init__(self, title: str, url: str, html_selector: str, html_selection_index: int):
        self._title = title
        self._url = url
        self._html_selector = html_selector
        self._html_selection_index = html_selection_index

    def lazy_load(self) -> Iterator[Document]:
        content = load_website_html(self._url, self._html_selector, self._html_selection_index)
        yield from split_html_by_headings(content, self._title)
