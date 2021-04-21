import { Droppable } from "react-beautiful-dnd";
import CourseDraggable from "./CourseDraggable";

const grid = 4;

const getListStyle = (isDraggingOver, backgroundColor) => {
  return {
    background: isDraggingOver ? "lightblue" : backgroundColor,
    padding: grid,
  };
};

function CourseDroppable(props) {
  const {
    droppableId,
    courses,
    backgroundColor,
    isDeletable,
    deleteCourse,
  } = props;
  return (
    <Droppable droppableId={droppableId} style={{ maxWidth: "100%" }}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver, backgroundColor)}
        >
          {courses.map((course, index) => (
            <CourseDraggable
              key={course.id}
              course={course}
              index={index}
              isDeletable={isDeletable}
              deleteCourse={deleteCourse}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default CourseDroppable;
