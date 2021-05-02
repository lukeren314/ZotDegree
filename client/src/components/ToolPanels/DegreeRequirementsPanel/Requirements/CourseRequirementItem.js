import { Fragment } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@material-ui/core";

function CourseRequirementItem(props) {
  const { requirement } = props;
  return (
    <Fragment>
      {requirement.courses.map((course) => (
        <ListItem key={course} button>
          <ListItemText primary={course} primaryTypographyProps={{variant:"body2"}}/>
          <ListItemSecondaryAction>
            <Checkbox checked={true} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </Fragment>
  );
}

export default CourseRequirementItem;
