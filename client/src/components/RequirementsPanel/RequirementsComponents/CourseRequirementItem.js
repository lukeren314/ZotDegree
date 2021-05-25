import { Fragment } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
  Tooltip,
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
          checkedRequirements,
          checkRequirement,
        }) => (
          <Tooltip title="Click me to add class">
            <ListItem
              dense={true}
              button={
                requirement.checked || !(requirement.id in loadedRequirements)
              }
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
              {requirement.checked ||
              !(requirement.id in loadedRequirements) ? (
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
                <FormControlLabel
                  control={<Checkbox checked={requirement.checked} />}
                  label="Satisfied"
                  labelPlacement="start"
                />
                <Tooltip title="Satisfied by approved AP test or Community College credit">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedRequirements.includes(
                          requirement.course
                        )}
                        onClick={() => checkRequirement(requirement.course)}
                      />
                    }
                    label="AP/CC"
                    labelPlacement="start"
                  />
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </Tooltip>
        )}
      </RequirementsContext.Consumer>
    </Fragment>
  );
}

export default CourseRequirementItem;
