import CourseDraggable from "./CourseDraggable";

function CourseDroppableBase(props) {
  const { courses, isDeletable, itemWidth } = props;
  return (
    <div>
      {courses.map((course, index) => (
        <CourseDraggable
          key={course.id}
          course={course}
          index={index}
          isDeletable={isDeletable}
          itemWidth={itemWidth}
        />
      ))}
    </div>
  );
}

export default CourseDroppableBase;
