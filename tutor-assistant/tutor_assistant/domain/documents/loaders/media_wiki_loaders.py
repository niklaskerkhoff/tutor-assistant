import re
from typing import Iterator

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document

from tutor_assistant.domain.documents.text_splitters.heading_splitter import split_by_headings
from tutor_assistant.domain.documents.utils.content_loader_utils import load_content_from_url, \
    load_website_text


class MediaWikiUrlSplitByHeadingsLoader(BaseLoader):
    """
    Loads Media-Wiki files from a given URL, removes comments and splits them by headings of level 1-3.
    For further information see split_by_headings.
    """

    def __init__(self, title: str, url: str):
        self._title = title
        self._url = url

    def lazy_load(self) -> Iterator[Document]:
        content = load_content_from_url(self._url)
        yield from _process_media_wiki_by_headings(self._title, content)


class MediaWikiWebsiteSplitByHeadingsLoader(BaseLoader):
    """
    Loads Media-Wiki content from an HTML element on a website, removes comments and splits them by headings of level 1-3.
    For further information see split_by_headings.
    """

    def __init__(self, title: str, url: str, html_selector: str, html_selection_index: int):
        self._title = title
        self._url = url
        self._html_selector = html_selector
        self._html_selection_index = html_selection_index

    def lazy_load(self) -> Iterator[Document]:
        content = load_website_text(self._url, self._html_selector, self._html_selection_index)
        yield from _process_media_wiki_by_headings(self._title, content)


def _process_media_wiki_by_headings(title: str, content: str) -> list[Document]:
    cleaned = _remove_comments(content)
    return split_by_headings(cleaned, re.compile(r'(?P<level>=+)\s*(?P<heading>[^\n=]+)\s*(?P=level)\s*'), title)


def _remove_comments(content: str) -> str:
    return re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
