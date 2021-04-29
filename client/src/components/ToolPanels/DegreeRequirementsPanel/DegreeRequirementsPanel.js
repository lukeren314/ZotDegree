import { Fade, CircularProgress } from "@material-ui/core";
import DegreeSearchBar from "./DegreeSearchBar";
import DegreeRequirements from "./DegreeRequirements";

function DegreeRequirementsPanel(props) {
  const {
    degrees,
    setDegrees,
    degreesList,
    requirements,
    setListOpen,
    setSectionOpen,
    isLoading,
  } = props;
  return (
    <div>
      <DegreeSearchBar
        degreesList={degreesList}
        degrees={degrees}
        setDegrees={setDegrees}
      />
      <div style={{ overflow: "auto", height: "70vh" }}>
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? "80ms" : "0ms",
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
        <DegreeRequirements
          requirements={requirements}
          setListOpen={setListOpen}
          setSectionOpen={setSectionOpen}
        />
      </div>
    </div>
  );
}

export default DegreeRequirementsPanel;
