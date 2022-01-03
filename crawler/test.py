import json

grading_options = set()
for id, course in json.load(open('datasets/courses.json')).items():
    grading_options.add(course['grading_option'])
    if not course['grading_option']:
        print(course)
print(grading_options)

# import json
# import requests
# from bs4 import BeautifulSoup
# import time

# TIME_THRESHOLD = 0.5
# last_time = time.time()

# def get_request(dept, num):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     params = dict()
#     params["Dept"] = dept
#     params["CourseNum"] = num

#     time_diff = time.time()-last_time
#     if time_diff < TIME_THRESHOLD:
#         time.sleep(TIME_THRESHOLD-time_diff)

#     return requests.get("https://www.reg.uci.edu/perl/WebSoc/", params=params, headers=headers).content

# def has_fall(terms):
#     return any(("2021  Fall Quarter" in term for term in terms))

# def is_fall(dept, num):
#     request_content = get_request(dept, num)
#     parsed_html = BeautifulSoup(request_content, "lxml")
#     select = parsed_html.find("select", {"name": "YearTerm"})
#     if select:
#         raw_terms = select.find_all("option")
#         terms = [str(line).replace("\xa0", "") for line in raw_terms]
#         return has_fall(terms)
#     return False

#     # terms_set = set()
#     # for course in data:
#     #     if "terms" in course:
#     #         for term in course["terms"]:
#     #             terms_set.add(term)
#     # print(terms_set)

# # with open("foo.json", "w") as f2:
# #         f2.write(json.dumps(requests.get(f"https://api.peterportal.org/rest/v0/courses/all").json()))

# with open("datasets/courses.json") as f:
#     data = json.loads(f.read())
#     unit_courses = []
#     for course_id, course in data.items():
#         if course["units"][1] < 3 and course["number"][0] != "2":
#             if is_fall(course["department"], course["number"]):
#                 print(course["id"], course["name"], end=", ")
#                 if course["restriction"]:
#                     print("Restriction:", course["restriction"])
#                 else:
#                     print("Restriction: None")
#             # courseid = course_id.replace(" ", "")
#             # pp_course = requests.get(f"https://api.peterportal.org/rest/v0/courses/{courseid}").json()
#             # unit_courses.append(pp_course)
#     # with open("foo.json", "w") as f2:
#     #     f2.write(json.dumps(unit_courses))