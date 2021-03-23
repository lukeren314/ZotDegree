
from util.urls import get_clean_text


def parse_requirements(soup):
    reqstextcontainer = soup.find(id="requirementstextcontainer")
    if not reqstextcontainer:
        return {}
    requirements = parse_requirements_text_container(reqstextcontainer)
    return requirements


def parse_requirements_text_container(requirements_text_container):
    all_requirements = {}
    toggleheads = requirements_text_container.find_all(class_="tglhead")
    course_lists = requirements_text_container.find_all(class_="sc_courselist")
    for i, course_list in enumerate(course_lists):
        potential_headers = get_potential_headers(course_list)
        header_text = pick_header_text(potential_headers, toggleheads, i)
        header_clean_text = get_clean_text(header_text)
        if header_clean_text in all_requirements:
            continue
        requirements = parse_requirements_table(course_list)
        all_requirements[header_clean_text] = requirements
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
        header_text = "Major Requirements"
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
                "comment": comment
            }
            requirements.append(requirement)
            continue

        search_comment = course.find(class_="courselistcomment")
        if search_comment:
            if "or" == search_comment.text.strip():
                next_or = True
                continue
            type_ = "comment"
            comment = get_clean_text(search_comment.text)
            requirement = {
                "type": type_,
                "comment": comment
            }
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
                type_ = "or"
                courses = [prev_class]
                requirements[-1] = {
                    "type": type_,
                    "courses": courses
                }
            requirements[-1]["courses"].append(course_requirement)
            continue
        requirements.append(course_requirement)

    return requirements
