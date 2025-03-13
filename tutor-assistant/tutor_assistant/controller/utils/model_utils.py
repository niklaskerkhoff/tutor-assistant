import os
from base64 import b64encode

from langchain_ollama import ChatOllama


def get_remote_ollama_chat_model(model_name: str) -> ChatOllama:
    """
    Access a remote ChatOllama model
    """

    host = os.environ.get("OLLAMA_HOST")
    username = os.environ.get("OLLAMA_USER")
    password = os.environ.get("OLLAMA_PASSWORD")

    if host is None or username is None or password is None:
        raise ValueError("OLLAMA_USER and OLLAMA_PASSWORD must be set in .env file")

    headers = {'Authorization': "Basic " + b64encode(f"{username}:{password}".encode('utf-8')).decode("ascii")}

    return ChatOllama(base_url=host, model=model_name, temperature=0, client_kwargs={'headers': headers})
