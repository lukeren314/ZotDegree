import { Grid, Typography } from "@material-ui/core";

import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";

function calculateTotalUnits(courses) {
  return courses.reduce((total, course) => {
    return total + (course.units ? parseInt(course.units.split("-")[0]) : 0);
  }, 0);
}

function QuarterPlan(props) {
  const { quarterPlan, year, quarter, deleteCourse } = props;
  let numUnits = calculateTotalUnits(
    quarterPlan.map((course) => course.content)
  );
  return (
    <Grid item>
      <Typography style={{ backgroundColor: "silver" }}>
        <span>{quarter}</span>
        <span style={{ float: "right", textAlign: "right", fontSize: "12px" }}>
          {numUnits + " Units"}
        </span>
      </Typography>
      <CourseDroppable
        droppableId={year + quarter}
        courses={quarterPlan}
        isDeletable={true}
        deleteCourse={deleteCourse}
      />
    </Grid>
  );
}
export default QuarterPlan;
