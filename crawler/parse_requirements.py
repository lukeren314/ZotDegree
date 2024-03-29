
from util.soups import get_clean_text

id_counter = 0


def parse_universal_requirements():
    # hard coded for now
    requirements = {
        "header": "University Requirements",
        "requirements": [
            {
                "type": "comment",
                "comment": "Units: 180"
            },
            {
                "type": "section",
                "comment": "General Education Requirements",
                "subrequirements": [
                    {
                        "type": "comment",
                        "comment": "I. Writing (two lower-division plus one upper-division course)"
                    },
                    {
                        "type": "comment",
                        "comment": "II. Science and Technology (three courses)"
                    },
                    {
                        "type": "comment",
                        "comment": "III. Social and Behavioral Sciences (three courses)"
                    },
                    {
                        "type": "comment",
                        "comment": "IV. Arts and Humanities (three courses)"
                    },
                    {
                        "type": "comment",
                        "comment": "V. Quantitative, Symbolic, and Computational Reasoning, with subcategories Va and Vb (three courses that may also satisfy another GE category)"
                    },
                    {
                        "type": "comment",
                        "comment": "VI. Language Other Than English (one course)"
                    },
                    {
                        "type": "comment",
                        "comment": "VII. Multicultural Studies (one course that may also satisfy another GE category)"
                    },
                    {
                        "type": "comment",
                        "comment": "VIII. International/Global Issues (one course that may also satisfy another GE category)"
                    }
                ]
            }
        ]
    }
    requirements["requirements"] = assign_requirements_ids(requirements["requirements"])
    return requirements


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
            break
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
    header_text = get_clean_text(header_text)

    # silly edge cases that aren't worth accounting for
    if header_text == "<p>Departmental Requirements—Common Curriculum: All courses must be completed with a grade of C- or higher, with an exception listed below.*</p>":
        header_text = "Departmental Requirements"
    if len(header_text) > 150:
        header_text = "Requirements"
    return header_text


def parse_requirements_table(courselist_table):
    # utility functions
    def is_bullet_point(text):
        return len(text) > 2 and text[0].isalpha() and text[0].isupper() and text[1] == "." and text[2] == " "
        
    course_tr = courselist_table.find_all("tr")
    requirements = []
    next_or = False
    for course in course_tr:
        class_ = course.get("class")
        # handler headers
        if "areaheader" in class_:
            requirements.append({
                "type": "header",
                "comment": get_clean_text(
                    course.find(class_="courselistcomment").text),
            })
            continue
        # if the current row's a comment
        search_comment = course.find(class_="courselistcomment")
        if search_comment:
            # if it's an or comment
            if "or" == search_comment.text.strip():
                # if the previous row was a comment/header, we treat this or as a comment too
                if len(requirements) > 0 and requirements[-1]["type"] in ("header", "comment"):
                    requirements.append({
                        "type": "comment",
                        "comment": "or",
                    })
                    continue
                # otherwise, be prepared to combine the next series/single with the previous
                next_or = True
                continue
            # if it's not an or comment, add it as a comment
            comment_text = get_clean_text(search_comment.text)
            if is_bullet_point(comment_text):
                requirements.append({
                    "type": "header",
                    "comment": comment_text
                })
                continue
            requirements.append({
                "type": "comment",
                "comment": get_clean_text(search_comment.text),
            })
            
            continue

        total_text = course.get_text().strip()
        if not total_text:
            # blank rows
            continue
        # grab the course id
        columns = course.find_all()
        course_id = get_clean_text(columns[0].get_text())
        # if it starts with or (series), ignore the or
        if course_id.startswith("or "):
            course_id = course_id[len("or "):]
        # if -, it's a series
        if "-" in course_id:
            course_requirement = {
                "type": "series",
                "subrequirements": []
            }
            course_ids = [c_id.strip()
                          for c_id in course_id.split("-")]
            base_course_id = course_ids[0]
            # grab the course department (usually omitted from the subsequent rows)
            course_department = base_course_id[:-
                                               len(base_course_id.split(" ")[-1])].strip()
            # prefix with the department if it doesn't alreaday start with it
            for i, course_id in enumerate(course_ids):
                if i > 0 and not course_id.startswith(course_department):
                    course_ids[i] = course_department.upper()+" "+course_id
            course_requirement["subrequirements"] = [
                {"type": "single", "course": course_id} for course_id in course_ids]
        else:
            # handle the single course case
            course_requirement = {
                "type": "single",
                "course": course_id
            }
        # if we previously encountered an or
        if len(requirements) > 0 and ("orclass" in class_ or next_or):
            # see if we have multiple ors, if so, just merge into the previous one
            if requirements[-1]["type"] != "or":
                requirements[-1] = {
                    "type": "or",
                    "subrequirements": [requirements[-1]]
                }
            # add the course to the ors
            requirements[-1]["subrequirements"].append(course_requirement)
            next_or = False
            continue
        requirements.append(course_requirement)
    requirements = nest_requirements_under_headers(requirements)
    requirements = assign_requirements_ids(requirements)
    return requirements


def nest_requirements_under_headers(requirements):
    new_requirements = []
    header = None
    current_requirements = []

    def get_next_header():
        if len(current_requirements) == 0:
            return {
                "type": "header",
                "comment": header,
            }
        return {
            "type": "section",
            "comment": header,
            "subrequirements": current_requirements
        }
    for requirement in requirements:
        if requirement["type"] == "header":
            if header is None:
                header = requirement["comment"]
            else:
                new_requirements.append(get_next_header())
                header = requirement["comment"]
                current_requirements = []
        else:
            current_requirements.append(requirement)
    if header is not None:
        new_requirements.append(get_next_header())

    else:
        if current_requirements:
            new_requirements.extend(current_requirements)
    return new_requirements


def assign_requirements_ids(requirements):
    global id_counter
    for i in range(len(requirements)):
        requirements[i]["id"] = id_counter
        id_counter += 1
        if "subrequirements" in requirements[i]:
            requirements[i]["subrequirements"] = assign_requirements_ids(
                requirements[i]["subrequirements"])
    return requirements


def test_requirements_computer_science(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/donaldbrenschoolofinformationandcomputersciences/departmentofcomputerscience/computerscience_bs/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_spanish_minor(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofhumanities/departmentofspanishandportuguese/spanish_minor/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_japanese_studies_minor(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofhumanities/departmentofeastasianstudies/japanesestudies_minor/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_applied_physics(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofphysicalsciences/departmentofphysicsandastronomy/appliedphysics_bs/#requirementstext")
    requirements = parse_requirements(soup)


def test_requirements_biosci_school(soup_cache):
    soup = soup_cache.get_soup(
        "http://catalogue.uci.edu/schoolofbiologicalsciences/#schoolrequirementstext")
    requirements = parse_requirements(soup)


if __name__ == "__main__":
    from soupcache import SoupCache
    soup_cache = SoupCache()

    test_requirements_computer_science(soup_cache)
    # test_requirements_spanish_minor(soup_cache)
    # test_requirements_japanese_studies_minor(soup_cache)
    # test_requirements_applied_physics(soup_cache)
    # test_requirements_biosci_school(soup_cache)
