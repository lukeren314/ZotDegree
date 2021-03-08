import logging
import os


class Logger:
    def __init__(self, name, debug_):
        self.name = name
        self.debug_ = debug_

    def debug(self, *args, **kwargs):
        if self.debug_:
            print(self.name, *args, **kwargs)


def get_logger(name, debug):
    logger = Logger(name, debug)
    return logger
    # logger = logging.getLogger(name)
    # logger.setLevel(logging.DEBUG if debug else logging.INFO)
    # if not os.path.exists("logs"):
    #     os.makedirs("logs")
    # fh = logging.FileHandler(f"logs/{name}.log")
    # fh.setLevel(logging.DEBUG)
    # ch = logging.StreamHandler()
    # ch.setLevel(logging.INFO)
    # formatter = logging.Formatter(
    #     "%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    # fh.setFormatter(formatter)
    # ch.setFormatter(formatter)
    # # add the handlers to the logger
    # logger.addHandler(fh)
    # logger.addHandler(ch)
    # return logger
