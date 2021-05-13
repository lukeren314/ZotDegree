import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import geCategoriesList from "../../json/ge_categories.json";

function GECategoriesSearchBar(props) {
  const { geCategories, setGECategories } = props;
  return (
    <div>
      <Autocomplete
        multiple
        value={geCategories}
        options={geCategoriesList}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        onChange={setGECategories}
        renderInput={(params) => (
          <TextField {...params} label="GE Categories" />
        )}
      />
    </div>
  );
}

export default GECategoriesSearchBar;
