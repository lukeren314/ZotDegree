from typing import Tuple, Dict, Union, List
from soupcache import SoupCache
from bs4 import BeautifulSoup, element

from class_defs import Course, CourseDepartment
from util.logger import log_debug
from util.soups import get_clean_text, get_header_text, get_urls
import re

COURSES_URL = "http://catalogue.uci.edu/allcourses/"


def scrape_course_departments(soup_cache: SoupCache) -> Tuple[Dict[str, CourseDepartment], Dict[str, Course]]:
    course_departments = {}
    courses = {}
    soup = soup_cache.get_soup(COURSES_URL)
    base_div = soup.find(id="atozindex")
    department_lists = base_div.find_all("ul")
    for department_list in department_lists:
        urls = get_urls(department_list, COURSES_URL)
        for url in urls:
            course_department, department_courses = scrape_course_department(soup_cache,
                                                                             url)
            course_departments[course_department.name] = course_department
            courses.update(department_courses)

    return course_departments, courses


def scrape_course_department(soup_cache: SoupCache, url: str) -> Tuple[Dict[str, CourseDepartment], Dict[str, Course]]:
    soup = soup_cache.get_soup(url)
    course_department = parse_course_department(soup)
    courses = parse_courses(soup)

    # add courses to departments
    course_ids = []
    for course in courses.values():
        course_ids.append(course.id)
    course_department.set_course_ids(course_ids)

    return course_department, courses


def parse_course_department(soup: BeautifulSoup) -> CourseDepartment:
    header = get_header_text(soup)
    name = header[header.find("("):]
    title = header[:-len(name)].rstrip()
    name = name[1:-1]
    log_debug(header)
    return CourseDepartment(title, name)


def parse_courses(soup: BeautifulSoup) -> CourseDepartment:
    courses = {}
    base_div = soup.find(id="courseinventorycontainer")
    course_divs = base_div.find_all(class_="courseblock")
    for course_div in course_divs:
        course = parse_course_div(course_div)
        courses[course.id] = course
    return courses


def parse_course_div(course_div: element.Tag) -> Course:
    title_div = course_div.find(class_="courseblocktitle")
    title = get_clean_text(title_div.text)

    course_info = parse_course_title(title)
    course = Course(**course_info)
    course_data = parse_course_info(course_div)
    course.set_course_data(**course_data)
    return course


course_title_re = re.compile(
    r'([A-Z0-9&\/ ]+) ([0-9A-Z]+)\.  ?([A-Za-z0-9.() —–\-\/:,&?\'+’]+)\.  ?(\.?[0-9]\.?[0-9]? ?-? ?\.?[0-9]?[0-9]?) (Workload )?Units?\.')
course_title_no_units = re.compile(
    r'([A-Z0-9&\/ ]+) ([0-9A-Z]+)\.  ?([A-Za-z0-9.() —–\-\/:,&?\'+’]+)\.')


def parse_course_title(title: str) -> Dict[str, Union[int, str]]:
    title = get_clean_text(title)

    if "Unit" in title:
        reg = course_title_re.match(title)
        units_str = reg.group(4)
        units = [float(unit.strip()) for unit in units_str.split("-")]
        units = [int(unit) if unit.is_integer() else unit for unit in units]
        if len(units) == 1:
            units.append(units[0])
    else:
        reg = course_title_no_units.match(title)
        units = [0, 0]

    department, number, name = reg.group(1), reg.group(2), reg.group(3)
    name = name.strip()
    id_ = department + " " + number
    return {
        "id": id_,
        "department": department,
        "number": number,
        "name": name,
        "units": units
    }


def parse_course_info(course_div: element.Tag) -> Dict[str, str]:
    desc = course_div.find("div", class_="courseblockdesc")
    prerequisite = ""
    corequisite = ""
    prerequisite_list = []
    same_as = ""
    restriction = ""
    grading_option = ""
    ge_categories = []
    lines = desc.get_text().split("\n")
    desc = lines[1]
    for line in lines:
        line = get_clean_text(line)
        # inconsistencies
        line = line.replace("(GE ", "(")
        line = line.replace("(General Education ", "(")

        line = line.strip()
        if not line:
            continue
        if line.startswith("Prerequisite or corequisite: "):
            line = line[len("Prerequisite or corequisite: "):].strip()
            # TODO figure out this case
        elif line.startswith("Prerequisite: "):
            line = line[len("Prerequisite: "):].strip()
            prerequisite = line
            prerequisite_list = get_prerequisite_list(line)
        elif line.startswith("Corequisite: "):
            line = line[len("Corequisite: "):].strip()
            corequisite = line
        elif line.startswith("Same as "):
            same_as = line[len("Same as "):].replace(".", "").strip()
        elif line.startswith("Grading Option:"):
            grading_option = line[len("Grading Option:"):].strip()
        elif line.startswith("(I") or line.startswith("(V"):
            tokens = line.replace("(", "").replace(
                ")", "").replace(",", "").split()
            for token in tokens:
                if token in ("Ia", "Ib", "II", "III", "IV", "Va", "Vb", "VI", "VII", "VIII"):
                    ge_categories.append(token)
        elif line.startswith("Restriction: "):
            restriction = line[len("Restriction: "):].strip()
    return {
        "description": desc,
        "prerequisite_text": prerequisite,
        "corequisite": corequisite,
        "same_as": same_as,
        "prerequisite_list": prerequisite_list,
        "ge_list": ge_categories,
        "restriction": restriction,
        "grading_option": grading_option
    }


def get_prerequisite_list(line: str) -> List[str]:
    courses = line.split(".")[0].strip()
    tree = parse_tree(courses)
    return tree


bad_chars = set("abcdefghijklmnopqrstuvwxyz.")


def parse_tree(tree_str: str) -> List[str]:
    parts = []
    i = 0
    while True:
        if i >= len(tree_str):
            break
        if tree_str[i] == "(":
            count = 1
            end = 0
            for j in range(i+1, len(tree_str)):
                if tree_str[j] == "(":
                    count += 1
                elif tree_str[j] == ")":
                    count -= 1
                    if count == 0:
                        end = j
                        break
            parts.extend(parse_tree(tree_str[i+1:end]))
            i = end + 2
            continue
        if tree_str[i:i+len("and ")] == "and ":
            # parts.append("and")
            i += len("and ")
            continue
        if tree_str[i:i+len("or ")] == "or ":
            # parts.append("or")
            i += len("or ")
            continue
        # read a course
        next_index = get_next_index(tree_str, i)
        course_id = tree_str[i:next_index-1]
        if all((c not in bad_chars for c in course_id)):
            parts.append(tree_str[i:next_index-1])
        i = next_index
    return parts


def get_next_index(tree_str: List[str], i: int) -> int:
    nextor = tree_str.find("or ", i)
    nextand = tree_str.find("and ", i)
    found = [i for i in (nextor, nextand) if i >= 0]
    if not found:
        return len(tree_str)+1
    nextIndex = min(found)
    return nextIndex


def test_scrape_courses(soup_cache: SoupCache):
    scrape_course_departments(soup_cache)


def test_bana(soup_cache: SoupCache):
    scrape_course_department(
        soup_cache, "http://catalogue.uci.edu/allcourses/bana/")


if __name__ == "__main__":
    from soupcache import SoupCache
    soup_cache = SoupCache()

    test_scrape_courses(soup_cache)
    # test_bana(soup_cache)
