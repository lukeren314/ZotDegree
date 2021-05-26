import { Typography } from "@material-ui/core";
import { calculateTotalUnits, getUnitsStr } from "../../util/courseLogic";

function TotalUnitsCount(props) {
  const { coursePlan } = props;
  const units = calculateTotalUnits(coursePlan.map((course) => course.content));
  return <Typography>Total: {getUnitsStr(units)} Units</Typography>;
}

export default TotalUnitsCount;
