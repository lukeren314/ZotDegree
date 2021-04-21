
from util.utils import save_json
from scrape_schools import scrape_schools
from scrape_degrees import scrape_degrees
from scrape_courses import scrape_course_departments
import os

COURSES_URL = "http://catalogue.uci.edu/allcourses/"
REQUIREMENTS_URL = "http://catalogue.uci.edu/informationforadmittedstudents/requirementsforabachelorsdegree/"


def scrape_catalogue(soup_cache, data_path):
    scrape_and_save_course_departments(soup_cache, data_path)
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


def create_course_departments_list(course_departments):
    course_departments_list = []
    course_departments_list.append({
        "value": "ALL",
        "label": "ALL Departments"
    })
    for course_department_label, course_department_data in sorted(course_departments.items(), key=lambda label, _: label):
        value = course_department_label
        label = f"{course_department_label} {course_department_data['title']}"
        course_departments_list.append({
            "value": value,
            "label": label
        })
    return course_departments_list


def create_course_list(courses):
    course_list = []
    for course_name, course_data in sorted(courses.items(), key=lambda name, _: name):
        value = course_name
        label = f"{course_name} {course_data['name']}"
        course_list.append({
            "value": value,
            "label": label
        })
    return course_list


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
