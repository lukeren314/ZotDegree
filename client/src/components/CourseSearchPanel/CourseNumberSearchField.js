import { TextField } from "@material-ui/core";

function CourseNumberSearchField(props) {
  const { courseNumber, setCourseNumber } = props;
  return (
    <div>
      <TextField
        label="Course Number"
        type="search"
        value={courseNumber}
        onChange={setCourseNumber}
        helperText="ex. 132A or 100-200"
      />
    </div>
  );
}

export default CourseNumberSearchField;
