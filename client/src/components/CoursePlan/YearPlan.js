import { Fragment } from "react";
import { Grid, Typography } from "@material-ui/core";
import QuarterPlan from "./QuarterPlan";
import { QUARTERS } from "../CoursePlanner/courseLogic";

function getQuarterPlans(yearPlan, quarters) {
  // initialize each list to []
  let quarterPlans = Object.fromEntries(quarters.map((quarter)=>[quarter, []]));
  for (let course of yearPlan) {
    quarterPlans[course.quarter].push(course);
  }
  return quarterPlans;
}

function YearPlan(props) {
  const { year, yearPlan, startYear, removeCourseById } = props;
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
            style={{
              writingMode: "vertical-lr",
              marginTop: "25px",
              marginBottom: "25px",
              // marginRight: "1px",
              textAlign: "center",
            }}
          >
            {yearRange}
          </Typography>
        </Grid>
        {QUARTERS.map((quarter) => (
          <Grid
            item
            xs
            key={year + quarter + "grid"}
            style={{ background: "lightgray" }}
          >
            <QuarterPlan
              year={year}
              quarter={quarter}
              quarterPlan={quarterPlans[quarter]}
              removeCourseById={removeCourseById}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default YearPlan;
