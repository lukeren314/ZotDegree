import { Button } from "@material-ui/core";
import DepartmentSearchBar from "./DepartmentSearchBar";
import CourseNumberSearchField from "./CourseNumberSearchField";
import GECategoriesSearchBar from "./GECategoriesSearchBar";
import CourseSearchList from "./CourseSearchList";

function CourseSearchPanel(props) {
  const {
    departmentsList,
    department,
    setDepartment,
    courseNumber,
    setCourseNumber,
    geCategoriesList,
    geCategories,
    setGECategories,
    searchCourses,
    courseSearchList,
    isLoading,
  } = props;
  return (
    <div>
      {/* Replace with single search bar? */}
      <DepartmentSearchBar
        departmentsList={departmentsList}
        department={department}
        setDepartment={setDepartment}
      />
      <CourseNumberSearchField
        courseNumber={courseNumber}
        setCourseNumber={setCourseNumber}
      />
      <GECategoriesSearchBar
        geCategoriesList={geCategoriesList}
        geCategories={geCategories}
        setGECategories={setGECategories}
      />
      <Button
        variant="contained"
        color="primary"
        style={{
          width: "100%",
          backgroundColor: "primary",
          marginTop: "20px",
        }}
        onClick={searchCourses}
      >
        Search
      </Button>
      <CourseSearchList courseList={courseSearchList} isLoading={isLoading} />
    </div>
  );
}

export default CourseSearchPanel;
