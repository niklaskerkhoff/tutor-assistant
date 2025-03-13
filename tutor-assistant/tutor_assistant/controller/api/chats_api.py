from fastapi import Request, APIRouter
from starlette.responses import StreamingResponse

from tutor_assistant.controller.config.domain_config import config
from tutor_assistant.controller.utils.api_utils import check_request_body
from tutor_assistant.controller.utils.data_transfer_utils import json_output
from tutor_assistant.controller.utils.langchain_utils import stream_response
from tutor_assistant.domain.chats.message_chain_service import MessageChainService
from tutor_assistant.domain.chats.summary_chain_service import SummaryChainService
from tutor_assistant.utils.string_utils import shorten_middle

router = APIRouter()


@router.post('/chats/message')
async def _message(request: Request):
    body = await request.json()
    check_request_body(body, ['message'])
    user_message_content = body['message']
    history = body.get('history', [])

    config.logger.info(f'POST /chats/message: len(message):{len(user_message_content)};len(history):{len(history)}')

    response = MessageChainService(config).load_response(user_message_content, history)

    config.logger.info('Starting event-stream')

    return StreamingResponse(
        stream_response(response), media_type="text/event-stream"
    )


@router.post("/chats/summarize")
async def _summary(request: Request):
    body = await request.json()
    history = body.get('history', [])

    config.logger.info(f'POST /chats/summarize: len(history):{len(history)}')

    chain = SummaryChainService(config).create(history)
    result = chain.invoke({})

    config.logger.info(f'Result: {shorten_middle(result, 30)}')

    return json_output(result)
