import { Grid } from "@material-ui/core";
import YearPlan from "./YearPlan";

function CoursePlan(props) {
  const { coursePlan, deleteCourse } = props;
  return (
    <Grid>
      {Object.keys(coursePlan).map((year) => (
        <YearPlan
          key={year + "year"}
          year={year}
          yearPlan={coursePlan[year]}
          deleteCourse={deleteCourse}
        />
      ))}
    </Grid>
  );
}
export default CoursePlan;
