import { Paper, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import CoursePlanSelect from "./CoursePlanSelect";
import StartYearSelect from "./StartYearSelect";
import NumYearsSelect from "./NumYearsSelect";
import TotalUnitsCount from "./TotalUnitsCount.js";

import { setCurrentCoursePlan, setNumYears, setStartYear } from "../../actions";
const styles = () => ({
  toolbarPaper: { marginBottom: "8px" },
  toolbarItem: { marginRight: "3vw" },
});

function CoursePlanToolbar(props) {
  const {
    coursePlan,
    currentCoursePlan,
    startYear,
    numYears,
    classes,
    dispatch,
  } = props;

  const dispatchCurrentCoursePlan = (currentCoursePlan_) =>
    dispatch(setCurrentCoursePlan(currentCoursePlan_));

  const dispatchStartYear = (startYear_) => dispatch(setStartYear(startYear_));

  const dispatchNumYears = (numYears_) => dispatch(setNumYears(numYears_));

  return (
    <Paper className={classes.toolbarPaper}>
      <Toolbar>
        <Typography className={classes.toolbarItem}>Course Plan</Typography>
        <CoursePlanSelect
          currentCoursePlan={currentCoursePlan}
          setCurrentCoursePlan={dispatchCurrentCoursePlan}
        />
        <StartYearSelect
          startYear={startYear}
          setStartYear={dispatchStartYear}
        />
        <NumYearsSelect
          numYears={numYears}
          setNumYears={dispatchNumYears}
        />
        <TotalUnitsCount coursePlan={coursePlan} />
      </Toolbar>
    </Paper>
  );
}
const mapStateToProps = (state) => state.coursePlans;
export default connect(mapStateToProps)(withStyles(styles)(CoursePlanToolbar));
