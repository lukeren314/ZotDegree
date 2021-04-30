import { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import CourseToolbar from "./CourseToolbar";
import CoursePlan from "../CoursePlan/CoursePlan";
import ToolPanels from "../ToolPanels/ToolPanels";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableIdManager from "./DraggableIdManager";
import {
  dragLogic,
  findCourseById,
  removeCourseFromQuarter,
  newYearPlans,
  DEFAULT_YEARS,
  DEFAULT_START_YEAR,
} from "./courseLogic";
import { searchCourses } from "../../api.js";

class CoursePlanner extends PureComponent {
  constructor(props) {
    super(props);
    let initialYearPlans = newYearPlans();
    this.state = {
      yearPlans: initialYearPlans,
      courseSearchList: null,
      numYears: DEFAULT_YEARS,
      startYear: DEFAULT_START_YEAR,
      isLoadingCourseSearch: false,
    };

    this.draggableIdManager = new DraggableIdManager();
    this.onDragEnd = this.onDragEnd.bind(this);
    this.addCourses = this.addCourses.bind(this);
    this.getCourseDroppables = this.getCourseDroppables.bind(this);
    this.searchCourses = this.searchCourses.bind(this);
    this.setNumYears = this.setNumYears.bind(this);
    this.setStartYear = this.setStartYear.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
  }
  setNumYears(event) {
    this.setState({ numYears: event.target.value });
  }
  setStartYear(event) {
    this.setState({ startYear: event.target.value });
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
        content: course,
      };
    });
  }
  onDragEnd(result) {
    const { source, destination } = result;
    const newYearPlans = dragLogic(
      this.state.yearPlans,
      this.state.courseSearchList,
      source,
      destination,
      this.props.openAlert,
      this.draggableIdManager
    );
    this.setState({ yearPlans: newYearPlans });
  }
  deleteCourse(courseId, index) {
    let find = findCourseById(this.state.yearPlans, courseId);
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
  async searchCourses(query) {
    try {
      this.startLoading(async () => {
        const jsonData = await searchCourses(query);
        this.stopLoading();
        if (jsonData == null || "error" in jsonData) {
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
      yearPlans,
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
