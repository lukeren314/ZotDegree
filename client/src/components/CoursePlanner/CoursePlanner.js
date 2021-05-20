import { Grid } from "@material-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import { copyTo, removeFrom, move, copyItemTo } from "./courseLogic";
import idManager from "./DraggableIdManager";
import { withStyles } from "@material-ui/styles";

const MAX_COURSE_LIMIT = 100;

const styles = () => ({
  containerGrid: { },
});

const onDragEnd = (
  result,
  courses,
  courseSearchList,
  setCourses,
  openAlert,
  loadedRequirements
) => {
  const { source, destination } = result;
  if (
    !destination ||
    destination.droppableId.startsWith("req") ||
    (source.droppableId === "course-search" &&
      destination.droppableId === "course-search")
  ) {
    return;
  }
  if (source.droppableId.startsWith("req")) {
    const newCourses = maybeAddCourseRequirement(
      source,
      destination,
      courses,
      loadedRequirements,
      openAlert
    );
    setCourses(newCourses);
    return;
  }
  const newCourses = dragLogic(
    source,
    destination,
    courses,
    courseSearchList,
    openAlert
  );
  setCourses(newCourses);
};

const maybeAddCourseRequirement = (
  source,
  destination,
  courses,
  loadedRequirements,
  openAlert
) => {
  const requirementId = source.droppableId.substr("req".length);
  const newCourse = loadedRequirements[requirementId];
  if (findCourseById(newCourse.content.id, courses) !== -1) {
    openAlert("This class was already added!", "error");
    return courses;
  }
  const newCourses = copyItemTo(courses, destination, newCourse, newCourse.id);
  if (newCourses.length > MAX_COURSE_LIMIT) {
    openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
    return courses;
  }
  return newCourses;
};

const dragLogic = (
  source,
  destination,
  courses,
  courseSearchList,
  openAlert
) => {
  if (source.droppableId === "course-search") {
    return maybeAddCourse(
      source,
      destination,
      courses,
      courseSearchList,
      openAlert
    );
  }
  if (destination.droppableId === "course-search") {
    return removeCourse(source, courses);
  }
  return moveCourse(source, destination, courses, openAlert);
};

const maybeAddCourse = (
  source,
  destination,
  courses,
  courseSearchList,
  openAlert
) => {
  if (
    findCourseById(courseSearchList[source.index].content.id, courses) !== -1
  ) {
    openAlert("This class was already added!", "error");
    return courses;
  }
  const newCourses = copyTo(
    courseSearchList,
    courses,
    source,
    destination,
    idManager.getNextId()
  );
  if (newCourses.length > MAX_COURSE_LIMIT) {
    openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
    return courses;
  }
  return newCourses;
};

const removeCourse = (source, courses) => {
  return removeFrom(courses, source);
};

const moveCourse = (source, destination, courses, openAlert) => {
  const newCourses = move(courses, source, destination);
  if (courses === newCourses) {
    openAlert("Classes are sorted alphabetically.");
  }
  return newCourses;
};

const findCourseById = (courseId, courses) => {
  for (let i = 0; i < courses.length; ++i) {
    if (courses[i].content.id === courseId) {
      return i;
    }
  }
  return -1;
};

function CoursePlanner(props) {
  const {
    classes,
    openAlert,
    courses,
    setCourses,
    courseSearchList,
    loadedRequirements,
    children,
  } = props;
  const left = children[0];
  const right = children[1];
  return (
    <DragDropContext
      onDragEnd={(result) =>
        onDragEnd(
          result,
          courses,
          courseSearchList,
          setCourses,
          openAlert,
          loadedRequirements
        )
      }
    >
      <Grid container className={classes.containerGrid}>
        <Grid item xs={12} s={7} md={7} lg={7} xl={7}>
          {left}
        </Grid>
        <Grid item xs={12} s={5} md={5} lg={5} xl={5}>
          {right}
        </Grid>
      </Grid>
    </DragDropContext>
  );
}

export default withStyles(styles)(CoursePlanner);
