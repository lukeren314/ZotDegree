import { Fragment } from "react";
import { Divider } from "@material-ui/core";
import CourseRequirementItem from "./CourseRequirementItem";

function SeriesRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      {requirement.subrequirements.map((subrequirement, index) => (
        <CourseRequirementItem
          key={subrequirement.course + index}
          requirement={subrequirement}
        />
      ))}
      <Divider />
    </Fragment>
  );
}

export default SeriesRequirement;
