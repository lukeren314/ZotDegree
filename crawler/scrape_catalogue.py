from class_defs import JSONSerializable, CourseDepartment, Course
from soupcache import SoupCache

from typing import Dict, List, Union
from util.utils import save_json
from scrape_schools import scrape_schools
from scrape_degrees import scrape_degrees
from scrape_courses import scrape_course_departments
from parse_requirements import parse_universal_requirements
import os

COURSES_URL = "http://catalogue.uci.edu/allcourses/"
REQUIREMENTS_URL = "http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/"

COURSE_DEPARTMENTS_DATA_PATH = "course_departments.json"
COURSES_DATA_PATH = "courses.json"
COURSE_DEPARTMENTS_LIST_PATH = "course_departments_list.json"
COURSE_LIST_PATH = "course_list.json"
DEPARTMENT_INDEX_PATH = "department_index.json"
GE_INDEX_PATH = "ge_index.json"
UNIVERSAL_REQUIREMENTS_DATA_PATH = "universal_requirements.json"
DEGREES_DATA_PATH = "degrees.json"
DEGREES_LIST_PATH = "degrees_list.json"
SCHOOLS_DATA_PATH = "schools.json"

GES = ("Ia", "Ib", "II", "III", "IV", "Va", "Vb", "VI", "VII", "VIII")


def scrape_catalogue(soup_cache: SoupCache, data_path: str):
    scrape_and_save_course_departments(soup_cache, data_path)
    scrape_and_save_universal_requirements(data_path)
    scrape_and_save_degrees(soup_cache, data_path)
    scrape_and_save_schools(soup_cache, data_path)


def scrape_and_save_course_departments(soup_cache: SoupCache, data_path: str):
    course_departments, courses = scrape_course_departments(soup_cache)
    save_data(data_path, COURSE_DEPARTMENTS_DATA_PATH, course_departments)
    save_data(data_path, COURSES_DATA_PATH, courses)

    course_departments_list = create_course_departments_list(
        course_departments)

    save_data(data_path, COURSE_DEPARTMENTS_LIST_PATH,
              course_departments_list)

    course_list = create_course_list(courses)

    save_data(data_path, COURSE_LIST_PATH, course_list)

    create_and_save_indexes(data_path, course_departments, courses)


def create_course_departments_list(course_departments: Dict[str, CourseDepartment]):
    course_departments_list = []
    course_departments_list.append({
        "value": "ALL",
        "label": "ALL Departments"
    })
    for course_department_label, course_department_data in sorted(course_departments.items(), key=lambda x: x[0]):
        value = course_department_label
        label = f"{course_department_label} {course_department_data.title}"
        course_departments_list.append({
            "value": value,
            "label": label
        })
    return course_departments_list


def create_course_list(courses: Dict[str, Course]):
    course_list = []
    for course_name, course_data in sorted(courses.items(), key=lambda x: x[0]):
        value = course_name
        label = f"{course_name} {course_data.name}"
        course_list.append({
            "value": value,
            "label": label
        })
    return course_list


def create_and_save_indexes(data_path: str, course_departments: Dict[str, CourseDepartment], courses: Dict[str, Course]):
    department_index = create_department_index(course_departments)
    save_data(data_path, DEPARTMENT_INDEX_PATH, department_index)

    ge_index = create_ge_index(courses)
    save_data(data_path, GE_INDEX_PATH, ge_index)


def create_department_index(course_departments: Dict[str, CourseDepartment]):
    department_index = {course_department_name: [course for course in course_department.course_ids]
                        for course_department_name, course_department in course_departments.items()}
    return department_index


def create_ge_index(courses: Dict[str, Course]):
    ge_index = {ge: [] for ge in GES}
    for course in courses.values():
        for course_ge in course.ge_list:
            if course_ge in ge_index:
                ge_index[course_ge].append(course.id)
    return ge_index


def scrape_and_save_universal_requirements(data_path: str):
    universal_requirements = parse_universal_requirements()
    save_data(data_path, UNIVERSAL_REQUIREMENTS_DATA_PATH,
              universal_requirements)


def scrape_and_save_degrees(soup_cache: SoupCache, data_path: str):
    degrees = scrape_degrees(soup_cache)
    save_data(data_path, DEGREES_DATA_PATH, degrees)

    degrees_list = create_degrees_list(degrees)

    save_data(data_path, DEGREES_LIST_PATH, degrees_list)


def create_degrees_list(degrees: List[str]):
    degrees_list = []
    for degree in sorted(degrees):
        value = degree
        label = degree
        degrees_list.append({
            "value": value,
            "label": label
        })
    return degrees_list


def scrape_and_save_schools(soup_cache: SoupCache, data_path: str):
    schools = scrape_schools(soup_cache)
    save_data(data_path, SCHOOLS_DATA_PATH, schools)


def save_data(data_path: str, filename: str, data: JSONSerializable):
    save_json(os.path.join(data_path, filename), nested_to_json(data))


def nested_to_json(data: JSONSerializable) -> Union[List, Dict]:
    if type(data) == list:
        new_list = []
        for item in data:
            if isinstance(item, JSONSerializable):
                new_list.append(item.to_json())
            else:
                new_list.append(item)
        return new_list
    elif type(data) == dict:
        new_dict = {}
        for key, value in data.items():
            if isinstance(value, JSONSerializable):
                new_dict[key] = value.to_json()
            else:
                new_dict[key] = value
        return new_dict
    else:
        return data.to_json()
