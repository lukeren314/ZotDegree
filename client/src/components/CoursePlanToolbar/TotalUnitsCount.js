import { Typography } from "@material-ui/core";
import { calculateTotalUnits, getUnitsStr } from "../CoursePlanner/courseLogic";

function TotalUnitsCount(props) {
  const { courses } = props;
  const units = calculateTotalUnits(courses.map((course) => course.content));
  return <Typography>Total: {getUnitsStr(units)} Units</Typography>;
}

export default TotalUnitsCount;
