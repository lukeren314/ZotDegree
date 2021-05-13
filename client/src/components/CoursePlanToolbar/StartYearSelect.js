import { Typography, Select, MenuItem } from "@material-ui/core";

const YEARS_BEFORE = 10;
const YEARS_AFTER = 10;
const years = [...Array(YEARS_BEFORE + YEARS_AFTER + 1).keys()].map(
  (i) => i + new Date().getFullYear() - YEARS_BEFORE
);

function StartYearSelect(props) {
  const { startYear, setStartYear } = props;
  return (
    <div>
      <Typography display="inline" style={{ marginRight: "5px" }}>Start Year: </Typography>
      <Select
        value={startYear}
        onChange={(event) => setStartYear(event.target.value)}
      >
        {years.map((year) => {
          return (
            <MenuItem value={year} key={"toolbaryears" + year}>
              {year}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

export default StartYearSelect;
