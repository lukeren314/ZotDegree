import DegreeSearchBar from "./DegreeSearchBar";
import Requirements from "./Requirements";
import { Fragment } from "react";
import { connect } from "react-redux";
import { maybeSetDegrees } from "../../actions";

function RequirementsPanel(props) {
  const {
    degrees,
    requirements,
    coursePlan,
    isFetchingRequirements,
    dispatch
  } = props;
  const dispatchDegrees = (degrees_) => dispatch(maybeSetDegrees(degrees_))
  return (
    <Fragment>
      <DegreeSearchBar degrees={degrees} setDegrees={dispatchDegrees} />
      <Requirements
        requirements={requirements}
        coursePlan={coursePlan}
        isLoading={isFetchingRequirements}
      />
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  ...state.requirements,
  coursePlan: state.coursePlans.coursePlan,
});
export default connect(mapStateToProps)(RequirementsPanel);
