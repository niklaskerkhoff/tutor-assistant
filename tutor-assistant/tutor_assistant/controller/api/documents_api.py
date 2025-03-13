from fastapi import Request, APIRouter

from tutor_assistant.controller.config.domain_config import config
from tutor_assistant.controller.config.loaders_config import loader_creators
from tutor_assistant.controller.utils.api_utils import check_request_body
from tutor_assistant.controller.utils.loaders_utils import get_loader
from tutor_assistant.domain.documents.document_service import DocumentService

router = APIRouter()


@router.post('/documents/add')
async def _add_document(request: Request):
    body: dict = await request.json()
    check_request_body(body, ['title', 'originalKey', 'loaderType', 'loaderParams', 'isCalendar'])
    title: str = body['title']
    original_key: str = body['originalKey']
    loader_type: str = body['loaderType']
    loader_params: dict = body['loaderParams']
    is_calendar: bool = body['isCalendar']

    config.logger.info(
        f'POST /documents/add: title={title}; original_key={original_key}')

    loader = get_loader(loader_creators, title, loader_type, loader_params)

    ids = DocumentService(config).add(loader, title, original_key, is_calendar)

    config.logger.info(f'Result: {ids}')

    return ids


@router.post('/documents/delete')
async def _delete_document(request: Request):
    body = await request.json()
    ids: list[str] = body

    config.logger.info(f'POST /documents/delete: ids:{ids}')

    result = DocumentService(config).delete(ids)

    config.logger.info(f'Result: {result}')

    return True if result is None else result
