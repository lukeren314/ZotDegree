import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import degreesList from "../../json/degrees_list.json";

function DegreeSearchBar(props) {
  const { degrees, setDegrees } = props;
  return (
    <div>
      <Autocomplete
        multiple
        value={degrees}
        options={degreesList}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        onChange={(_, degrees) => setDegrees(degrees)}
        renderInput={(params) => <TextField {...params} label="Degrees" />}
      />
    </div>
  );
}

export default DegreeSearchBar;
