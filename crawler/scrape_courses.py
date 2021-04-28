
from util.logger import log_debug
from util.urls import get_clean_text, get_header_text, get_urls
import re

COURSES_URL = "http://catalogue.uci.edu/allcourses/"


def scrape_course_departments(soup_cache):
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
            course_departments[course_department["name"]] = course_department
            courses.update(department_courses)

    return course_departments, courses


def scrape_course_department(soup_cache, url):
    soup = soup_cache.get_soup(url)
    course_department = parse_course_department(soup)
    courses = parse_courses(soup)

    # add courses to departments
    course_department["courses"] = []
    for course in courses.values():
        course_department["courses"].append(course["id"])

    return course_department, courses


def parse_course_department(soup):
    header = get_header_text(soup)
    name = header[header.find("("):]
    title = header[:-len(name)].rstrip()
    name = name[1:-1]
    log_debug(header)
    return {
        "title": title,
        "name": name
    }


def parse_courses(soup):
    courses = {}
    base_div = soup.find(id="courseinventorycontainer")
    course_divs = base_div.find_all(class_="courseblock")
    for course_div in course_divs:
        course = parse_course_div(course_div)
        courses[course["id"]] = course
    return courses


def parse_course_div(course_div):
    title_div = course_div.find(class_="courseblocktitle")
    title = get_clean_text(title_div.text)

    course = parse_course_title(title)
    info = parse_course_info(course_div)
    return {**course, **info}


course_title_re = re.compile(
    r'([A-Z0-9&\/ ]+) ([0-9A-Z]+)\.  ([A-Za-z0-9.() —–\-\/:,&?\'+’]+)\.  (\.?[0-9]\.?[0-9]? ?-? ?\.?[0-9]?[0-9]?) (Workload )?Units?\.')
course_title_no_units = re.compile(
    r'([A-Z0-9&\/ ]+) ([0-9A-Z]+)\.  ([A-Za-z0-9.() —–\-\/:,&?\'+’]+)\.')


def parse_course_title(title):
    title = get_clean_text(title)

    if "Unit" in title:
        reg = course_title_re.match(title)
        print(title)
        units = reg.group(4)
    else:
        reg = course_title_no_units.match(title)
        units = 0

    department, number, name = reg.group(1), reg.group(2), reg.group(3)
    name = name.strip()
    id_ = department + " " + number
    return {
        "id": id_,
        "department": department,
        "number": number,
        "name": name,
        "units": units  # leave as string?
    }


def parse_course_info(course_div):
    desc = course_div.find("div", class_="courseblockdesc")
    prerequisite = ""
    corequisite = ""
    prerequisite_tree = ""
    same_as = ""
    ge_categories = []
    lines = desc.get_text().split("\n")
    for line in lines:
        line = get_clean_text(line)
        # inconsistencies
        line = line.replace("(GE ", "(")
        line = line.replace("(General Education ", "(")

        if not line:
            continue
        # learn prerequisite tree from uci prerequisites
        if line.startswith("Prerequisite"):
            # TODO: prerequisites
            prerequisite = line[line.find(" ")+1:]
            prerequisite_tree = ""
        elif line.startswith("Corequisite"):
            corequisite = line[line.find(" ")+1:]
        elif line.startswith("Same as"):
            same_as = line[len("Same as "):].replace(".", "")
        elif line.startswith("(I") or line.startswith("(V"):
            tokens = line.replace("(", "").replace(
                ")", "").replace(",", "").split()
            for token in tokens:
                if token in ("Ia", "Ib", "II", "III", "IV", "Va", "Vb", "VI", "VII", "VIII"):
                    ge_categories.append(token)
    return {
        "prerequisite": prerequisite,
        "corequisite": corequisite,
        "prerequisite_tree": prerequisite_tree,
        "same_as": same_as,
        "ge_categories": ge_categories
    }
