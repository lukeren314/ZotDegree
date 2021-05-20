import { Grid } from "@material-ui/core";
import LoadingWheel from "../App/LoadingWheel";
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
    return <LoadingWheel isLoading={isLoading} />;
  }
  const yearPlans = getYearPlans(courses, numYears);
  return (
    <Grid style={{overflow: "auto", height: "75vh"}}>
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
