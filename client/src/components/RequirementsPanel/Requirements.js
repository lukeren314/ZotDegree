import { Fragment } from "react";
import { Fade, CircularProgress, List } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import RequirementsList from "./RequirementsList";

const getFadeStyle = (isLoading) => ({
  transitionDelay: isLoading ? "80ms" : "0ms",
});

const styles = () => ({
  degreeRequirementsDiv: { overflow: "auto", height: "70vh" },
});

const getInterpretedRequirements = (requirements, courses) => {
  const courseIdSet = new Set(courses.map((course) => course.content.id));
  return interpretRequirements(requirements, courseIdSet);
};

const interpretRequirements = (requirements, courseIdSet) => {
  let newRequirements = [];
  for (let subRequirement of requirements) {
    let newRequirementsLists = [];
    for (let requirementsList of subRequirement.requirementsLists) {
      newRequirementsLists.push({
        ...requirementsList,
        requirements: interpretRequirementsList(
          requirementsList.requirements,
          courseIdSet
        ),
      });
    }
    newRequirements.push({
      ...subRequirement,
      requirementsLists: newRequirementsLists,
    });
  }
  return newRequirements;
};

const interpretRequirementsList = (requirements, courseIdSet) => {
  let newRequirements = [];
  for (let requirement of requirements) {
    if (["section", "or"].includes(requirement.type)) {
      newRequirements.push({
        ...requirement,
        courses: interpretRequirementsList(
          requirement.courses,
          courseIdSet
        ),
      });
    }
    if (["single", "series"].includes(requirement.type)) {
      newRequirements.push({
        ...requirement,
        checked: requirement.courses.map((courseId) =>
          courseIdSet.has(courseId)
        ),
      });
    }
  }
  return newRequirements;
};

function Requirements(props) {
  const { requirements, courses, isLoading, classes } = props;
  if (isLoading) {
    return (
      <Fade in={isLoading} style={getFadeStyle(isLoading)} unmountOnExit>
        <CircularProgress />
      </Fade>
    );
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
