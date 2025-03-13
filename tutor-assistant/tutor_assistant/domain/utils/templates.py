from datetime import datetime

from tutor_assistant.domain.domain_config import DomainConfig


def prepend_base_template(config: DomainConfig, template: str) -> str:
    now = datetime.now()
    formatted_date = now.strftime("%A, %d.%m.%Y")

    base_template: str = config.resources['prompt_templates']['base_template.txt']
    filled_base_template = base_template.replace('{date}', formatted_date).replace('{language}', config.language)

    return f"{filled_base_template}\n\n{template}"
