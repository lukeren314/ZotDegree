import { Fragment } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@material-ui/core";
import CourseDroppable from "../../CourseDragAndDrop/CourseDroppable";
import RequirementsContext from "../../../contexts/RequirementsContext";

function CourseRequirementItem(props) {
  const { requirement } = props;
  return (
    <Fragment>
      <RequirementsContext.Consumer>
        {({ loadedCourses, loadCourse }) =>
          requirement.courses.map((course, index) => (
            <ListItem
              key={course}
              button={!requirement.checked[index]}
              onClick={() => loadCourse(course)}
            >
              {requirement.checked[index] || !(course in loadedCourses) ? (
                <ListItemText
                  primary={course}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              ) : (
                <CourseDroppable
                  droppableId={"req" + course}
                  courses={[loadedCourses[course]]}
                  itemWidth="12vw"
                />
              )}
              <ListItemSecondaryAction>
                <Checkbox checked={requirement.checked[index]} />
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </RequirementsContext.Consumer>
    </Fragment>
  );
}

export default CourseRequirementItem;
