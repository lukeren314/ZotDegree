import { Typography, Select, MenuItem } from "@material-ui/core";


function NumYearsSelect(props) {
  const { numYears, setNumYears } = props;
  return (
    <div>
      <Typography display="inline" style={{ marginRight: "5px" }}># Years:</Typography>
      <Select
        value={numYears}
        onChange={(event) => setNumYears(event.target.value)}
      >
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
      </Select>
    </div>
  );
}

export default NumYearsSelect;
