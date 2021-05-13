import { Fade, CircularProgress } from "@material-ui/core";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";

function CourseSearchList(props) {
  const { courseList, isLoading } = props;
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
  return (
    <CourseDroppable
      droppableId="course-search"
      courses={courseList}
      tableForm={true}
    />
  );
}

export default CourseSearchList;
