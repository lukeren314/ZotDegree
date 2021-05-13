import CoursePlanContext from "../../contexts/CoursePlanContext";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import {withStyles} from "@material-ui/styles";
const styles = () => ({
  deleteIcon: {color: "white"}
});

function CourseDeleteButton(props) {
  const { isDeletable, courseId, classes } = props;
  return (
    <CoursePlanContext.Consumer>
      {({ removeCourseById }) => (
        <ListItemSecondaryAction>
          {isDeletable && (
            <IconButton
              edge="end"
              aria-label="delete"
              size="small"
              onClick={() => {
                removeCourseById(courseId);
              }}
            >
              <ClearIcon
                fontSize="small"
                className={classes.deleteIcon}
              />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      )}
    </CoursePlanContext.Consumer>
  );
}

export default withStyles(styles)(CourseDeleteButton);
