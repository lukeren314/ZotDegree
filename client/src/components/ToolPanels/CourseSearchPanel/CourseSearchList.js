import { Grid, Fade, CircularProgress } from "@material-ui/core";
import CourseDroppable from "../../CourseDragAndDrop/CourseDroppable";

function CourseSearchList(props) {
  const { courseList, isLoading } = props;
  let content = courseSearchContent(courseList, isLoading);
  return <div>{content}</div>;
}

function courseSearchContent(courseList, isLoading) {
  if (isLoading) {
    return (
      <Fade
        in={isLoading}
        style={{
          transitionDelay: isLoading ? "80ms" : "0ms",
        }}
        unmountOnExit
      >
        <CircularProgress />
      </Fade>
    );
  }
  if (courseList !== null) {
    if (courseList.length === 0) {
      return <h2 style={{ textAlign: "center" }}>No Classes Found!</h2>;
    } else {
      // include info on the right?
      return (
        <Grid item xs={3} s={3} md={3} lg={3} xl={3}>
          <CourseDroppable droppableId="course-search" courses={courseList} />
        </Grid>
      );
    }
  }
}

export default CourseSearchList;
