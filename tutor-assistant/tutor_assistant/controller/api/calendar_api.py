from fastapi import APIRouter

from tutor_assistant.controller.config.domain_config import config
from tutor_assistant.controller.utils.data_transfer_utils import json_output
from tutor_assistant.domain.calendar.calendar_chain_service import CalendarChainService
from tutor_assistant.utils.string_utils import shorten_middle

router = APIRouter()


@router.post('/calendar')
async def _calendar():
    config.logger.info('POST /calendar')

    chain = CalendarChainService(config).create()

    result = chain.invoke({})
    answer = result['answer']

    config.logger.info(f'Result: {shorten_middle(answer, 30)}')

    return json_output(answer)
