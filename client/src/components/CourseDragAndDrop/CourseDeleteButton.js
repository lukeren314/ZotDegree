import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

function CourseDeleteButton(props) {
  const { courseId, removeCourseById } = props;
  return (
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
  );
}

export default CourseDeleteButton;
