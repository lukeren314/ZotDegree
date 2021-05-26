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
import { getUnitsStr } from "../../util/courseLogic";
import CourseDraggable from "./CourseDraggable";

function Row(props) {
  const { course, courseDraggable } = props;
  return (
    <Fragment>
      <TableRow>
        <TableCell scope="row">{courseDraggable}</TableCell>
        <TableCell>{course.name}</TableCell>
        <TableCell>{course.ge_categories.join(", ") || "N/A"}</TableCell>
        <TableCell align="right">{getUnitsStr(course.units)}</TableCell>
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

function CourseDroppableTable(props) {
  const { courses, ...other } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHeader />
        <TableBody>
          {courses.map((course, index) => (
            <Row
              course={course.content}
              key={course.id}
              courseDraggable={
                <CourseDraggable course={course} index={index} {...other} />
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CourseDroppableTable;
