import { Grid, Fade, CircularProgress } from "@material-ui/core";
import YearPlan from "./YearPlan";

const getYearPlans = (coursePlan, numYears) => {
  // initialize each list to []
  let yearPlans = Object.fromEntries(
    [...Array(numYears).keys()].map((i) => [i, []])
  );
  for (let course of coursePlan) {
    yearPlans[course.year].push(course);
  }
  return yearPlans;
};

function CoursePlan(props) {
  const { courses, numYears, startYear, isLoading } = props;
  if (isLoading) {
    return (
      <Fade
        in={isLoading}
        style={{
          transitionDelay: isLoading ? "80ms" : "0ms",
        }}
        unmountOnExit
      >
        <CircularProgress />
      </Fade>
    );
  }
  const yearPlans = getYearPlans(courses, numYears);
  return (
    <Grid>
      {[...Array(numYears).keys()].map((year) => (
        <YearPlan
          key={year + "year"}
          startYear={startYear}
          year={year}
          yearPlan={yearPlans[year]}
        />
      ))}
    </Grid>
  );
}
export default CoursePlan;
