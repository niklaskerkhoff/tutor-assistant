import re

from bs4 import BeautifulSoup
from langchain_core.documents import Document


def split_html_by_headings(html: str, title: str, max_level=3) -> list[Document]:
    """
    Splits text by regex.
    See split_by_headings for more information.
    """

    regex = re.compile(r'<h(?P<level>[1-6])>\s*(?P<heading>.*?)\s*</h(?P=level)>')
    soup = BeautifulSoup(html, 'html.parser')

    for level in range(1, max_level + 1):
        for heading in soup.find_all(f'h{level}'):
            heading_text = heading.text.strip().replace('\n', '')
            heading.string = heading_text
            heading.insert_before("\n")
            heading.insert_after("\n")

    docs = split_by_headings(str(soup), regex, title, max_level)

    for doc in docs:
        soup = BeautifulSoup(doc.page_content, 'html.parser')
        doc.page_content = soup.text
    return docs


def split_by_headings(text: str, regex: re.Pattern[str], title: str, max_level=3) -> list[Document]:
    """
    Splits text by regex.
    Text is analysed line by line so only one-liners can be recognized from the regex.
    The regex must contain a group called 'level' and 'heading'.
        - The heading is the found heading-text
        - Level is the level of the heading (section, subsection, subsubsection,...)
            - Level can be digit (e.g. <h2> for HTML) or a string (e.g. ## for Markdown).
    """

    if max_level < 1:
        max_level = 1

    sections: list[Document] = []
    content = ''
    headings = []
    headings[:] = [None] * max_level
    heading_codes = {}

    def get_heading_str():
        result = f'{title}\n'
        for heading in headings:
            if heading is not None:
                result += f'{heading_codes[heading]}\n'

        return result

    def append_document():
        if len(content.strip()) > 0:
            heading_str = get_heading_str()
            doc = Document(f'{heading_str}\n{content}')
            doc.metadata['headings'] = heading_str
            sections.append(doc)

    def handle_match():
        level_group = match.group('level')
        if level_group.isdigit():
            level = int(level_group)
        else:
            level = len(level_group)

        heading = match.group('heading').strip()

        if level <= max_level:
            append_document()

            heading_index = level - 1
            headings[heading_index:] = [None] * (max_level - heading_index)
            headings[heading_index] = heading
            heading_codes[heading] = match.group()

    lines = text.split('\n')
    for line in lines:
        match = regex.match(line)

        if match:
            handle_match()
            content = ''
        else:
            content += line + '\n'

    append_document()

    return sections
