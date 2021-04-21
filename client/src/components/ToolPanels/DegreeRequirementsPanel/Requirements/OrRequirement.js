import { Fragment } from "react";
import { ListItem, ListItemText, Box, Divider } from "@material-ui/core";
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
              <ListItem>
                <ListItemText>
                  <Box>or</Box>
                </ListItemText>
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
