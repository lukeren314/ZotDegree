import { PureComponent, Fragment } from "react";
import { Paper, List, ListItem, ListItemText } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import CoursePopover from "./CoursePopover";
import { withStyles } from "@material-ui/styles";
import CourseDeleteButton from "./CourseDeleteButton";

const styles = () => ({
  listItemSecondaryAction: {
    visibility: "hidden",
  },
  listItem: {
    "&:hover $listItemSecondaryAction": {
      visibility: "inherit",
    },
  },
});

const getItemStyle = (isDragging, draggableStyle, itemWidth) => {
  return {
    userSelect: "none",
    padding: 0,
    margin: `0 0 ${4}px 0`,
    color: "white",
    background: isDragging ? "lightgreen" : "#0064a4",
    width: itemWidth,
    ...draggableStyle,
  };
};

class CourseDraggable extends PureComponent {
  constructor(props) {
    super(props);

    this.setSelected = (event) => {
      this.setState({selected: event.currentTarget})
    }

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
          <Fragment>
            <Paper
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                itemWidth
              )}
              variant="outlined"
              onClick={this.setSelected}
              onMouseOver={this.handleHovering}
              onMouseOut={this.handleHoveringOut}
            >
              <List disablePadding={true}>
                <ListItem
                  dense={true}
                  className={classes.listItem}
                  selected={Boolean(selected)}
                >
                  <ListItemText
                    primary={course.content.id}
                    secondary={(isHovering && isDeletable) ? ((course.content.units || 0) + " Units") : null}
                    secondaryTypographyProps={{
                      variant: "caption",
                      style: { color: "white" },
                    }}
                  />
                  <div className={classes.listItemSecondaryAction}>
                    <CourseDeleteButton
                      isDeletable={isDeletable}
                      courseId={course.content.id}
                    />
                  </div>
                </ListItem>
              </List>
            </Paper>
            <CoursePopover
              anchorEl={selected}
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
