import CourseDraggable from "./CourseDraggable";

function CourseDroppableBase(props) {
  const { courses, ...other } = props;
  const content = courses.length > 0 ? courses.map((course, index) => (
    <CourseDraggable
      key={course.id}
      course={course}
      index={index}
      {...other}
    />
  )) : <div>Drag Course Here</div>
  return (
    <div>
      {content}
    </div>
  );
}

export default CourseDroppableBase;
