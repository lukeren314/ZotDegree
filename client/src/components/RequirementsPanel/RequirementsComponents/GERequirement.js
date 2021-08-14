import { Fragment } from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
    highlightCourse,
    openAlert,
    unhighlightCourse,
} from "../../../actions";

function GERequirementItem(props) {
    const { requirement, dispatch } = props;

    const highlightCourses = () => {
        for (let courseId of requirement.satisfiedBy) {
            dispatch(highlightCourse(courseId));
        }
    }
    const unhighlightCourses = () => {
        for (let courseId of requirement.satisfiedBy) {
            dispatch(unhighlightCourse(courseId));
        }
    }

    return (
        <Fragment>
            <ListItem
                dense={true}
                button={true}
                onMouseEnter={highlightCourses}
                onMouseLeave={unhighlightCourses}
            >
                <ListItemText
                    primary={requirement.text}
                    primaryTypographyProps={{ variant: "body2" }}
                />
                <ListItemSecondaryAction>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={
                                    requirement.checked
                                }
                                onClick={() => {
                                    if (!requirement.checked) {
                                        dispatch(openAlert("Add Courses to Satisfy the Requirement!"))
                                    }
                                }}
                            />
                        }
                        label="Satisfied"
                        labelPlacement="start"
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </Fragment>
    );
}

const mapStateToProps = (state) => state.requirements;
export default connect(mapStateToProps)(GERequirementItem);
