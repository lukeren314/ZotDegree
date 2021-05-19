import LoadingWheel from "../App/LoadingWheel";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";

function CourseSearchList(props) {
  const { courseList, isLoading } = props;
  if (isLoading) {
    return (
      <LoadingWheel isLoading={isLoading}/>
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
