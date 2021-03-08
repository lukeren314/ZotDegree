import time
import argparse
from scraper import Scraper


def main(args):
    start = time.time()
    scraper = Scraper(args)
    scraper.scrape()
    scraper.close()
    print(f"Scrape took: {time.time()-start:0.4f}s")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset_cache", action="store_true")
    args = parser.parse_args()

    main(args)
