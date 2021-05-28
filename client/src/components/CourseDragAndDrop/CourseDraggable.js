import { PureComponent } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import CoursePopover from "./CoursePopover";
import { withStyles } from "@material-ui/styles";
import CourseDeleteButton from "./CourseDeleteButton";
import { getUnitsStr } from "../../util/courseLogic";
import { connect } from "react-redux";
import {
  highlightCourse,
  removeCourse,
  unhighlightCourse,
} from "../../actions";

const styles = () => ({
  listItemSecondaryAction: {
    visibility: "hidden",
  },
  courseBody: {
    "&:hover $listItemSecondaryAction": {
      visibility: "inherit",
    },
  },
});

const getItemStyle = (isDragging, draggableStyle, itemWidth, isHighlighted) => {
  return {
    userSelect: "none",
    padding: 0,
    margin: `0 0 ${4}px 0`,
    background: isHighlighted
      ? "#2CA5AE"
      : isDragging
      ? "lightgreen"
      : "#0064a4",
    width: itemWidth,
    ...draggableStyle,
  };
};

class CourseDraggable extends PureComponent {
  constructor(props) {
    super(props);

    this.highlightRelatedCourses = () => {
      const { prerequisite_list, corequisite } = this.props.course.content;
      prerequisite_list.map((prerequisite) =>
        this.props.dispatch(highlightCourse(prerequisite))
      );
      if (corequisite) this.props.dispatch(highlightCourse(corequisite));
    };

    this.unhighlightRelatedCourses = () => {
      const { prerequisite_list, corequisite } = this.props.course.content;
      prerequisite_list.map((prerequisite) =>
        this.props.dispatch(unhighlightCourse(prerequisite))
      );
      if (corequisite) this.props.dispatch(unhighlightCourse(corequisite));
    };

    this.setSelected = (event) => {
      this.setState({ selected: event.currentTarget });
    };

    this.handleClose = () => {
      this.setState({ selected: null });
    };

    this.handleHovering = () => {
      this.highlightRelatedCourses();
      this.setState({ isHovering: true });
    };

    this.handleHoveringOut = () => {
      this.unhighlightRelatedCourses();
      this.setState({ isHovering: false });
    };

    this.state = {
      selected: null,
      isHovering: false,
    };
  }
  render() {
    const {
      course,
      index,
      isDeletable,
      isAddedCourse,
      itemWidth,
      dispatch,
      highlightedCourses,
      deleteAction,
      classes,
    } = this.props;
    const { selected, isHovering } = this.state;
    let tooltipStr = "";
    if (course.content.prerequisite_list.length > 0) {
      tooltipStr += "Prerequisites: "+course.content.prerequisite_list.join(", ")+"    ";
    }
    if (course.content.corequisite.length > 0) {
      tooltipStr += "Corequisite: "+course.content.corequisite;
    }
    return (
      <Draggable key={course.id} draggableId={course.id} index={index}>
        {(provided, snapshot) => (
          <div>
            <Tooltip title={tooltipStr}>
              <Paper
                className={classes.courseBody}
                variant="outlined"
                onClick={this.setSelected}
                onMouseEnter={this.handleHovering}
                onMouseLeave={this.handleHoveringOut}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                  itemWidth,
                  isAddedCourse &&
                    highlightedCourses.includes(course.content.id)
                )}
              >
                <List disablePadding={true}>
                  <ListItem dense={true} selected={Boolean(selected)}>
                    <ListItemText
                      primary={course.content.id}
                      primaryTypographyProps={{
                        color: snapshot.isDragging ? "primary" : "secondary",
                      }}
                      secondary={
                        isHovering && isDeletable
                          ? getUnitsStr(course.content.units) + " Units"
                          : null
                      }
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "secondary",
                      }}
                    />
                    <ListItemSecondaryAction
                      className={classes.listItemSecondaryAction}
                    >
                      {isDeletable && (
                        <CourseDeleteButton
                          courseId={course.content.id}
                          removeCourseById={(courseId) =>
                            dispatch((deleteAction || removeCourse)(courseId))
                          }
                        />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Tooltip>
            <CoursePopover
              anchorEl={selected}
              handleClose={this.handleClose}
              course={course.content}
              PaperProps={{
                onMouseEnter: this.handleHovering,
                onMouseLeave: this.handleHoveringOut,
              }}
            />
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state) => state.coursePlans;

export default connect(mapStateToProps)(withStyles(styles)(CourseDraggable));
