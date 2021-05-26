import { Fragment } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import { onDragEnd } from "./dragLogic";
import CoursePlanToolbar from "../CoursePlanToolbar/CoursePlanToolbar";
import CoursePlan from "../CoursePlan/CoursePlan";
import ToolPanels from "../ToolPanels/ToolPanels";
import RequirementsPanel from "../RequirementsPanel/RequirementsPanel";
import CourseSearchPanel from "../CourseSearchPanel/CourseSearchPanel";

import {
  openAlert,
  setCoursePlan,
} from "../../actions";

function CoursePlanner(props) {
  const {
    coursePlan,
    numYears,
    startYear,
    isLoading,
    searchList,
    loadedRequirements,
    dispatch,
  } = props;
  const dispatchCoursePlan = (coursePlan_) =>
    dispatch(setCoursePlan(coursePlan_));
  const dispatchAlert = (msg, severity) => dispatch(openAlert(msg, severity));

  return (
    <DragDropContext
      onDragEnd={(result) =>
        onDragEnd(
          result,
          coursePlan,
          searchList,
          loadedRequirements,
          dispatchCoursePlan,
          dispatchAlert
        )
      }
    >
      <Grid container>
        <Grid item xs={12} s={7} md={7} lg={7} xl={7}>
          <Fragment>
            <CoursePlanToolbar />
            <CoursePlan
              coursePlan={coursePlan}
              numYears={numYears}
              startYear={startYear}
              isLoading={isLoading}
            />
          </Fragment>
        </Grid>
        <Grid item xs={12} s={5} md={5} lg={5} xl={5}>
          <ToolPanels>
            <RequirementsPanel />
            <CourseSearchPanel />
          </ToolPanels>
        </Grid>
      </Grid>
    </DragDropContext>
  );
}

const mapStateToProps = (state) => ({
  ...state.coursePlans,
  isLoading: state.userData.isFetchingLoad,
  searchList: state.courseSearch.searchList,
  loadedRequirements: state.requirements.loadedRequirements,
});
export default connect(mapStateToProps)(CoursePlanner);
