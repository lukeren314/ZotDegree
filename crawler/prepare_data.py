import shutil
import os
from util import save_json, load_json

DATA_PATH = "./datasets"


def prepare_data(data_path):
    pass


if __name__ == "__main__":
    # PLEASE REMOVE LATER
    # degrees_json = load_json(os.path.join(DATA_PATH, "degrees.json"))
    # test_req = degrees_json["Computer Science, B.S."]
    # save_json("test_requirements.json", test_req)

    courses_json = load_json(os.path.join(DATA_PATH, "courses.json"))
    units_set = set()
    for course_name, course in courses_json.items():
        units_set.add(course["units"])
    print(units_set)
