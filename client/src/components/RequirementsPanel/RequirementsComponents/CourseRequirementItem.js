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
import { connect } from "react-redux";
import {
  checkRequirement,
  fetchCourseIfNeeded,
  highlightCourse,
  openAlert,
  unhighlightCourse,
  unloadCourse,
} from "../../../actions";
import { REQUIREMENTS_PREFIX } from "../../CoursePlanner/dragLogic";

function CourseRequirementItem(props) {
  const { requirement, loadedRequirements, checkedRequirements, dispatch } =
    props;
    const requirementSatisfied = requirement.checked ||
    checkedRequirements.includes(requirement.course);
  return (
    <Fragment>
      <ListItem
        dense={true}
        button={requirement.checked || !(requirement.id in loadedRequirements)}
        onClick={() =>
          !(requirement.id in loadedRequirements) &&
          dispatch(fetchCourseIfNeeded(requirement.id, requirement.course))
        }
        onMouseEnter={() =>
          requirement.checked && dispatch(highlightCourse(requirement.course))
        }
        onMouseLeave={() =>
          requirement.checked && dispatch(unhighlightCourse(requirement.course))
        }
      >
        {requirement.checked || !(requirement.id in loadedRequirements) ? (
          <Tooltip title={requirement.checked ? "" : "Click me to add class"}>
            <ListItemText
              primary={requirement.course}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </Tooltip>
        ) : (
          <CourseDroppable
            droppableId={REQUIREMENTS_PREFIX + requirement.id}
            courses={[loadedRequirements[requirement.id]]}
            itemWidth="12vw"
            isDeletable={true}
            deleteAction={unloadCourse}
          />
        )}
        <ListItemSecondaryAction>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  requirementSatisfied
                }
                onClick={() => {
                  if (!requirementSatisfied) {
                      dispatch(openAlert("Add the Course to Satisfy the Requirement!"))
                    }
                }}
              />
            }
            label="Satisfied"
            labelPlacement="start"
          />
          <Tooltip title="Satisfied by approved AP test or Community College credit">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedRequirements.includes(requirement.course)}
                  onClick={() => dispatch(checkRequirement(requirement.course))}
                />
              }
              label="AP/CC"
              labelPlacement="start"
            />
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    </Fragment>
  );
}

const mapStateToProps = (state) => state.requirements;
export default connect(mapStateToProps)(CourseRequirementItem);
