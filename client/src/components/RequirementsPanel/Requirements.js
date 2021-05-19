import { Fragment } from "react";
import { List } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import RequirementsList from "./RequirementsList";
import LoadingWheel from "../App/LoadingWheel";

const styles = () => ({
  degreeRequirementsDiv: { overflow: "auto", height: "70vh" },
});

const getInterpretedRequirements = (requirements, courses) => {
  const courseIdSet = new Set(courses.map((course) => course.content.id));
  return interpretRequirements(requirements, courseIdSet);
};

const interpretRequirements = (requirements, courseIdSet) => {
  return requirements.map((subRequirement) => ({
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
};

const interpretRequirementsList = (requirements, courseIdSet) => {
  return requirements.map((requirement) => {
    if (["section", "or"].includes(requirement.type)) {
      return {
        ...requirement,
        courses: interpretRequirementsList(requirement.courses, courseIdSet),
      };
    }
    if (["single", "series"].includes(requirement.type)) {
      return {
        ...requirement,
        checked: requirement.courses.map((courseId) =>
          courseIdSet.has(courseId)
        ),
      };
    }
    return requirement;
  });
};

function Requirements(props) {
  const { requirements, courses, isLoading, classes } = props;
  if (isLoading) {
    return <LoadingWheel isLoading={isLoading} />;
  }
  const interpretedRequirements = getInterpretedRequirements(
    requirements,
    courses
  );
  return (
    <div className={classes.degreeRequirementsDiv}>
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

export default withStyles(styles)(Requirements);
