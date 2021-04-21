import { Grid } from "@material-ui/core";
import CourseDroppable from "../../CourseDragAndDrop/CourseDroppable";

function CourseSearchList(props) {
  const { courseList } = props;
  let courses;
  if (courseList !== null) {
    if (courseList.length === 0) {
      courses = <h2 style={{ textAlign: "center" }}>No Classes Found!</h2>;
    } else {
      courses = (
        <CourseDroppable droppableId="course-search" courses={courseList} />
      );
    }
  }
  return (
    <Grid item xs={3} s={3} md={3} lg={3} xl={3}>
      {courses}
    </Grid>
  );
}

export default CourseSearchList;
