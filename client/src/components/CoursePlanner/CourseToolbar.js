import {
  Paper,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { DEFAULT_START_YEAR } from "./util";
const YEARS_BEFORE = 10;
const YEARS_AFTER = 10;
const years = [...Array(YEARS_BEFORE + YEARS_AFTER + 1).keys()].map(
  (i) => i + DEFAULT_START_YEAR - YEARS_BEFORE
);

function CourseToolbar(props) {
  const { startYear, setStartYear, numYears, setNumYears } = props;
  return (
    <Paper
      style={{
        marginBottom: "8px",
      }}
    >
      <Toolbar>
        <Typography style={{ marginRight: "5vw" }}>Course Plan</Typography>
        <Typography style={{ marginRight: "5px" }}>Start Year: </Typography>
        <Select
          value={startYear}
          onChange={setStartYear}
          style={{ marginRight: "5vw" }}
        >
          {years.map((year) => {
            return (
              <MenuItem value={year} key={"toolbaryears" + year}>
                {year}
              </MenuItem>
            );
          })}
        </Select>
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
