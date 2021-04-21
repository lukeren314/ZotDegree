import {
  Paper,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";

function CourseToolbar(props) {
  const { numYears, setNumYears } = props;
  return (
    <Paper
      style={{
        marginBottom: "8px",
      }}
    >
      <Toolbar>
        <Typography style={{ marginRight: "5vw" }}>Course Plan</Typography>
        <Typography style={{ marginRight: "5px" }}># Years:</Typography>
        <Select value={numYears} onChange={setNumYears}>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </Toolbar>
    </Paper>
  );
}
export default CourseToolbar;
