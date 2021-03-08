
from util import join_urls, get_logger, save_json
from soupcache import SoupCache
import re
# schools/departments
# http://catalogue.uci.edu/schoolsandprograms/

# degrees
# http://catalogue.uci.edu/undergraduatedegrees/

# courses
# http://catalogue.uci.edu/allcourses/

# university/degree requirements
# http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/


SCHOOLS_DEPARTMENTS_URL = "http://catalogue.uci.edu/schoolsandprograms/"
DEGREES_URL = "http://catalogue.uci.edu/undergraduatedegrees/"
COURSES_URL = "http://catalogue.uci.edu/allcourses/"
REQUIREMENTS_URL = "http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/"


logger = get_logger("SCRAPER", debug=True)


def scrape_catalogue(soup_cache):
    # course_departments, courses = scrape_courses(soup_cache)
    # save_json("./datasets/course_departments.json", course_departments)
    # save_json("./datasets/courses.json", courses)

    degrees = scrape_degrees(soup_cache)
    save_json("./datasets/degrees_list.json", degrees)

    universal_requirements = scrape_universal_requirements(soup_cache)
    save_json("./datasets/universal_requirements.json", universal_requirements)
    schools, departments = scrape_schools(soup_cache)
    save_json("./datasets/schools_list.json", schools)
    save_json("./datasets/departments_list.json", departments)

    # mapify
    degrees_map = {degree["name"]: degree for degree in degrees}
    schools_map = {school["name"]: school for school in schools}
    departments_map = {department["name"]                       : department for department in departments}

    # assign schools, departments into degrees
    for school in schools:
        for degree in school["degrees"]:
            if degree not in degrees_map:
                # graduate degree...don't deal with for now
                continue
            degrees_map[degree]["school"] = school["name"]
    for department in departments:
        for degree in department["degrees"]:
            if degree not in degrees_map:
                # graduate degree...don't deal with for now
                continue
            degrees_map[degree]["department"] = department["name"]

    save_json("./datasets/degrees.json", degrees_map)
    save_json("./datasets/schools.json", schools_map)
    save_json("./datasets/departments.json", departments_map)


def scrape_courses(soup_cache):
    course_departments = []
    courses = []
    soup = soup_cache.get_soup(COURSES_URL)
    base_div = soup.find(id="atozindex")
    department_lists = base_div.find_all("ul")
    for department_list in department_lists:
        anchors = department_list.find_all("a")
        for anchor in anchors:
            relative_url = anchor.get("href")
            url = join_urls(COURSES_URL, relative_url)
            course_department, department_courses = scrape_course_department(soup_cache,
                                                                             url)
            course_departments.append(course_department)
            courses.extend(department_courses)
    return course_departments, courses


def scrape_course_department(soup_cache, url):
    soup = soup_cache.get_soup(url)
    course_department = parse_course_department(soup)
    courses = parse_courses(soup)

    # add courses to departments
    course_department["classes"] = []
    for course in courses:
        course_department["classes"].append(course["id"])

    return course_department, courses


def parse_course_department(soup):
    header = get_header_text(soup)
    logger.debug("COURSE_DEPARTMENT", header)
    abbr = header[header.find("("):]
    name = header[:-len(abbr)].rstrip()
    abbr = abbr[1:-1]
    return {
        "name": name,
        "abbr": abbr
    }


def parse_courses(soup):
    courses = []
    base_div = soup.find(id="courseinventorycontainer")
    course_divs = base_div.find_all(class_="courseblock")
    for course_div in course_divs:
        course = parse_course_div(course_div)
        courses.append(course)
    return courses


def parse_course_div(course_div):
    title_div = course_div.find(class_="courseblocktitle")
    title = title_div.text.strip()

    course = parse_course_title(title)
    info = parse_course_info(course_div)
    return {**course, **info}


def parse_course_title(title):
    tokens = title.split(" ")
    if "Unit" in title:
        department_class_code, _, *name, _, units, _ = tokens
    else:
        department_class_code, _, *name, _ = tokens
        units = 0
    department_class_code = department_class_code.replace(u'\xa0', u' ')
    class_code = department_class_code.split()[-1]
    department = department_class_code[:-len(class_code)].strip()
    # remove the period at the end
    class_code = class_code[:-1]
    id = department + " " + class_code
    name = ' '.join(name)[:-1]
    return {
        "id": id,
        "department_abbr": department,
        "class_code": class_code,
        "name": name,
        "units": units  # leave as string?
    }


def parse_course_info(course_div):
    desc = course_div.find("div", class_="courseblockdesc")
    prerequisite = ""
    corequisite = ""
    same_as = ""
    ge_categories = []
    lines = desc.get_text().split("\n")
    for line in lines:
        line = line.strip().replace(u"\xa0", " ")
        # inconsistencies
        line = line.replace("(GE ", "(")
        line = line.replace("(General Education ", "(")
        if not line:
            continue
        if line.startswith("Prerequisite"):
            prerequisite = line[line.find(" ")+1:]
        elif line.startswith("Corequisite"):
            corequisite = line[line.find(" ")+1:]
        elif line.startswith("Same as"):
            same_as = line[len("Same as "):].replace(".", "")
        elif line.startswith("(I") or line.startswith("(V"):
            tokens = line.lower().replace("(", "").replace(")", "").replace(",", "").split()
            for token in tokens:
                if token in ("ia", "ib", "ii", "iii", "iv", "va", "vb", "vi", "vii", "viii"):
                    ge_categories.append(token)
    return {
        "prerequisite": prerequisite,
        "corequisite": corequisite,
        "same_as": same_as,
        "ge_cateogires": ge_categories
    }


def scrape_degrees(soup_cache):
    degrees = []
    soup = soup_cache.get_soup(DEGREES_URL)
    base_div = soup.find(id="textcontainer").find("div")
    anchors = base_div.find_all("a")
    for anchor in anchors:
        relative_url = anchor.get("href")
        if relative_url == "/divisionofundergraduateeducation/#studentprogramsandservicestext":
            # seems to not be a major?
            continue
        if relative_url:
            url = join_urls(DEGREES_URL, relative_url)
            degree = scrape_degree(soup_cache, url)
            degrees.append(degree)
    return degrees


def scrape_degree(soup_cache, degree_url):
    soup = soup_cache.get_soup(degree_url)
    degree = parse_degree(soup)
    return degree


def parse_degree(soup):
    header = get_header_text(soup)
    logger.debug(header)
    level = header.split(",")[-1]
    subject = header[:-len(level)-1]
    level = level.lstrip()
    degree_requirements = parse_requirements(soup)
    return {
        "name": header,
        "subject": subject,
        "level": level,
        "requirements": degree_requirements
    }


def parse_requirements(soup):
    course_list = soup.find(class_="sc_courselist")
    if not course_list:
        return []
    return parse_requirements_table(course_list)


def parse_requirements_table(courselist_table):
    course_tr = courselist_table.find_all("tr")
    requirements = []
    current_category = None
    category_requirements = []
    next_or = False
    for course in course_tr:
        try:
            class_ = course.get("class")
            if "areaheader" in class_:
                if current_category:
                    requirements.append({
                        "category": current_category,
                        "requirements": category_requirements
                    })
                current_category = course.find(class_="courselistcomment").text
                category_requirements = []
                continue

            search_comment = course.find(class_="courselistcomment")
            if search_comment:
                category_requirements.append({
                    "type": "comment",
                    "courses": [],
                    "comment": search_comment.text
                })
            else:
                total_text = course.get_text().strip()
                if not total_text:
                    # blank rows
                    continue
                if total_text.lower() == "or":
                    next_or = True
                    continue
                columns = course.find_all()
                course_id = columns[0].get_text().strip().replace(u"\xa0", " ")

                if "orclass" in class_ or next_or:
                    category_requirements[-1]["type"] = "or"
                    category_requirements[-1]["courses"].append(course_id)
                    next_or = False
                else:
                    category_requirements.append({
                        "type": "single",
                        "courses": [course_id],
                        "comment": ""
                    })

            if "lastrow" in class_:
                requirements.append({
                    "category": current_category,
                    "courses": category_requirements
                })
        except:
            logger.debug(course)
            raise
    return requirements


def scrape_universal_requirements(soup_cache):
    # manual scrape :/
    return {
        "ge_requirements": {
            "ia": 2,
            "ib": 1,
            "ii": 3,
            "iii": 3,
            "iv": 3,
            "v": 3,
            "va": 1,
            "vb": 1,
            "vi": 1,
            "vii": 1,
            "viii": 1
        },
        "credit_requirement": 180
    }


def scrape_schools(soup_cache):
    schools = []
    departments = []
    soup = soup_cache.get_soup(SCHOOLS_DEPARTMENTS_URL)
    base_div = soup.find(id="textcontainer")
    anchors = base_div.find_all("a")
    for anchor in anchors:
        relative_url = anchor.get("href")
        url = join_urls(SCHOOLS_DEPARTMENTS_URL, relative_url)
        school, school_departments = scrape_school(soup_cache, url)
        schools.append(school)
        departments.extend(school_departments)
    return schools, departments


def scrape_school(soup_cache, school_url):
    soup = soup_cache.get_soup(school_url)
    school = parse_school(soup)
    departments = get_departments(soup_cache, soup, school_url)
    return school, departments


def parse_school(soup):
    header = get_header_text(soup)
    logger.debug(header)
    requirements = parse_requirements(soup)
    degrees = parse_degrees(soup)
    return {
        "name": header,
        "requirements": requirements,
        "degrees": degrees
    }


def get_departments(soup_cache, soup, school_url):
    base_div = soup.find(id="departmentstextcontainer")
    if not base_div:
        return []
    departments = []
    anchors = base_div.find_all("a")
    for anchor in anchors:
        relative_url = anchor.get("href")
        if not relative_url:
            continue
        url = join_urls(school_url, relative_url)
        department = scrape_department(soup_cache, url)
        departments.append(department)
    return departments


def parse_degrees(soup):
    possible_ids = ("majorminorsandgraduateprogramtextcontainer",
                    "majorminorsandgraduateprogramstextcontainer",
                    "majorsminorsandgraduateprogramstextcontainer",
                    "majorsandgraduateprogramtextcontainer",
                    "majorsminorandgraduateprogramstextcontainer",
                    "majorsandgraduateprogramstextcontainer",
                    "majorandgraduateprogramstextcontainer",
                    "majorandgraduateprogramtextcontainer",
                    "majorminorandgraduateprogramstextcontainer",
                    "majorsminorsandgraduateprogramstextcontainer",
                    "majorminorandgraduateprogramtextcontainer",
                    "graduateprogramstextcontainer",
                    "textcontainer")
    for possible_id in possible_ids:
        base_div = soup.find(id=possible_id)
        if base_div:
            break
    else:
        print("poop")
        return []
    degrees = []
    titles = base_div.find_all(class_="title")
    for title in titles:
        degrees.append(title.text)
    return degrees


def scrape_department(soup_cache, department_url):
    soup = soup_cache.get_soup(department_url)
    department = parse_department(soup)
    return department


def parse_department(soup):
    header = get_header_text(soup)
    logger.debug(header)
    requirements = parse_requirements(soup)
    degrees = parse_degrees(soup)
    return {
        "name": header,
        "requirements": requirements,
        "degrees": degrees
    }


def get_header_text(soup):
    header = soup.find("h1", class_="page-title")
    header_text = header.text.strip()
    return header_text
