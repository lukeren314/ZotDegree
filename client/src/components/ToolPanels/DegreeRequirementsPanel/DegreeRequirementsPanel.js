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
  } = props;
  return (
    <div>
      <DegreeSearchBar
        degreesList={degreesList}
        degrees={degrees}
        setDegrees={setDegrees}
      />
      <div style={{ overflow: "auto", height: "70vh" }}>
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
