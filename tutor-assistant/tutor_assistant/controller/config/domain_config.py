import os

from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from tutor_assistant.controller.config._logging_config import get_logger
from tutor_assistant.controller.utils.resource_utils import load_resources
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.vector_stores.chroma_repo import ChromaRepo

_retriever_name = os.getenv('RETRIEVER_NAME')
_embed_meta_docs = True if os.getenv('EMBED_META_DOCS') == 'true' else False
_vector_store_suffix = os.getenv('VECTOR_STORE_SUFFIX')

_embeddings = OpenAIEmbeddings(model='text-embedding-3-large')

config = DomainConfig(
    ChatOpenAI(model='gpt-4o', temperature=0),
    _embeddings,
    ChromaRepo(f"{os.getenv('DATA_DIR')}/chroma_store_{_vector_store_suffix}", _embeddings),
    load_resources(f'{os.getcwd()}/resources'),
    get_logger(),
    "Deutsch",
    _retriever_name,
    _embed_meta_docs
)
