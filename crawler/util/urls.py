from urllib.parse import urljoin


def join_urls(base_url, relative_url):
    return urljoin(base_url, relative_url)


def get_urls(element, base_url):
    hrefs = get_hrefs(element)
    return join_multiple_urls(hrefs, base_url)


def join_multiple_urls(urls, base_url):
    return [join_urls(base_url, relative_url) for relative_url in urls]


def get_header_text(soup):
    header = soup.find("h1", class_="page-title")
    header_text = get_clean_text(header.text)
    return header_text


def get_hrefs(element):
    urls = []
    anchors = element.find_all("a")
    for anchor in anchors:
        relative_url = anchor.get("href")
        urls.append(relative_url)
    return urls


def get_clean_text(string):
    return remove_non_breaking_spaces(string.strip())


def remove_non_breaking_spaces(string):
    return string.replace(u"\xa0", " ")
