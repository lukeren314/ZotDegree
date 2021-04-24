import { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import CourseToolbar from "./CourseToolbar";
import CoursePlan from "../CoursePlan/CoursePlan";
import ToolPanels from "../ToolPanels/ToolPanels";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableIdManager from "./DraggableIdManager";
import {
  newYearPlans,
  addCourse,
  removeCourse,
  moveCourse,
  removeCourseFromQuarter,
  DEFAULT_YEARS,
  DEFAULT_START_YEAR,
} from "./util";

class CoursePlanner extends PureComponent {
  constructor(props) {
    super(props);
    let initialYearPlans = newYearPlans();
    this.state = {
      yearPlans: initialYearPlans,
      courseSearchList: null,
      numYears: DEFAULT_YEARS,
      startYear: DEFAULT_START_YEAR,
    };

    this.draggableIdManager = new DraggableIdManager();
    this.onDragEnd = this.onDragEnd.bind(this);
    this.addCourses = this.addCourses.bind(this);
    this.getCourseDroppables = this.getCourseDroppables.bind(this);
    this.searchCourses = this.searchCourses.bind(this);
    this.findCourseId = this.findCourseId.bind(this);
    this.setNumYears = this.setNumYears.bind(this);
    this.setStartYear = this.setStartYear.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
  }
  setNumYears(event) {
    this.setState({ numYears: event.target.value });
  }
  setStartYear(event) {
    this.setState({ startYear: event.target.value });
  }
  componentDidMount() {
    this.addCourses(0, "Fall", ["CS 121", "CS 171", "CS 178"]);
  }
  addCourses(year, quarter, courses) {
    let courseDroppableObjects = this.getCourseDroppables(courses);
    this.setState({
      yearPlans: {
        ...this.state.yearPlans,
        [year]: {
          ...this.state.yearPlans[year],
          [quarter]: courseDroppableObjects,
        },
      },
    });
  }
  getCourseDroppables(courses) {
    return courses.map((course) => {
      return {
        id: this.draggableIdManager.getNextId(),
        content: {
          id: course,
          department: "AC ENG",
          number: "20A",
          name: "Academic Writing",
          units: "5",
          prerequisite: "Placement into AC ENG 20A.",
          corequisite: "",
          prerequisite_tree: "",
          same_as: "",
          ge_cateogires: [],
        },
      };
    });
  }
  onDragEnd(result) {
    const { source, destination } = result;
    if (
      !destination ||
      (source.droppableId === "course-search" &&
        destination.droppableId === "course-search")
    ) {
      return;
    }
    let newYearPlans;
    if (source.droppableId === "course-search") {
      // don't add if it's already present
      let course = this.state.courseSearchList[source.index];
      if (this.findCourseId(course.content)) {
        this.props.openAlert("This class was already added!", "error");
        return;
      }
      // copy the course into the section
      newYearPlans = addCourse(
        this.state.courseSearchList,
        this.state.yearPlans,
        source,
        destination,
        this.draggableIdManager.getNextId()
      );
    } else if (destination.droppableId === "course-search") {
      // remove the droppable
      newYearPlans = removeCourse(this.state.yearPlans, source);
    } else {
      // move the course within the year plan
      newYearPlans = moveCourse(this.state.yearPlans, source, destination);
    }
    this.setState({ yearPlans: newYearPlans });
  }
  findCourseId(courseId) {
    for (let year in this.state.yearPlans) {
      for (let quarter in this.state.yearPlans[year]) {
        for (let course of this.state.yearPlans[year][quarter]) {
          if (course.content === courseId) {
            return [year, quarter];
          }
        }
      }
    }
    return null;
  }
  deleteCourse(courseId, index) {
    let find = this.findCourseId(courseId);
    if (!find) {
      return;
    }
    const [year, quarter] = find;
    let newYearPlans = removeCourseFromQuarter(
      this.state.yearPlans,
      year,
      quarter,
      index
    );
    this.setState({ yearPlans: newYearPlans });
  }
  getCourses() {
    let courses = [];
    for (let year in this.state.yearPlans) {
      for (let quarter in this.state.yearPlans[year]) {
        for (let course in this.state.yearPlans[year][quarter]) {
          courses.push(course);
        }
      }
    }
    return courses;
  }
  searchCourses(query) {
    let courseSearchList = this.getCourseDroppables([
      "CS 151",
      "ICS 53",
      "SOC 2",
      "ICS 6B",
      "ICS 6D",
      "ICS 10A",
      "CS 123",
      "CS 114",
      "CS 151345",
    ]);
    this.setState({
      courseSearchList: courseSearchList,
    });
  }
  render() {
    const { numYears, startYear, yearPlans, courseSearchList } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Grid container style={{ height: "85vh" }}>
          <Grid
            item
            xs={12}
            s={6}
            md={6}
            lg={6}
            xl={6}
            style={{ overflow: "auto", height: "100%" }}
          >
            <CourseToolbar
              numYears={numYears}
              setNumYears={this.setNumYears}
              startYear={startYear}
              setStartYear={this.setStartYear}
            />
            <CoursePlan
              coursePlan={yearPlans}
              deleteCourse={this.deleteCourse}
              startYear={startYear}
              numYears={numYears}
            />
          </Grid>
          <Grid
            item
            xs={12}
            s={6}
            md={6}
            lg={6}
            xl={6}
            style={{ overflow: "auto", height: "100%" }}
          >
            <ToolPanels
              courseSearchList={courseSearchList}
              searchCourses={this.searchCourses}
            />
          </Grid>
        </Grid>
      </DragDropContext>
    );
  }
}

export default CoursePlanner;