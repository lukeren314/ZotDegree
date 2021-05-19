import { Grid, Typography } from "@material-ui/core";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";
import { withStyles } from "@material-ui/styles";
import { calculateTotalUnits, getUnitsStr } from "../CoursePlanner/courseLogic";

const styles = () => ({
  quarterPlanHeader: {
    backgroundColor: "silver",
  },
  quarterPlanUnits: { float: "right", textAlign: "right", fontSize: "12px" },
});

function QuarterPlan(props) {
  const { quarterPlan, year, quarter, classes } = props;
  let totalUnits = calculateTotalUnits(
    quarterPlan.map((course) => course.content)
  );
  return (
    <Grid item>
      <Typography className={classes.quarterPlanHeader}>
        <span>{quarter}</span>
        <span className={classes.quarterPlanUnits}>{getUnitsStr(totalUnits) + " Units"}</span>
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
