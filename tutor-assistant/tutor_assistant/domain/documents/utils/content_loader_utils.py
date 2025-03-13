import requests
from bs4 import BeautifulSoup


def load_content_from_url(url: str) -> str:
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def load_website_text(url: str, html_selector: str, html_selection_index: int) -> str:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    return soup.select(html_selector)[html_selection_index].text


def load_website_html(url: str, html_selector: str, html_selection_index: int) -> str:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    return soup.select(html_selector)[html_selection_index].prettify()
