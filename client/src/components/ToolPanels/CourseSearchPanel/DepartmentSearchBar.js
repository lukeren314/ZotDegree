import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

function DepartmentSearchBar(props) {
  const { department, departmentsList, setDepartment } = props;
  return (
    <div>
      <Autocomplete
        value={department}
        options={departmentsList}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        onChange={setDepartment}
        renderInput={(params) => (
          <TextField {...params} label="Course Department" />
        )}
      />
    </div>
  );
}

export default DepartmentSearchBar;
