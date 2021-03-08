
import time
import requests

from urllib.parse import urlparse

subdomain_times = {}


def polite_download(url, threshhold=0.5):
    subdomain = get_subdomain(url)
    current_time = time.time()

    if subdomain in subdomain_times:
        time_diff = current_time - subdomain_times[subdomain]
        if time_diff < threshhold:
            time.sleep(threshhold - time_diff)
    subdomain_times[subdomain] = current_time
    return download(url)


def download(url):
    resp = requests.get(url)
    if not resp:
        print(f"Error downloading {url}: missing")
        return ""

    if resp.status_code != 200:
        print(f"Error downloading {url}: status{resp.status_code}")
        return ""
    return resp.text


def get_subdomain(url):
    return urlparse(url).netloc
