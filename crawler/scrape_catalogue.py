
from util.utils import save_json
from scrape_schools import scrape_schools
from scrape_degrees import scrape_degrees
from scrape_courses import scrape_course_departments
from parse_requirements import parse_universal_requirements
import os

COURSES_URL = "http://catalogue.uci.edu/allcourses/"
REQUIREMENTS_URL = "http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/"


def scrape_catalogue(soup_cache, data_path):
    scrape_and_save_course_departments(soup_cache, data_path)
    scrape_and_save_universal_requirements(soup_cache, data_path)
    scrape_and_save_degrees(soup_cache, data_path)
    scrape_and_save_schools(soup_cache, data_path)


def scrape_and_save_course_departments(soup_cache, data_path):
    course_departments, courses = scrape_course_departments(soup_cache)
    save_data(data_path, "course_departments.json", course_departments)
    save_data(data_path, "courses.json", courses)

    course_departments_list = create_course_departments_list(
        course_departments)

    save_data(data_path, "course_departments_list.json",
              course_departments_list)

    course_list = create_course_list(courses)

    save_data(data_path, "course_list.json", course_list)

    create_and_save_indexes(data_path, course_departments, courses)


def create_course_departments_list(course_departments):
    course_departments_list = []
    course_departments_list.append({
        "value": "ALL",
        "label": "ALL Departments"
    })
    for course_department_label, course_department_data in sorted(course_departments.items(), key=lambda x: x[0]):
        value = course_department_label
        label = f"{course_department_label} {course_department_data['title']}"
        course_departments_list.append({
            "value": value,
            "label": label
        })
    return course_departments_list


def create_course_list(courses):
    course_list = []
    for course_name, course_data in sorted(courses.items(), key=lambda x: x[0]):
        value = course_name
        label = f"{course_name} {course_data['name']}"
        course_list.append({
            "value": value,
            "label": label
        })
    return course_list


def create_and_save_indexes(data_path, course_departments, courses):
    department_index = create_department_index(course_departments, courses)
    save_data(data_path, "department_index.json", department_index)

    ge_index = create_ge_index(courses)
    save_data(data_path, "ge_index.json", ge_index)


def create_department_index(course_departments, courses):
    department_index = {course_department_name: [course for course in course_department["courses"]]
                        for course_department_name, course_department in course_departments.items()}
    return department_index


def create_ge_index(courses):
    ges = ("Ia", "Ib", "II", "III", "IV", "Va", "Vb", "VI", "VII", "VIII")
    ge_index = {ge: [] for ge in ges}
    for course in courses.values():
        for course_ge in course["ge_categories"]:
            if course_ge in ge_index:
                ge_index[course_ge].append(course["id"])
    return ge_index


def scrape_and_save_universal_requirements(soup_cache, data_path):
    universal_requirements = parse_universal_requirements()
    save_data(data_path, "universal_requirements.json", universal_requirements)

def scrape_and_save_degrees(soup_cache, data_path):
    degrees = scrape_degrees(soup_cache)
    save_data(data_path, "degrees.json", degrees)

    degrees_list = create_degrees_list(degrees)

    save_data(data_path, "degrees_list.json", degrees_list)


def create_degrees_list(degrees):
    degrees_list = []
    for degree in sorted(degrees):
        value = degree
        label = degree
        degrees_list.append({
            "value": value,
            "label": label
        })
    return degrees_list


def scrape_and_save_schools(soup_cache, data_path):
    schools = scrape_schools(soup_cache)
    save_data(data_path, "schools.json", schools)


def save_data(data_path, filename, data):
    save_json(os.path.join(data_path, filename), data)
