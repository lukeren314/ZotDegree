from util.logger import log_debug
from parse_requirements import parse_requirements
from util.soups import get_urls, get_header_text, get_clean_text


DEGREES_URL = "http://catalogue.uci.edu/undergraduatedegrees/"


def scrape_degrees(soup_cache):
    degrees = {}
    soup = soup_cache.get_soup(DEGREES_URL)
    base_div = soup.find(id="textcontainer").find("div")
    urls = get_urls(base_div, DEGREES_URL)
    for url in urls:
        if "/divisionofundergraduateeducation/#studentprogramsandservicestext" in url:
            # seems to not be a major?
            continue
        if url == DEGREES_URL:
            continue
        degree = scrape_degree(soup_cache, url)
        degrees[degree["name"]] = degree
    return degrees


def scrape_degree(soup_cache, degree_url):
    soup = soup_cache.get_soup(degree_url)
    degree = parse_degree(soup)
    degree["url"] = degree_url
    return degree


def parse_degree(soup):
    header = get_header_text(soup)
    level = header.split(",")[-1]
    subject = header[:-len(level)-1]
    level = level.lstrip()
    log_debug(header)
    school, department = parse_school_department(soup)
    degree_requirements = parse_requirements(soup)
    return {
        "name": header,
        "subject": subject,
        "level": level,
        "school": school,
        "department": department,
        "requirements": degree_requirements
    }


def parse_school_department(soup):
    breadcrumb = soup.find(id="breadcrumb")
    wrap = breadcrumb.find(class_="wrap")
    anchors = wrap.find_all("a")
    school = ""
    department = ""
    for anchor in anchors:
        href = anchor.get("href")
        if href == "/" or href == "#":
            continue
        text = get_clean_text(anchor.text)
        if not school:
            school = text
            continue
        department = text
    return school, department
