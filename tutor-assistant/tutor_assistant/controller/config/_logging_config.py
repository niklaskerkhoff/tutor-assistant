import logging
import os
from logging.handlers import RotatingFileHandler


def get_logger() -> logging.Logger:
    logger = logging.getLogger('tutor-assistant')
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s')

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)

    file_handler = RotatingFileHandler(
        f"{os.getenv('DATA_DIR')}/app.log", maxBytes=5 * 1024 * 1024, backupCount=10
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
