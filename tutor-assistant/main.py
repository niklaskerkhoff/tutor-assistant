import os

import uvicorn
from fastapi import FastAPI

from tutor_assistant.controller.api import chats_api, documents_api, calendar_api
from tutor_assistant.controller.config.domain_config import config

_app = FastAPI(
    title='Tutor Assistant',
    version='1.0.0',
    description=''
)


def _main():
    config.vector_store_manager.create_if_not_exists()

    _app.include_router(calendar_api.router, tags=["calendar"])
    _app.include_router(chats_api.router, tags=["chats"])
    _app.include_router(documents_api.router, tags=["documents"])

    uvicorn.run(_app, host=os.getenv('HOST'), port=8500)


if __name__ == '__main__':
    _main()
