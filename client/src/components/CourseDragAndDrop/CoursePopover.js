import { Popover, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  courseInfo: {
    padding: theme.spacing(2),
  },
});

function CoursePopover(props) {
  const { anchorEl, handleClose, course, classes } = props;
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      disableRestoreFocus
    >
      <div className={classes.courseInfo}>
        <Typography variant="subtitle1">
          {course.id}: {course.name}
        </Typography>
        <Typography variant="subtitle2">{course.units} Unit(s)</Typography>
        <Typography variant="subtitle2">
          Prerequisites: {course.prerequisites || "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          Corequisites: {course.corequisites || "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          Same as: {course.same_as || "N/A"}
        </Typography>
        <Typography variant="subtitle2">
          GE Categories: {course.ge_categories.join(", ") || "N/A"}
        </Typography>
      </div>
    </Popover>
  );
}

export default withStyles(styles)(CoursePopover);
