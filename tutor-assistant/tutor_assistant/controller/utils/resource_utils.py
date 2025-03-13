import os


def load_resources(path: str, file_types: list[str] = None):
    """
    Loads resources from files in directory and subdirectories as tree in dict.
    """

    if file_types is None:
        file_types = ['txt', 'yml', 'yaml', 'json', 'xml']
    result = {}
    for entry_name in os.listdir(path):
        entry_path = os.path.join(path, entry_name)

        if os.path.isdir(entry_path):
            result[entry_name] = load_resources(entry_path)
        else:
            file_type = entry_path.split('.')[-1]
            if file_type not in file_types:
                continue
            with open(entry_path, 'r') as file:
                content = file.read()
            result[entry_name] = content

    return result
