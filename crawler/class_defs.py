from typing import List

# SUPER CLASS


class JSONSerializable:
    def to_json(self):
        return {}

# COURSE


class Course(JSONSerializable):
    def __init__(self, id: int, department: str, number: str, name: str, units: List[int]):
        self.id = id
        self.department = department
        self.number = number
        self.name = name
        self.units = units

    def set_course_data(self, description: str, prerequisite_text: str, corequisite: str, same_as: str, prerequisite_list: List[str], ge_list: List[str]):
        self.description = description
        self.prerequisite_text = prerequisite_text
        self.corequisite = corequisite
        self.same_as = same_as
        self.prerequisite_list = prerequisite_list
        self.ge_list = ge_list

    def to_json(self):
        return {
            "id": self.id,
            "department": self.department,
            "number": self.number,
            "name": self.name,
            "units": self.units,
            "description": self.description,
            "prerequisite_text": self.prerequisite_text,
            "corequisite": self.corequisite,
            "same_as": self.same_as,
            "prerequisite_list": self.prerequisite_list,
            "ge_list": self.ge_list
        }


class CourseDepartment(JSONSerializable):
    def __init__(self, title: str, name: str):
        self.title = title
        self.name = name

    def set_course_ids(self, course_ids: List[str]):
        self.course_ids = course_ids

    def to_json(self):
        return {
            "title": self.title,
            "name": self.name,
            "course_ids": self.course_ids
        }


# REQUIREMENTS

class RequirementItem(JSONSerializable):
    def __init__(self, type_: str):
        self.type = type_

    def set_id(self, id: int):
        self.id = id

    def to_json(self):
        return {
            "id": self.id,
            "type": self.type
        }


class CourseRequirementItem(RequirementItem):
    def __init__(self, course_id: str):
        super().__init__("course")
        self.course_id = course_id

    def to_json(self):
        return {
            "course_id": self.course_id,
            **super().to_json()
        }


class CommentRequirementItem(RequirementItem):
    def __init__(self, text: str):
        super().__init__("comment")
        self.text = text

    def to_json(self):
        return {
            "text": self.text,
            **super().to_json()
        }


class HeaderRequirementItem(RequirementItem):
    def __init__(self, text: str):
        super().__init__("header")
        self.text = text

    def to_json(self):
        return {
            "text": self.text,
            **super().to_json()
        }


class GERequirementItem(RequirementItem):
    def __init__(self, text: str, ge_category: str, count: int):
        super().__init__("ge")
        self.text = text
        self.ge_category = ge_category
        self.count = count

    def to_json(self):
        return {
            "text": self.text,
            "ge_category": self.ge_category,
            "count": self.count,
            **super().to_json()
        }


class OrRequirementItem(RequirementItem):
    def __init__(self, subrequirements: List[RequirementItem]):
        super().__init__("or")
        self.subrequirements = subrequirements

    def to_json(self):
        return {
            "subrequirements": [requirement.to_json() for requirement in self.subrequirements],
            **super().to_json()
        }


class SeriesRequirementItem(RequirementItem):
    def __init__(self, subrequirements: List[RequirementItem]):
        super().__init__("series")
        self.subrequirements = subrequirements

    def to_json(self):
        return {
            "subrequirements": [requirement.to_json() for requirement in self.subrequirements],
            **super().to_json()
        }


class SectionRequirementItem(RequirementItem):
    def __init__(self, text: str, subrequirements: List[RequirementItem]):
        super().__init__("section")
        self.text = text
        self.subrequirements = subrequirements

    def to_json(self):
        return {
            "text": self.text,
            "subrequirements": [requirement.to_json() for requirement in self.subrequirements],
            **super().to_json()
        }


class CustomRequirementItem(RequirementItem):
    def __init__(self, type_: str, **kwargs):
        super().__init__(type_)
        self.additional_data = kwargs

    def to_json(self):
        return {
            **self.additional_data,
            **super().to_json()
        }


class RequirementList(JSONSerializable):
    def __init__(self, header: str, requirements: List[RequirementItem]):
        self.header = header
        self.requirements = requirements

    def to_json(self):
        return {
            "header": self.header,
            "requirements": [requirement.to_json() for requirement in self.requirements]
        }


class DegreeRequirements(JSONSerializable):
    def __init__(self, header: str, requirement_lists: List[RequirementList]):
        self.header = header
        self.requirement_lists = requirement_lists

    def to_json(self):
        return {
            "header": self.header,
            "requirement_lists": [requirement_list.to_json() for requirement_list in self.requirement_lists]
        }

# DEGREE


class Degree(JSONSerializable):
    def __init__(self, name: str, subject: str, level: str, school: str, department: str, requirements: DegreeRequirements):
        self.name = name
        self.subject = subject
        self.level = level
        self.school = school
        self.department = department
        self.requirements = requirements

    def set_url(self, url: str):
        self.url = url

    def to_json(self):
        return {
            "name": self.name,
            "subject": self.subject,
            "level": self.level,
            "school": self.school,
            "department": self.department,
            "requirements": self.requirements.to_json(),
            "url": self.url
        }

# SCHOOL


class School(JSONSerializable):
    def __init__(self, name: str, requirements: DegreeRequirements):
        self.name = name
        self.requirements = requirements

    def to_json(self):
        return {
            "name": self.name,
            "requirements": self.requirements.to_json()
        }
