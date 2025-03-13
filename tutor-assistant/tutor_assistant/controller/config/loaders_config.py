from tutor_assistant.controller.utils.loaders_utils import create_pypdf_loader, create_mediawiki_website_loader, \
    create_assignment_pdf_loader, create_markdown_url_loader, create_web_base_loader, create_mediawiki_url_loader, \
    create_web_headings_loader

loader_creators = {
    'assignment-pdf-url': create_assignment_pdf_loader,
    'markdown-url': create_markdown_url_loader,
    'mediawiki-url': create_mediawiki_url_loader,
    'mediawiki-web': create_mediawiki_website_loader,
    'pypdf-url': create_pypdf_loader,
    'web-base-web': create_web_base_loader,
    'web-headings-web': create_web_headings_loader,
}
