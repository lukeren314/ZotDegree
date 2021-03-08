import os
from bs4 import BeautifulSoup
from util import load_json, save_json, polite_download


SOUP_CACHE_FILE_NAME = "./soups.sav"
SOUP_CACHE_VOCABULARY_NAME = "./vocab.json"


class SoupCache:
    def __init__(self, restart=False):
        self.vocabulary = {}
        self.cache_file_name = SOUP_CACHE_FILE_NAME
        self.vocabulary_file_name = SOUP_CACHE_VOCABULARY_NAME

        open_code = "w+" if restart or not os.path.exists(
            self.cache_file_name) else "r+"
        self.cache_file = open(self.cache_file_name,
                               open_code, encoding="utf-8")
        if not restart:
            self.load_vocabulary()

    def reset(self):
        self.cache_file.close()
        open(self.cache_file_name, "w").close()
        self.cache_file = open(self.cache_file_name,
                               "w+", encoding="utf-8")
        self.vocabulary = {}

    def close(self):
        self.cache_file.close()
        self.save_vocabulary()

    def get_soup(self, url):
        if url in self.vocabulary:
            text = self.get_from_cache(url)
        else:
            text = polite_download(url)
            self.save_to_cache(url, text)
            self.save_vocabulary()
        soup = BeautifulSoup(text, "lxml")
        return soup

    def get_from_cache(self, url):
        offset = self.cache_file.tell()
        targest_offset, length = self.vocabulary[url]
        self.cache_file.seek(targest_offset)
        text = self.cache_file.read(length)
        self.cache_file.seek(offset)
        return text

    def save_to_cache(self, url, text):
        offset = self.cache_file.tell()
        length = self.cache_file.write(text)
        self.vocabulary[url] = [offset, length]

    def load_vocabulary(self):
        self.vocabulary = load_json(self.vocabulary_file_name, {})

    def save_vocabulary(self):
        save_json(self.vocabulary_file_name, self.vocabulary)
