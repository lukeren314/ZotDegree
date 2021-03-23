from parse_requirements import parse_requirements
from util.urls import get_header_text, get_urls


SCHOOLS_DEPARTMENTS_URL = "http://catalogue.uci.edu/schoolsandprograms/"


def scrape_schools(soup_cache):
    schools = {}
    soup = soup_cache.get_soup(SCHOOLS_DEPARTMENTS_URL)
    base_div = soup.find(id="textcontainer")
    urls = get_urls(base_div, SCHOOLS_DEPARTMENTS_URL)
    for url in urls:
        school = scrape_school(soup_cache, url)
        schools[school["name"]] = school
    return schools


def scrape_school(soup_cache, school_url):
    soup = soup_cache.get_soup(school_url)
    school = parse_school(soup)
    return school


def parse_school(soup):
    header = get_header_text(soup)
    requirements = parse_requirements(soup)
    return {
        "name": header,
        "requirements": requirements
    }
