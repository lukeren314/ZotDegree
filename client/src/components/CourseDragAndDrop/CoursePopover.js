import { Popover, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { getUnitsStr } from "../../util/courseLogic";

const styles = (theme) => ({
  courseInfo: {
    padding: theme.spacing(2),
    width: 300,
  },
});

function CoursePopover(props) {
  const { anchorEl, handleClose, course, classes, PaperProps } = props;
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      disableRestoreFocus
      PaperProps={PaperProps}
    >
      <div className={classes.courseInfo}>
        <Typography variant="subtitle1">
          {course.id}. {course.title}. {getUnitsStr(course.units)} Unit(s).
        </Typography>
        <Typography variant="subtitle2"></Typography>
        <Typography variant="caption">{course.description}</Typography>
        <Typography variant="subtitle2">
          {course.prerequisite_text && "Prerequisites: " + course.prerequisite_text}
        </Typography>
        <Typography variant="subtitle2">
          {course.corequisite && "Corequisites: " + course.corequisite}
        </Typography>
        <Typography variant="subtitle2">
          {course.same_as && "Same as: " + course.same_as}
        </Typography>
        <Typography variant="subtitle2">
          {course.ge_list.length > 0 &&
            "GE Categories: " + course.ge_list.join(", ")}
        </Typography>
      </div>
    </Popover>
  );
}

export default withStyles(styles)(CoursePopover);
