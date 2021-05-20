import { Popover, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { getUnitsStr } from "../CoursePlanner/courseLogic";

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
      <div className={classes.courseInfo} style={{ width: 400 }}>
        <Typography variant="subtitle1">
          {course.id}. {course.name}. {getUnitsStr(course.units)} Unit(s).
        </Typography>
        <Typography variant="subtitle2"></Typography>
        <Typography variant="caption">{course.description}</Typography>
        <Typography variant="subtitle2">
          {course.prerequisites && "Prerequisites: " + course.prerequisites}
        </Typography>
        <Typography variant="subtitle2">
          {course.corequisite && "Corequisites: " + course.corequisites}
        </Typography>
        <Typography variant="subtitle2">
          {course.same_as && "Same as: " + course.same_as}
        </Typography>
        <Typography variant="subtitle2">
          {course.ge_categories.length > 0 &&
            "GE Categories: " + course.ge_categories.join(", ")}
        </Typography>
      </div>
    </Popover>
  );
}

export default withStyles(styles)(CoursePopover);
