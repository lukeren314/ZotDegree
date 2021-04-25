import { PureComponent, Fragment } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import ClearIcon from "@material-ui/icons/Clear";
import CoursePopover from "./CoursePopover";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  listItemSecondaryAction: {
    visibility: "hidden",
  },
  listItem: {
    "&:hover $listItemSecondaryAction": {
      visibility: "inherit",
    },
  },
});

const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 0,
    margin: `0 0 ${4}px 0`,
    // width: "9vw",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#0064a4",
    color: "white",

    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

class CourseDraggable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.setState({ selected: null });
  }
  render() {
    const { course, index, isDeletable, deleteCourse, classes } = this.props;
    return (
      <Draggable key={course.id} draggableId={course.id} index={index}>
        {(provided, snapshot) => (
          <Fragment>
            <Paper
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
              variant="outlined"
              onClick={(event) =>
                this.setState({ selected: event.currentTarget })
              }
            >
              <List disablePadding={true}>
                <ListItem
                  dense={true}
                  classes={{ container: classes.listItem }}
                  selected={Boolean(this.state.selected)}
                >
                  <ListItemText
                    primary={course.content.id}
                    secondary={(course.content.units || 0) + " Units"}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color: "white",
                    }}
                  />
                  <ListItemSecondaryAction
                    className={classes.listItemSecondaryAction}
                  >
                    {isDeletable && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          deleteCourse(course.content, index);
                        }}
                      >
                        <ClearIcon
                          fontSize="small"
                          style={{ color: "white" }}
                        />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
            <CoursePopover
              anchorEl={this.state.selected}
              handleClose={this.handleClose}
              course={course.content}
            />
          </Fragment>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles)(CourseDraggable);
