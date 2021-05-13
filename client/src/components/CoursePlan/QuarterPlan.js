import { Grid, Typography } from "@material-ui/core";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  quarterPlanHeader: {
    backgroundColor: "silver",
  },
  quarterPlanUnits: { float: "right", textAlign: "right", fontSize: "12px" },
});

const calculateTotalUnits = (courses) => {
  return courses.reduce((total, course) => {
    return total + (course.units ? parseInt(course.units.split("-")[0]) : 0);
  }, 0);
};

function QuarterPlan(props) {
  const { quarterPlan, year, quarter, classes } = props;
  let numUnits = calculateTotalUnits(
    quarterPlan.map((course) => course.content)
  );
  return (
    <Grid item>
      <Typography className={classes.quarterPlanHeader}>
        <span>{quarter}</span>
        <span className={classes.quarterPlanUnits}>{numUnits + " Units"}</span>
      </Typography>
      <CourseDroppable
        droppableId={year + quarter}
        courses={quarterPlan}
        isDeletable={true}
      />
    </Grid>
  );
}
export default withStyles(styles)(QuarterPlan);
