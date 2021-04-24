import { Grid } from "@material-ui/core";
import YearPlan from "./YearPlan";

function CoursePlan(props) {
  const { coursePlan, deleteCourse, startYear, numYears } = props;
  return (
    <Grid>
      {Object.keys(coursePlan).map(
        (year) =>
          year < numYears && (
            <YearPlan
              key={year + "year"}
              startYear={startYear}
              year={year}
              yearPlan={coursePlan[year]}
              deleteCourse={deleteCourse}
            />
          )
      )}
    </Grid>
  );
}
export default CoursePlan;
