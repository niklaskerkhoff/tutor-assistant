import re
from typing import Iterator

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document


class AssignmentPdfUrlLoader(BaseLoader):
    """
    Loads Assignment-PDFs from a given URL and splits them by pages.
    Adds the current exercise heading to each page belonging to an exercise.
    """

    _heading_regex = re.compile(r'Aufgabe\s[A-Z]:\s.+\(\d+\sPunkte\)')

    def __init__(self, title: str, url: str):
        self._title = title
        self._url = url

    def lazy_load(self) -> Iterator[Document]:
        documents = PyPDFLoader(self._url).load()

        heading = None

        for document in documents:
            matches = self._heading_regex.findall(document.page_content)
            add_present_heading = True
            if matches and len(matches) > 0:
                heading = matches[0]
                add_present_heading = False

            if heading is not None:
                document.metadata['headings'] = f'{self._title}\n{heading}'
                if add_present_heading:
                    document.page_content = f'{heading}\n\n{document.page_content}'

            yield document
