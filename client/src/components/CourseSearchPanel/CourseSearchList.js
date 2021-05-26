import LoadingWheel from "../App/LoadingWheel";
import CourseDroppable from "../CourseDragAndDrop/CourseDroppable";
import { COURSE_SEARCH_ID } from "../CoursePlanner/dragLogic";

function CourseSearchList(props) {
  const { searchList, isLoading } = props;
  if (isLoading) {
    return (
      <LoadingWheel isLoading={isLoading}/>
    );
  }
  return (
    <CourseDroppable
      droppableId={COURSE_SEARCH_ID}
      courses={searchList}
      tableForm={true}
    />
  );
}

export default CourseSearchList;
