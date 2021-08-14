import { Fragment } from "react";
import CommentRequirement from "./CommentRequirement";
import HeaderRequirement from "./HeaderRequirement";
import OrRequirement from "./OrRequirement";
import CourseRequirement from "./CourseRequirement";
import SectionRequirement from "./SectionRequirement";
import SeriesRequirement from "./SeriesRequirement";
import GERequirement from "./GERequirement";

function Requirement(props) {
  const { requirement } = props;
  let RequirementType;
  if (requirement.type === "header") {
    RequirementType = HeaderRequirement;
  } else if (requirement.type === "comment") {
    RequirementType = CommentRequirement;
  } else if (requirement.type === "single") {
    RequirementType = CourseRequirement;
  } else if (requirement.type === "series") {
    RequirementType = SeriesRequirement;
  } else if (requirement.type === "or") {
    RequirementType = OrRequirement;
  } else if (requirement.type === "section") {
    RequirementType = SectionRequirement;
  } else if (requirement.type === "ge") {
    RequirementType = GERequirement;
  }
  return (
    <Fragment>
      <RequirementType requirement={requirement} />
    </Fragment>
  );
}

export default Requirement;
