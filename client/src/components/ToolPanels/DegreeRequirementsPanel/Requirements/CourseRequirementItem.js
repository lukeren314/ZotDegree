import { Fragment } from "react";
import {
  ListItem,
  ListItemText,
  Box,
  ListItemSecondaryAction,
  Checkbox,
} from "@material-ui/core";

function CourseRequirementItem(props) {
  const { requirement } = props;
  return (
    <Fragment>
      {requirement.courses.map((course) => (
        <ListItem key={course} button>
          <ListItemText>
            <Box>{course}</Box>
          </ListItemText>
          <ListItemSecondaryAction>
            <Checkbox checked={true} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </Fragment>
  );
}

export default CourseRequirementItem;
