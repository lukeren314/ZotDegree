import CourseDraggable from "./CourseDraggable";

function CourseDroppableBase(props) {
  const { courses, ...other } = props;
  return (
    <div>
      {courses.map((course, index) => (
        <CourseDraggable
          key={course.id}
          course={course}
          index={index}
          {...other}
        />
      ))}
    </div>
  );
}

export default CourseDroppableBase;
