import { Fragment } from "react";
import { List } from "@material-ui/core";
import RequirementList from "./RequirementList";
import LoadingWheel from "../App/LoadingWheel";

const getInterpretedRequirements = (degreeRequirements, courses) => {
  const courseIdSet = new Set(courses.map((course) => course.content.id));
  return interpretDegreeRequirements(degreeRequirements, courses, courseIdSet);
};

const interpretDegreeRequirements = (degreeRequirements, courses, courseIdSet) =>
degreeRequirements.map((degreeRequirement) => ({
    ...degreeRequirement,
    requirement_lists: degreeRequirement.requirement_lists.map(
      (requirement_lists) => ({
        ...requirement_lists,
        requirements: interpretRequirementList(
          requirement_lists.requirements,
          courses,
          courseIdSet
        ),
      })
    ),
  }));

const interpretRequirementList = (requirements, courses, courseIdSet) =>
  requirements.map((requirement) => {
    if (["section", "or", "series"].includes(requirement.type)) {
      return interpretNestedRequirement(requirement, courses, courseIdSet);
    }
    if (requirement.type === "course") {
      return interpretCourseRequirement(requirement, courseIdSet);
    }
    if (requirement.type === "ge") {
      return interpretGERequirement(requirement, courses);
    }
    return requirement;
  });

const interpretNestedRequirement = (requirement, courses, courseIdSet) => {
  return {
    ...requirement,
    subrequirements: interpretRequirementList(
      requirement.subrequirements,
      courses,
      courseIdSet
    ),
  };
}

const interpretCourseRequirement = (requirement, courseIdSet) => {
  return {
    ...requirement,
    checked: courseIdSet.has(requirement.course),
    satisfiedBy: [requirement.course],
  };
}

const interpretGERequirement = (requirement, courses) => {
  let satisfiedBy = [];
  for (let course of courses) {
    const content = course.content;
    if (satisfiedBy.includes(content.id)) {
      continue;
    }
    // handle category V edge case
    let catV = requirement.ge_cateogry === "V" && (content.ge_list.includes("Va") || content.ge_list.includes("Vb"));
    if (content.ge_list.includes(requirement.ge_category) || catV) {
      satisfiedBy.push(content.id);
    }
  }

  return {
    ...requirement,
    checked: satisfiedBy.length >= requirement.count,
    satisfiedBy: satisfiedBy,
  };
}

function Requirements(props) {
  const { requirements, coursePlan, isLoading } = props;
  if (isLoading) {
    return <LoadingWheel isLoading={isLoading} />;
  }
  const interpretedRequirements = getInterpretedRequirements(
    requirements,
    coursePlan
  );
  return (
    <div>
      {interpretedRequirements.map((degreeRequirement) => (
        <List key={degreeRequirement.header}>
          {degreeRequirement.requirement_lists.map((item, index) => (
            <Fragment key={index}>
              <RequirementList
                requirementList={item}
                parentRequirementHeader={degreeRequirement.header}
              />
            </Fragment>
          ))}
        </List>
      ))}
    </div>
  );
}

export default Requirements;
