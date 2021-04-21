import { Fragment } from "react";
import CommentRequirement from "./CommentRequirement";
import HeaderRequirement from "./HeaderRequirement";
import OrRequirement from "./OrRequirement";
import CourseRequirement from "./CourseRequirement";
import SectionRequirement from "./SectionRequirement";

function Requirement(props) {
  const {
    requirement,
    setSectionOpen,
    degreeIndex,
    listIndex,
    requirementIndex,
  } = props;
  let RequirementType;
  if (requirement.type === "header") {
    RequirementType = HeaderRequirement;
  } else if (requirement.type === "comment") {
    RequirementType = CommentRequirement;
  } else if (requirement.type === "single") {
    RequirementType = CourseRequirement;
  } else if (requirement.type === "series") {
    RequirementType = CourseRequirement;
  } else if (requirement.type === "or") {
    RequirementType = OrRequirement;
  } else if (requirement.type === "section") {
    RequirementType = SectionRequirement;
  }
  return (
    <Fragment>
      <RequirementType
        requirement={requirement}
        setSectionOpen={setSectionOpen}
        degreeIndex={degreeIndex}
        listIndex={listIndex}
        requirementIndex={requirementIndex}
      />
    </Fragment>
  );
}

export default Requirement;
