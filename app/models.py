

class School:
    def __init__(self, name, departments):
        self.name = name
        self.departments = departments


class Department:
    def __init__(self, name, majors, minors, courses):
        self.name = name
        self.majors = majors
        self.minors = minors
        self.courses = courses


class Major:
    def __init__(self, name, department, requirements):
        self.name = name
        self.department = department
        self.requirements = requirements


class Course:
    def __init__(self, name, department, department_abbr, course_number, units, prerequisite, corequisite, ge_categories):
        self.name = name
        self.department_abbr = department_abbr
        self.department = department
        self.course_number = course_number
        self.units = units
        self.prerequisite = prerequisite
        self.corequisite = corequisite
        self.ge_categories = ge_categories


class Requirements:
    def __init__(self, requirements):
        pass


class Requirement:
    def __init__(self, course):
        pass


class Offering:
    pass
