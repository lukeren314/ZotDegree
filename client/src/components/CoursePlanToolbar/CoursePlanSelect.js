import { Typography, Select, MenuItem } from "@material-ui/core";

function CoursePlanSelect(props) {
  const { currentCoursePlan, setCurrentCoursePlan } = props;
  return (
    <div>
      <Typography display="inline" style={{ marginRight: "5px" }}>Plan #:</Typography>
      <Select
        value={currentCoursePlan}
        onChange={(event) => setCurrentCoursePlan(event.target.value)}
      >
        <MenuItem value={0}>1</MenuItem>
        <MenuItem value={1}>2</MenuItem>
        <MenuItem value={2}>3</MenuItem>
      </Select>
    </div>
  );
}

export default CoursePlanSelect;
