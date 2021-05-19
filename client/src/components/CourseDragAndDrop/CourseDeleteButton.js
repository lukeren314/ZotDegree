import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import CoursePlanContext from "../../contexts/CoursePlanContext";

function CourseDeleteButton(props) {
  const { courseId } = props;
  return (
    <CoursePlanContext.Consumer>
      {({ removeCourseById }) => (
        <IconButton
          edge="end"
          aria-label="delete"
          size="small"
          color="secondary"
          onClick={() => {
            removeCourseById(courseId);
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </CoursePlanContext.Consumer>
  );
}

export default CourseDeleteButton;
