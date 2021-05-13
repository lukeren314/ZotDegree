import DegreeSearchBar from "./DegreeSearchBar";
import Requirements from "./Requirements";
import { Fragment } from "react";

function RequirementsPanel(props) {
  const { degrees, requirements, courses, isLoading, setDegrees } = props;
  return (
    <Fragment>
      <DegreeSearchBar
        degrees={degrees}
        setDegrees={(_, newDegrees) => setDegrees(newDegrees)}
      />
      <Requirements
        requirements={requirements}
        courses={courses}
        isLoading={isLoading}
      />
    </Fragment>
  );
}

export default RequirementsPanel;
