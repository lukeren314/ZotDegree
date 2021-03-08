from urllib.parse import urljoin


def join_urls(base_url, relative_url):
    return urljoin(base_url, relative_url)
