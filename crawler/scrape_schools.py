from typing import Dict
from bs4 import BeautifulSoup
from soupcache import SoupCache

from class_defs import School
from parse_requirements import parse_requirements
from util.soups import get_header_text, get_urls


SCHOOLS_DEPARTMENTS_URL = "http://catalogue.uci.edu/schoolsandprograms/"


def scrape_schools(soup_cache: SoupCache) -> Dict[str, School]:
    schools = {}
    soup = soup_cache.get_soup(SCHOOLS_DEPARTMENTS_URL)
    base_div = soup.find(id="textcontainer")
    urls = get_urls(base_div, SCHOOLS_DEPARTMENTS_URL)
    for url in urls:
        school = scrape_school(soup_cache, url)
        schools[school.name] = school
    return schools


def scrape_school(soup_cache: SoupCache, school_url: str) -> School:
    soup = soup_cache.get_soup(school_url)
    school = parse_school(soup)
    return school


def parse_school(soup: BeautifulSoup) -> School:
    header = get_header_text(soup)
    requirements = parse_requirements(soup)
    return School(header, requirements)
