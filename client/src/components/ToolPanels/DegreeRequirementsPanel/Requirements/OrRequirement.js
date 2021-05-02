import { Fragment } from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";
import CourseRequirementItem from "./CourseRequirementItem";

function OrRequirement(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <Divider />
      {requirement.courses.map((courseRequirement, index) => {
        return (
          <Fragment key={courseRequirement.courses[0] + "or" + index}>
            <CourseRequirementItem requirement={courseRequirement} />
            {index !== requirement.courses.length - 1 && (
              <ListItem dense={true}>
                <ListItemText primary="or"/>
              </ListItem>
            )}
          </Fragment>
        );
      })}
      <Divider />
    </Fragment>
  );
}

export default OrRequirement;
