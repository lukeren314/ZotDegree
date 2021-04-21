import DegreeRequirementsLists from "./DegreeRequirementsLists";

function DegreeRequirements(props) {
  const { requirements, setListOpen, setSectionOpen } = props;
  return (
    <div>
      {requirements.map((degreeRequirements, index) => {
        return (
          <DegreeRequirementsLists
            key={degreeRequirements.name}
            requirements={degreeRequirements.requirementsLists}
            setListOpen={setListOpen}
            setSectionOpen={setSectionOpen}
            degreeName={degreeRequirements.name}
            degreeIndex={index}
          ></DegreeRequirementsLists>
        );
      })}
    </div>
  );
}

export default DegreeRequirements;
