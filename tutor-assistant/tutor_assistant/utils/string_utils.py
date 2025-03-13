def shorten_middle(text: str, char_count: int, replace_new_lines=True, middle=' ... ') -> str:
    if replace_new_lines:
        text = text.replace('\n', '')

    if len(text) <= 2 * char_count:
        return text
    else:
        return text[:char_count] + middle + text[-char_count:]
