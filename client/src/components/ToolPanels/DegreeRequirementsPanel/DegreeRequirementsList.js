import { Collapse, List } from "@material-ui/core";
import Requirement from "./Requirements/Requirement";

function DegreeRequirementsList(props) {
  const {
    degreeRequirementsList,
    setSectionOpen,
    degreeIndex,
    listIndex,
  } = props;
  return (
    <Collapse in={degreeRequirementsList.open} timeout="auto" unmountOnExit>
      <List>
        {degreeRequirementsList.requirements.map((requirement, index) => {
          return (
            <Requirement
              key={degreeRequirementsList.header + index}
              requirement={requirement}
              setSectionOpen={setSectionOpen}
              degreeIndex={degreeIndex}
              listIndex={listIndex}
              requirementIndex={index}
            />
          );
        })}
      </List>
    </Collapse>
  );
}

export default DegreeRequirementsList;
