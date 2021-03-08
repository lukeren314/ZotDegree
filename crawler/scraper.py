from soupcache import SoupCache
from scrape_catalogue import scrape_catalogue
from scrape_offerings import scrape_offerings


class Scraper:
    def __init__(self, args):
        self.soup_cache = SoupCache(args.reset_cache)

    def scrape(self):
        scrape_catalogue(self.soup_cache)

    def close(self):
        self.soup_cache.close()
