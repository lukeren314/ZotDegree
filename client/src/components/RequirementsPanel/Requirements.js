import { Fragment } from "react";
import { List } from "@material-ui/core";
import RequirementsList from "./RequirementsList";
import LoadingWheel from "../App/LoadingWheel";

const getInterpretedRequirements = (requirements, courses) => {
  const courseIdSet = new Set(courses.map((course) => course.content.id));
  return interpretRequirements(requirements, courseIdSet);
};

const interpretRequirements = (requirements, courseIdSet) =>
  requirements.map((subRequirement) => ({
    ...subRequirement,
    requirementsLists: subRequirement.requirementsLists.map(
      (requirementsList) => ({
        ...requirementsList,
        requirements: interpretRequirementsList(
          requirementsList.requirements,
          courseIdSet
        ),
      })
    ),
  }));

const interpretRequirementsList = (requirements, courseIdSet) =>
  requirements.map((requirement) => {
    if (["section", "or", "series"].includes(requirement.type)) {
      return {
        ...requirement,
        subrequirements: interpretRequirementsList(
          requirement.subrequirements,
          courseIdSet
        ),
      };
    }
    if (["single"].includes(requirement.type)) {
      return {
        ...requirement,
        checked: courseIdSet.has(requirement.course),
        satisfiedBy: [requirement.course],
      };
    }
    return requirement;
  });

function Requirements(props) {
  const { requirements, courses, isLoading } = props;
  if (isLoading) {
    return <LoadingWheel isLoading={isLoading} />;
  }
  const interpretedRequirements = getInterpretedRequirements(
    requirements,
    courses
  );
  return (
    <div>
      {interpretedRequirements.map((requirement) => (
        <List key={requirement.name}>
          {requirement.requirementsLists.map((item, index) => (
            <Fragment key={index}>
              <RequirementsList
                requirementsList={item}
                requirementsName={requirement.name}
              />
            </Fragment>
          ))}
        </List>
      ))}
    </div>
  );
}

export default Requirements;
