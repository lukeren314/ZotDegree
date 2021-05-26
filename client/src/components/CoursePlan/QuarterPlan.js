import { Grid, Typography } from "@material-ui/core";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";
import { withStyles } from "@material-ui/styles";
import { calculateTotalUnits, getUnitsStr } from "../../util/courseLogic";

const styles = () => ({
  quarterPlanHeader: {
    paddingLeft:"4px",
    paddingRight:"4px",
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
        backgroundColor={"#b0b0b0"}
      />
    </Grid>
  );
}
export default withStyles(styles)(QuarterPlan);
