import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Fragment } from "react";
import { Droppable } from "react-beautiful-dnd";
import CourseDraggable from "./CourseDraggable";
import { withStyles } from "@material-ui/styles";

const grid = 4;

const styles = () => ({
  root: { maxWidth: "100%" },
});

const getListStyle = (isDraggingOver, backgroundColor) => {
  return {
    background: isDraggingOver ? "lightblue" : backgroundColor,
    padding: grid,
  };
};

function Row(props) {
  const { course, courseDraggable } = props;
  return (
    <Fragment>
      <TableRow>
        <TableCell scope="row">{courseDraggable}</TableCell>
        <TableCell>{course.name}</TableCell>
        <TableCell>{course.ge_categories.join(", ") || "N/A"}</TableCell>
        <TableCell align="right">{course.units}</TableCell>
      </TableRow>
    </Fragment>
  );
}

function TableHeader() {
  return (
    <Fragment>
      <colgroup>
        <col style={{ width: "40%" }} />
        <col style={{ width: "40%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "5%" }} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Course</TableCell>
          <TableCell>Course Name</TableCell>
          <TableCell>GE Categories</TableCell>
          <TableCell align="right">Units</TableCell>
        </TableRow>
      </TableHead>
    </Fragment>
  );
}

function CourseDroppable(props) {
  const {
    droppableId,
    courses,
    backgroundColor,
    isDeletable,
    itemWidth,
    tableForm,
    classes,
  } = props;
  return (
    <Droppable droppableId={droppableId} className={classes.root}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver, backgroundColor)}
        >
          {tableForm ? (
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table" size="small">
                <TableHeader />
                <TableBody>
                  {courses.map((course, index) => (
                    <Row
                      course={course.content}
                      key={course.id}
                      courseDraggable={
                        <CourseDraggable
                          course={course}
                          index={index}
                          isDeletable={isDeletable}
                          itemWidth={itemWidth}
                        />
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            courses.map((course, index) => (
              <CourseDraggable
                key={course.id}
                course={course}
                index={index}
                isDeletable={isDeletable}
                itemWidth={itemWidth}
              />
            ))
          )}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default withStyles(styles)(CourseDroppable);
