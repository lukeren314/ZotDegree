import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

function CourseDeleteButton(props) {
  const { draggableId, removeCourse } = props;
  return (
    <IconButton
      edge="end"
      aria-label="delete"
      size="small"
      color="secondary"
      onClick={() => {
        removeCourse(draggableId);
      }}
    >
      <ClearIcon fontSize="small" />
    </IconButton>
  );
}

export default CourseDeleteButton;
