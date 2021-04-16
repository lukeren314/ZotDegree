from prepare_data import prepare_data
import time
import argparse
from soupcache import SoupCache
from scrape_catalogue import scrape_catalogue
from scrape_offerings import scrape_offerings
import os

DATA_PATH = "./datasets"


def main(args):
    if not os.path.exists(args.data_path):
        os.mkdir(args.data_path)
    soup_cache = SoupCache(args.reset_cache)
    start = time.time()
    scrape(soup_cache, args.data_path)
    print(f"Scrape took: {time.time()-start:0.4f}s")
    soup_cache.close()
    prepare_data(args.data_path)


def scrape(soup_cache, data_path):
    scrape_catalogue(soup_cache, data_path)
    # scrape_offerings(soup_cache, data_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset_cache", action="store_true")
    parser.add_argument("--data_path", default=DATA_PATH)
    args = parser.parse_args()

    main(args)
