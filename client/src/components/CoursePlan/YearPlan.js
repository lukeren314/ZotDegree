import { Fragment } from "react";
import { Grid, Typography } from "@material-ui/core";
import QuarterPlan from "./QuarterPlan";
import { withStyles } from "@material-ui/styles";

const QUARTERS = ["Fall", "Winter", "Spring", "Summer"];

const styles = () => ({
  yearPlanHeader: {
    writingMode: "vertical-lr",
    marginTop: "25px",
    marginBottom: "25px",
    // marginRight: "1px",
    textAlign: "center",
  },
  yearPlanGrid: { background: "lightgray" },
});

const getQuarterPlans = (yearPlan, quarters) => {
  // initialize each list to []
  let quarterPlans = Object.fromEntries(
    quarters.map((quarter) => [quarter, []])
  );
  for (let course of yearPlan) {
    quarterPlans[course.quarter].push(course);
  }
  return quarterPlans;
};

function YearPlan(props) {
  const { year, yearPlan, startYear, classes } = props;
  const quarterPlans = getQuarterPlans(yearPlan, QUARTERS);
  const yearRange = `${parseInt(startYear) + parseInt(year)} - ${
    parseInt(startYear) + parseInt(year) + 1
  }`;
  return (
    <Fragment>
      <Grid container xs direction="row" item spacing={1}>
        <Grid item>
          <Typography
            key={year + "typography"}
            className={classes.yearPlanHeader}
          >
            {yearRange}
          </Typography>
        </Grid>
        {QUARTERS.map((quarter) => (
          <Grid
            item
            xs
            key={year + quarter + "grid"}
            className={classes.yearPlanGrid}
          >
            <QuarterPlan
              year={year}
              quarter={quarter}
              quarterPlan={quarterPlans[quarter]}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default withStyles(styles)(YearPlan);
