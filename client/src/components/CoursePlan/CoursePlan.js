import { Grid } from "@material-ui/core";
import YearPlan from "./YearPlan";

function getYearPlans(coursePlan, numYears) {
  // initialize each list to []
  let yearPlans = Object.fromEntries([...Array(numYears).keys()].map((i)=>[i, []]));
  for (let course of coursePlan) {
    yearPlans[course.year].push(course);
  }
  return yearPlans;
}

function CoursePlan(props) {
  const { coursePlan, removeCourseById, startYear, numYears } = props;
  const yearPlans = getYearPlans(coursePlan, numYears);
  return (
    <Grid>
      {[...Array(numYears).keys()].map((year) => (
        <YearPlan
          key={year + "year"}
          startYear={startYear}
          year={year}
          yearPlan={yearPlans[year]}
          removeCourseById={removeCourseById}
        />
      ))}
    </Grid>
  );
}
export default CoursePlan;
