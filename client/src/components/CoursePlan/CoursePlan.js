import { Grid } from "@material-ui/core";
import LoadingWheel from "../App/LoadingWheel";
import YearPlan from "./YearPlan";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  coursePlanGrid: { overflow: "auto", height: "75vh" },
});

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
  const { coursePlan, numYears, startYear, isLoading, classes } = props;
  if (isLoading) {
    return <LoadingWheel isLoading={isLoading} />;
  }
  const yearPlans = getYearPlans(coursePlan, numYears);
  return (
    <Grid className={classes.coursePlanGrid}>
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
export default withStyles(styles)(CoursePlan);
