import { Button } from "@material-ui/core";
import DepartmentSearchBar from "./DepartmentSearchBar";
import CourseNumberSearchField from "./CourseNumberSearchField";
import GECategoriesSearchBar from "./GECategoriesSearchBar";
import CourseSearchList from "./CourseSearchList";
import departmentsList from "../../json/course_departments_list.json";
import { withStyles } from "@material-ui/styles";
import { PureComponent } from "react";
import { fetchSearchListIfNeeded, openAlert } from "../../actions";
import { connect } from "react-redux";

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

    this.doSearchCourse = () => {
      const { department, courseNumber, geCategories } = this.state;
      const { dispatch } = this.props;
      const departmentValue = (department) ? department.value : "ALL";
      if (departmentValue === "ALL" && geCategories.length === 0) {
        dispatch(openAlert("You must specify a department or GE Categories!"));
        return;
      }

      if (!courseNumber.match(/^([0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?)?$/g)) {
        dispatch(openAlert("Course number/range invalid!", "error"));
        return;
      }
      const geCategoryValues = geCategories.map((ge) => ge.value);
      const query = {
        department:departmentValue,
        courseNumber,
        geCategories: geCategoryValues,
      };
      dispatch(fetchSearchListIfNeeded(query));
    };

    this.state = {
      department: departmentsList[0],
      courseNumber: "",
      geCategories: [],
    };
  }
  render() {
    const { searchList, isFetching, classes } = this.props;
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
          onClick={() => this.doSearchCourse()}
        >
          Search
        </Button>
        <CourseSearchList searchList={searchList} isLoading={isFetching} />
      </div>
    );
  }
}

const mapStateToProps = (state) => state.courseSearch;

export default connect(mapStateToProps)(withStyles(styles)(CourseSearchPanel));
