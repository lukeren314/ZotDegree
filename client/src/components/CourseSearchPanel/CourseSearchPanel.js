import { Button } from "@material-ui/core";
import DepartmentSearchBar from "./DepartmentSearchBar";
import CourseNumberSearchField from "./CourseNumberSearchField";
import GECategoriesSearchBar from "./GECategoriesSearchBar";
import CourseSearchList from "./CourseSearchList";
import departmentsList from "../../json/course_departments_list.json";
import { withStyles } from "@material-ui/styles";
import { PureComponent } from "react";

const styles = () => ({
  courseSearchButton: {
    width: "100%",
    backgroundColor: "primary",
    marginTop: "20px",
  },
});

class CourseSearchPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.setDepartment = (_, newDepartment) => {
      this.setState({ department: newDepartment });
    };

    this.setCourseNumber = (event) => {
      this.setState({ courseNumber: event.target.value });
    };

    this.setGECategories = (_, newGECategories) => {
      this.setState({ geCategories: newGECategories });
    };

    this.doSearchCourse = (searchCourses, openAlert) => {
      const { department, courseNumber, geCategories } = this.state;
      if (department.value === "ALL" && geCategories.length === 0) {
        openAlert("You must specify a department or GE Categories!");
        return;
      }

      if (!courseNumber.match(/^([0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?)?$/g)) {
        openAlert("Course number/range invalid!");
        return;
      }
      const query = {
        department: department.value,
        courseNumber,
        geCategories,
      };
      searchCourses(query);
    };

    this.state = {
      department: departmentsList[0],
      courseNumber: "",
      geCategories: [],
    };
  }
  render() {
    const {
      classes,
      openAlert,
      searchCourses,
      courseSearchList,
      isLoading,
    } = this.props;
    const { department, courseNumber, geCategories } = this.state;
    return (
      <div>
        {/* Replace with single search bar? */}
        <DepartmentSearchBar
          department={department}
          setDepartment={this.setDepartment}
        />
        <CourseNumberSearchField
          courseNumber={courseNumber}
          setCourseNumber={this.setCourseNumber}
        />
        <GECategoriesSearchBar
          geCategories={geCategories}
          setGECategories={this.setGECategories}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.courseSearchButton}
          onClick={() => this.doSearchCourse(searchCourses, openAlert)}
        >
          Search
        </Button>
        <CourseSearchList courseList={courseSearchList} isLoading={isLoading} />
      </div>
    );
  }
}
export default withStyles(styles)(CourseSearchPanel);
