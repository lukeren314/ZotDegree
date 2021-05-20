import { Fragment } from "react";
import { Divider } from "@material-ui/core";
import CourseRequirementItem from "./CourseRequirementItem";

function CourseRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      <CourseRequirementItem requirement={requirement} />
      <Divider />
    </Fragment>
  );
}

export default CourseRequirement;
