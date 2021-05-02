import { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import CourseToolbar from "./CourseToolbar";
import CoursePlan from "../CoursePlan/CoursePlan";
import ToolPanels from "../ToolPanels/ToolPanels";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableIdManager from "./DraggableIdManager";
import {
  copyTo,
  removeFrom,
  move,
  DEFAULT_YEARS,
  DEFAULT_START_YEAR,
} from "./courseLogic";
import { searchCourses } from "../../api.js";

const MAX_COURSE_LIMIT = 100;

class CoursePlanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addedCourses: [],
      courseSearchList: null,
      numYears: DEFAULT_YEARS,
      startYear: DEFAULT_START_YEAR,
      isLoadingCourseSearch: false,
    };

    this.idManager = new DraggableIdManager();


    this.onDragEnd = this.onDragEnd.bind(this);
    this.dragLogic = this.dragLogic.bind(this);
    this.maybeAddCourse = this.maybeAddCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
    this.moveCourse = this.moveCourse.bind(this);
    this.getCourseDroppables = this.getCourseDroppables.bind(this);
    this.searchCourses = this.searchCourses.bind(this);
    this.setNumYears = this.setNumYears.bind(this);
    this.setStartYear = this.setStartYear.bind(this);
    this.removeCourseById = this.removeCourseById.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
  }
  setNumYears(event) {
    this.setState({ numYears: event.target.value });
  }
  setStartYear(event) {
    this.setState({ startYear: event.target.value });
  }
  getCourseDroppables(courses) {
    return courses.map((course) => {
      return {
        id: this.idManager.getNextId(),
        content: course,
      };
    });
  }
  findCourseById(courseId) {
    for (let i = 0; i < this.state.addedCourses.length; ++i) {
      if (this.state.addedCourses[i].content.id === courseId) {
        return i;
      }
    }
    return -1;
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
    const newCourses = this.dragLogic(
      source,
      destination,
    );
    this.setState({ addedCourses: newCourses });
  }
  dragLogic(source, destination){
    if (source.droppableId === "course-search") {
      return this.maybeAddCourse(source, destination);
    }
    if (destination.droppableId === "course-search") {
      return this.removeCourse(source);
    }
    return this.moveCourse(source, destination);
  }
  maybeAddCourse(source, destination) {
    if (this.findCourseById(this.state.courseSearchList[source.index].content.id) !== -1) {
      this.props.openAlert("This class was already added!", "error");
      return this.state.addedCourses;
    }
    const newCourses = copyTo(
      this.state.courseSearchList,
      this.state.addedCourses,
      source,
      destination,
      this.idManager.getNextId()
    );
    if (newCourses.length > MAX_COURSE_LIMIT) {
      this.props.openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
      return this.state.addedCourses;
    }
    return newCourses;
  }
  removeCourse(source) {
    return removeFrom(this.state.addedCourses, source);
  }
  moveCourse(source, destination) {
    const newCourses = move(this.state.addedCourses, source, destination);
    if (this.state.addedCourses === newCourses) {
      this.props.openAlert("Classes are sorted alphabetically!");
    }
    return newCourses;
  }
  removeCourseById(courseId) {
    let findIndex = this.findCourseById(courseId);
    if (findIndex === -1) {
      return;
    }
    this.removeCourse(findIndex);
  }
  getCourses() {
    return this.state.addedCourses;
  }
  async searchCourses(query) {
    try {
      this.startLoading(async () => {
        const jsonData = await searchCourses(query);
        this.stopLoading();
        if (jsonData === null || "error" in jsonData) {
          this.props.openAlert("Course Search Failed! ", "error");
          return;
        }
        const courseSearchList = this.getCourseDroppables(jsonData);
        this.setState({ courseSearchList: courseSearchList });
      });
    } catch (error) {
      this.props.openAlert("Course Search Failed! ", "error");
    }
  }
  startLoading(callback) {
    this.setState({ isLoadingCourseSearch: true }, callback);
  }
  stopLoading() {
    this.setState({ isLoadingCourseSearch: false });
  }
  render() {
    const {
      numYears,
      startYear,
      addedCourses,
      courseSearchList,
      isLoadingCourseSearch,
    } = this.state;

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
              coursePlan={addedCourses}
              removeCourseById={this.removeCourseById}
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
              openAlert={this.props.openAlert}
              isLoadingCourseSearch={isLoadingCourseSearch}
            />
          </Grid>
        </Grid>
      </DragDropContext>
    );
  }
}

export default CoursePlanner;
