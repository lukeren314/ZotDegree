
from util import join_urls, get_logger, save_json


SCHOOLS_DEPARTMENTS_URL = "http://catalogue.uci.edu/schoolsandprograms/"
DEGREES_URL = "http://catalogue.uci.edu/undergraduatedegrees/"
COURSES_URL = "http://catalogue.uci.edu/allcourses/"
REQUIREMENTS_URL = "http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/"


logger = get_logger("SCRAPER", debug=True)


def scrape_catalogue(soup_cache):
    # scrape_and_save_courses(soup_cache)
    scrape_and_save_degrees(soup_cache)


def scrape_and_save_courses(soup_cache):
    course_departments, courses = scrape_courses(soup_cache)

    save_json("../datasets/course_departments.json", course_departments)
    save_json("../datasets/courses.json", courses)


def scrape_and_save_degrees(soup_cache):
    degrees = scrape_degrees(soup_cache)

    schools, departments = scrape_schools(soup_cache)
    # assign_schools_departments(degrees, schools, departments)

    save_json("../datasets/degrees.json", degrees)
    save_json("../datasets/schools.json", schools)
    save_json("../datasets/departments.json", departments)


# def assign_schools_departments(degrees, schools, departments):
#     # assign schools, departments into degrees
#     assign_to_degree(degrees, schools, "school")
#     assign_to_degree(degrees, departments, "department")


# def assign_to_degree(degrees, map, name):
#     for val in map:
#         for degree in map["degrees"]:
#             if degree not in degrees:
#                 # graduate degree...don't deal with for now
#                 continue
#             degrees[degree][name] = val["name"]


def scrape_courses(soup_cache):
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
    course_department["classes"] = []
    for course in courses.values():
        course_department["classes"].append(course["id"])

    return course_department, courses


def parse_course_department(soup):
    header = get_header_text(soup)
    logger.debug("COURSE_DEPARTMENT", header)
    name = header[header.find("("):]
    title = header[:-len(name)].rstrip()
    name = name[1:-1]
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


def parse_course_title(title):
    tokens = title.split(" ")
    if "Unit" in title:
        department_number, _, *name, _, units, _ = tokens
    else:
        department_number, _, *name, _ = tokens
        units = 0
    department_number = department_number.replace(u'\xa0', u' ')
    number = department_number.split()[-1]
    department = department_number[:-len(number)].strip()
    # remove the period at the end
    number = number[:-1]
    id = department + " " + number
    name = ' '.join(name)[:-1]
    return {
        "id": id,
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
        "ge_cateogires": ge_categories
    }


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
    logger.debug(header)
    level = header.split(",")[-1]
    subject = header[:-len(level)-1]
    level = level.lstrip()
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


def parse_requirements(soup):
    reqstextcontainer = soup.find(id="requirementstextcontainer")
    if not reqstextcontainer:
        return {}
    all_requirements = {}
    tglheads = reqstextcontainer.find_all(class_="tglhead")
    course_lists = reqstextcontainer.find_all(class_="sc_courselist")
    for i, course_list in enumerate(course_lists):
        potential_headers = []
        potential_header = course_list.previous_sibling
        if not potential_header.previous_sibling:
            potential_header = potential_header.parent
        while potential_header != None:
            potential_header_text = str(potential_header)
            if potential_header_text.strip() == "":
                potential_header = potential_header.previous_sibling
                continue
            if not potential_header.name:
                potential_header = potential_header.previous_sibling
                continue
            if potential_header.name not in ("h5", "h4", "p"):
                potential_header = potential_header.previous_sibling
                continue
            if "Sample Program" in potential_header_text:
                potential_header = potential_header.previous_sibling
                continue
            if "Requirements" not in potential_header_text \
                    and "Concentration" not in potential_header_text \
                    and "Specialization" not in potential_header_text \
                    and "Tracks" not in potential_header_text:
                potential_header = potential_header.previous_sibling
                continue
            potential_headers.append(potential_header)
            potential_header = potential_header.previous_sibling
        # try and grab the first h4, h5
        header = None
        for potential_header in potential_headers:
            if potential_header.name in ("h4", "h5"):
                header = potential_header
                header_text = str(header)
                print("h4,h5", header_text)
        if not header:
            # find tglhead
            if i < len(tglheads):
                header = tglheads[i]
                header_text = header.get_text()
                print("na", header_text)
        if not header:
            # resort to p
            for potential_header in potential_headers:
                if potential_header.name == "p":
                    header = potential_header
                    header_text = str(header)
                    print("p", header_text)
        if not header:
            header_text = "Major Requirements"
            print("default", potential_headers)

        header_clean_text = get_clean_text(header_text)
        if header_clean_text in all_requirements:
            continue
        requirements = parse_requirements_table(course_list)
        all_requirements[header_clean_text] = requirements
    return all_requirements


def parse_requirements_table(courselist_table):
    course_tr = courselist_table.find_all("tr")
    requirements = []
    next_or = False
    for course in course_tr:
        try:
            class_ = course.get("class")
            if "areaheader" in class_:
                requirement = {}
                requirement["type"] = "header"
                requirement["comment"] = get_clean_text(
                    course.find(class_="courselistcomment").text)
                requirements.append(requirement)
                continue

            search_comment = course.find(class_="courselistcomment")
            if search_comment:
                if "or" == search_comment.text.strip():
                    next_or = True
                    continue

                requirement = {}
                requirement["type"] = "comment"
                requirement["comment"] = get_clean_text(search_comment.text)
                requirements.append(requirement)
                continue
            total_text = course.get_text().strip()
            if not total_text:
                # blank rows
                continue

            columns = course.find_all()
            course_id = get_clean_text(columns[0].get_text())
            if "- " in course_id:
                course_requirement = {
                    "type": "series",
                    "courses": []
                }
                course_ids = course_id.split("-")
                course_requirement["courses"] = [
                    course_id.strip() for course_id in course_ids]
            else:
                course_requirement = {
                    "type": "single",
                    "courses": [course_id]
                }
            if len(requirements) > 0 and ("orclass" in class_ or next_or):
                if requirements[-1]["type"] != "or":
                    prev_class = requirements[-1]
                    requirements[-1] = {}
                    requirements[-1]["type"] = "or"
                    requirements[-1]["courses"] = [prev_class]
                requirements[-1]["courses"].append(course_requirement)
                continue
            requirements.append(course_requirement)
        except:
            logger.debug(course)
            raise
    requirements = collapse_requirements(requirements)
    return requirements


def collapse_requirements(requirements):
    if requirements[0]["type"] in ("single", "or", "series"):
        # print("poo")
        pass
    return requirements


def scrape_schools(soup_cache):
    schools = {}
    departments = {}
    soup = soup_cache.get_soup(SCHOOLS_DEPARTMENTS_URL)
    base_div = soup.find(id="textcontainer")
    urls = get_urls(base_div, SCHOOLS_DEPARTMENTS_URL)
    for url in urls:
        school, school_departments = scrape_school(soup_cache, url)
        schools[school["name"]] = school
        departments.update(school_departments)
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
    return {
        "name": header,
        "requirements": requirements
    }


def get_departments(soup_cache, soup, school_url):
    base_div = soup.find(id="departmentstextcontainer")
    if not base_div:
        return {}
    departments = {}
    urls = get_urls(base_div, school_url)
    for url in urls:
        if url == school_url:
            continue
        department = scrape_department(soup_cache, url)
        departments[department["name"]] = department
    return departments


# def parse_degrees(soup):
#     possible_ids = ("majorminorsandgraduateprogramtextcontainer",
#                     "majorminorsandgraduateprogramstextcontainer",
#                     "majorsminorsandgraduateprogramstextcontainer",
#                     "majorsandgraduateprogramtextcontainer",
#                     "majorsminorandgraduateprogramstextcontainer",
#                     "majorsandgraduateprogramstextcontainer",
#                     "majorandgraduateprogramstextcontainer",
#                     "majorandgraduateprogramtextcontainer",
#                     "majorminorandgraduateprogramstextcontainer",
#                     "majorsminorsandgraduateprogramstextcontainer",
#                     "majorminorandgraduateprogramtextcontainer",
#                     "graduateprogramstextcontainer",
#                     "minorsandgraduateemphasestextcontainer",
#                     "textcontainer")
#     for possible_id in possible_ids:
#         base_div = soup.find(id=possible_id)
#         if base_div:
#             break
#     else:
#         return []
#     degrees = []
#     titles = base_div.find_all(class_="title")
#     for title in titles:
#         degrees.append(title.text)
#     return degrees


def scrape_department(soup_cache, department_url):
    soup = soup_cache.get_soup(department_url)
    department = parse_department(soup)
    return department


def parse_department(soup):
    header = get_header_text(soup)
    logger.debug(header)
    return {
        "name": header
    }


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


def get_urls(element, base_url):
    hrefs = get_hrefs(element)
    return join_multiple_urls(hrefs, base_url)


def join_multiple_urls(urls, base_url):
    return [join_urls(base_url, relative_url) for relative_url in urls]


def get_clean_text(string):
    return remove_non_breaking_spaces(string.strip())


def remove_non_breaking_spaces(string):
    return string.replace(u"\xa0", " ")
