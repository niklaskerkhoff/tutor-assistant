from typing import Any, Callable

from fastapi import HTTPException
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_core.document_loaders import BaseLoader

from tutor_assistant.controller.utils.api_utils import check_request_body
from tutor_assistant.domain.documents.loaders.assignment_pdf_loader import AssignmentPdfUrlLoader
from tutor_assistant.domain.documents.loaders.markdown_loaders import MarkdownUrlSplitByHeadingsLoader
from tutor_assistant.domain.documents.loaders.media_wiki_loaders import MediaWikiWebsiteSplitByHeadingsLoader, \
    MediaWikiUrlSplitByHeadingsLoader
from tutor_assistant.domain.documents.loaders.website_loaders import WebsiteSplitByHeadingsLoader


def get_loader(loader_creators: dict[str, Callable], title: str, loader_type: str,
               loader_params: dict[str, Any]) -> BaseLoader:
    """
    Returns specified loader
    See loaders_config.py
    """

    if loader_type not in loader_creators:
        raise HTTPException(status_code=400, detail=f'Unsupported loader type: {loader_type}')

    return loader_creators[loader_type](title, loader_params)


def create_pypdf_loader(_: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url'])
    return PyPDFLoader(loader_params['url'])


def create_web_base_loader(_: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url'])
    return WebBaseLoader(web_paths=[loader_params['url']])


def create_mediawiki_website_loader(title: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url', 'htmlSelector', 'htmlSelectionIndex'])
    return MediaWikiWebsiteSplitByHeadingsLoader(
        title,
        loader_params['url'],
        loader_params['htmlSelector'],
        loader_params['htmlSelectionIndex']
    )


def create_mediawiki_url_loader(title: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url'])
    return MediaWikiUrlSplitByHeadingsLoader(title, loader_params['url'])


def create_assignment_pdf_loader(title: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url'])
    return AssignmentPdfUrlLoader(title, loader_params['url'])


def create_markdown_url_loader(title: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url'])
    return MarkdownUrlSplitByHeadingsLoader(title, loader_params['url'])


def create_web_headings_loader(title: str, loader_params: dict[str, Any]) -> BaseLoader:
    check_request_body(loader_params, ['url', 'htmlSelector', 'htmlSelectionIndex'])
    return WebsiteSplitByHeadingsLoader(
        title,
        loader_params['url'],
        loader_params['htmlSelector'],
        loader_params['htmlSelectionIndex']
    )
