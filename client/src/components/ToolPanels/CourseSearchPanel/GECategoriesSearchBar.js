import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

function GECategoriesSearchBar(props) {
  const { geCategory, geCategoriesList, setGECategory } = props;
  return (
    <div>
      <Autocomplete
        value={geCategory}
        options={geCategoriesList}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        onChange={setGECategory}
        renderInput={(params) => <TextField {...params} label="GE Category" />}
      />
    </div>
  );
}

export default GECategoriesSearchBar;
