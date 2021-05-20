import { PureComponent } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import CoursePopover from "./CoursePopover";
import { withStyles } from "@material-ui/styles";
import CourseDeleteButton from "./CourseDeleteButton";
import { getUnitsStr } from "../CoursePlanner/courseLogic";
import CoursePlanContext from "../../contexts/CoursePlanContext";

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
      ? "green"
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

    this.setSelected = (event) => {
      this.setState({ selected: event.currentTarget });
    };

    this.handleClose = () => {
      this.setState({ selected: null });
    };

    this.handleHovering = () => {
      this.setState({ isHovering: true });
    };

    this.handleHoveringOut = () => {
      this.setState({ isHovering: false });
    };

    this.state = {
      selected: null,
      isHovering: false,
    };
  }
  render() {
    const { course, index, isDeletable, itemWidth, classes } = this.props;
    const { selected, isHovering } = this.state;
    return (
      <Draggable key={course.id} draggableId={course.id} index={index}>
        {(provided, snapshot) => (
          <CoursePlanContext.Consumer>
            {({ removeCourseById, highlightedCourses }) => (
              <div>
                <Paper
                  className={classes.courseBody}
                  variant="outlined"
                  onClick={this.setSelected}
                  onMouseOver={this.handleHovering}
                  onMouseLeave={this.handleHoveringOut}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    itemWidth,
                    highlightedCourses.includes(course.content.id)
                  )}
                >
                  <List disablePadding={true}>
                    <ListItem dense={true} selected={Boolean(selected)}>
                      <ListItemText
                        primary={course.content.id}
                        primaryTypographyProps={{ color: "secondary" }}
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
                            removeCourseById={removeCourseById}
                          />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Paper>
                <CoursePopover
                  anchorEl={selected}
                  handleClose={this.handleClose}
                  course={course.content}
                />
              </div>
            )}
          </CoursePlanContext.Consumer>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles)(CourseDraggable);
