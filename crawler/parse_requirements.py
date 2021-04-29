
from util.urls import get_clean_text


def parse_requirements(soup):
    reqstextcontainer = soup.find(id="requirementstextcontainer")
    if not reqstextcontainer:
        reqstextcontainer = soup.find(id="schoolrequirementstextcontainer")
    if not reqstextcontainer:
        return []
    requirements = parse_requirements_text_container(reqstextcontainer)
    return requirements


def parse_requirements_text_container(requirements_text_container):
    all_requirements = []
    toggleheads = requirements_text_container.find_all(class_="tglhead")
    course_lists = requirements_text_container.find_all(class_="sc_courselist")
    for i, course_list in enumerate(course_lists):
        potential_headers = get_potential_headers(course_list)
        header_text = pick_header_text(potential_headers, toggleheads, i)
        header_clean_text = get_clean_text(header_text)
        if header_clean_text[-1] == "1":  # footnote number, get rid of it
            header_clean_text = header_clean_text[:-1]
        if header_clean_text in all_requirements:
            continue
        requirements = parse_requirements_table(course_list)
        all_requirements.append({
            "header": header_clean_text,
            "requirements": requirements
        })
    return all_requirements


def get_potential_headers(course_list):
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
    return potential_headers


def pick_header_text(potential_headers, toggleheads, i):
    header = None
    for potential_header in potential_headers:
        if potential_header.name in ("h4", "h5"):
            header = potential_header
            header_text = header.get_text()
    if not header:
        # find tglhead
        if i < len(toggleheads):
            header = toggleheads[i]
            header_text = header.get_text()
    if not header:
        # resort to p
        for potential_header in potential_headers:
            if potential_header.name == "p":
                header = potential_header
                header_text = str(header)
                break
    if not header:
        header_text = "Requirements"
    return header_text


def parse_requirements_table(courselist_table):
    course_tr = courselist_table.find_all("tr")
    requirements = []
    next_or = False
    for course in course_tr:
        class_ = course.get("class")
        if "areaheader" in class_:
            type_ = "header"
            comment = get_clean_text(
                course.find(class_="courselistcomment").text)
            requirement = {
                "type": type_,
                "comment": comment,
                "courses": []
            }
            requirements.append(requirement)
            continue

        search_comment = course.find(class_="courselistcomment")
        if search_comment:
            if "or" == search_comment.text.strip():
                if len(requirements) > 0 and requirements[-1]["type"] in ("header", "comment"):
                    type_ = "comment"
                    comment = "or"
                    requirement = {
                        "type": type_,
                        "comment": comment,
                        "courses": []
                    }
                next_or = True
                continue
            type_ = "comment"
            comment = get_clean_text(search_comment.text)
            requirement = {
                "type": type_,
                "comment": comment,
                "courses": []
            }
            requirements.append(requirement)
            continue
        total_text = course.get_text().strip()
        if not total_text:
            # blank rows
            continue

        columns = course.find_all()
        course_id = get_clean_text(columns[0].get_text())
        if course_id.startswith("or "):
            course_id = course_id[len("or "):]
        if "-" in course_id:
            course_requirement = {
                "type": "series",
                "comment": "",
                "courses": []
            }
            course_ids = [c_id.strip()
                          for c_id in course_id.split("-")]
            base_course_id = course_ids[0]
            course_department = base_course_id[:-
                                               len(base_course_id.split(" ")[-1])].strip()
            for i, course_id in enumerate(course_ids):
                if i > 0 and not course_id.startswith(course_department):
                    course_ids[i] = course_department.upper()+" "+course_id
            course_requirement["courses"] = course_ids
        else:
            course_requirement = {
                "type": "single",
                "comment": "",
                "courses": [course_id]
            }
        if len(requirements) > 0 and ("orclass" in class_ or next_or):
            if requirements[-1]["type"] != "or":
                prev_class = requirements[-1]
                type_ = "or"
                courses = [prev_class]
                requirements[-1] = {
                    "type": type_,
                    "comment": "",
                    "courses": courses
                }
            requirements[-1]["courses"].append(course_requirement)
            next_or = False
            continue
        requirements.append(course_requirement)
    requirements = nest_requirements_under_headers(requirements)
    return requirements


def nest_requirements_under_headers(requirements):
    new_requirements = []
    header = None
    current_requirements = []
    for requirement in requirements:
        if requirement["type"] == "header":
            if header is None:
                header = requirement["comment"]
            else:
                if len(current_requirements) == 0:
                    new_requirements.append({
                        "type": "header",
                        "comment": header,
                        "courses": []
                    })
                else:
                    type_ = "section"
                    comment = header
                    courses = current_requirements
                    new_requirements.append({
                        "type": type_,
                        "comment": comment,
                        "courses": courses
                    })
                    header = requirement["comment"]
                    current_requirements = []
        else:
            current_requirements.append(requirement)
    if header is not None:
        if len(current_requirements) == 0:
            new_requirements.append({
                "type": "header",
                "comment": header,
                "courses": []
            })
        else:
            type_ = "section"
            comment = header
            courses = current_requirements
            new_requirements.append({
                "type": type_,
                "comment": comment,
                "courses": courses
            })
    else:
        if current_requirements:
            new_requirements.extend(current_requirements)
    return new_requirements


def test_requirements_computer_science(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/donaldbrenschoolofinformationandcomputersciences/departmentofcomputerscience/computerscience_bs/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_spanish_minor(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofhumanities/departmentofspanishandportuguese/spanish_minor/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_biosci_school(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofbiologicalsciences/#schoolrequirementstext")
    requirements = parse_requirements(soup)


if __name__ == "__main__":
    from soupcache import SoupCache
    soup_cache = SoupCache()

    # test_requirements_computer_science(soup_cache)
    # test_requirements_spanish_minor(soup_cache)
    test_requirements_biosci_school(soup_cache)
