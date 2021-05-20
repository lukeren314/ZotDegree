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
        {({
          loadedRequirements,
          loadCourse,
          highlightCourse,
          stopHighlightCourse,
        }) => (
          <ListItem
            dense={true}
            button={true}
            onClick={() =>
              !(requirement.id in loadedRequirements) &&
              loadCourse(requirement.id, requirement.course)
            }
            onMouseEnter={() =>
              requirement.checked && highlightCourse(requirement.course)
            }
            onMouseLeave={() =>
              requirement.checked && stopHighlightCourse(requirement.course)
            }
          >
            {requirement.checked || !(requirement.id in loadedRequirements) ? (
              <ListItemText
                primary={requirement.course}
                primaryTypographyProps={{ variant: "body2" }}
              />
            ) : (
              <CourseDroppable
                droppableId={"req" + requirement.id}
                courses={[loadedRequirements[requirement.id]]}
                itemWidth="12vw"
              />
            )}
            <ListItemSecondaryAction>
              <Checkbox checked={requirement.checked} />
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </RequirementsContext.Consumer>
    </Fragment>
  );
}

export default CourseRequirementItem;
