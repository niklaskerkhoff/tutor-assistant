def event_output(token: str):
    """
    :param token: to output in the event stream
    :return: token as data event
    """
    return f'event: data\ndata: "{token}"\n\n'


def event_end():
    """
    :return: event stream end token
    """
    return f'event: end\n\n'
