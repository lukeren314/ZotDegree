import { Fragment } from "react";
import { Grid, Typography } from "@material-ui/core";
import QuarterPlan from "./QuarterPlan";
import { QUARTERS } from "../CoursePlanner/util";

function YearPlan(props) {
  const { year, yearPlan, deleteCourse } = props;
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
            {"202" + year + "-2021"}
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
              quarterPlan={yearPlan[quarter]}
              deleteCourse={deleteCourse}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default YearPlan;
