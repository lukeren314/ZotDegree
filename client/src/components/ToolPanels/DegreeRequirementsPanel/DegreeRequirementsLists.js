import { Fragment } from "react";
import { List } from "@material-ui/core";
import DegreeRequirementsHeader from "./DegreeRequirementsHeader";
import DegreeRequirementsList from "./DegreeRequirementsList";

function DegreeRequirementsLists(props) {
  const {
    requirements,
    degreeName,
    degreeIndex,
    setListOpen,
    setSectionOpen,
  } = props;
  return (
    <List>
      {requirements.map((item, index) => {
        return (
          <Fragment key={index}>
            <DegreeRequirementsHeader
              degreeName={degreeName}
              degreeIndex={degreeIndex}
              setListOpen={setListOpen}
              index={index}
              item={item}
            />
            <DegreeRequirementsList
              degreeRequirementsList={item}
              setSectionOpen={setSectionOpen}
              degreeIndex={degreeIndex}
              listIndex={index}
            />
          </Fragment>
        );
      })}
    </List>
  );
}

export default DegreeRequirementsLists;
