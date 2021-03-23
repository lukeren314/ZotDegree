
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


def scrape_and_save_degrees(soup_cache, data_path):
    degrees = scrape_degrees(soup_cache)
    save_data(data_path, "degrees.json", degrees)


def scrape_and_save_schools(soup_cache, data_path):
    schools = scrape_schools(soup_cache)
    save_data(data_path, "schools.json", schools)


def save_data(data_path, filename, data):
    save_json(os.path.join(data_path, filename), data)
