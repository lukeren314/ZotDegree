import { PureComponent, Fragment } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import {
  apiSearchCourses,
  apiGetRequirements,
  apiSaveUserData,
  apiLoadUserData,
  apiGetCourse,
} from "../../api/api.js";
import NavBar from "../NavBar/NavBar";
import CoursePlanner from "../CoursePlanner/CoursePlanner";
import CoursePlanContext from "../../contexts/CoursePlanContext";
import CoursePlanToolbar from "../CoursePlanToolbar/CoursePlanToolbar";
import CoursePlan from "../CoursePlan/CoursePlan";
import ToolPanels from "../ToolPanels/ToolPanels";
import RequirementsPanel from "../RequirementsPanel/RequirementsPanel";
import CourseSearchPanel from "../CourseSearchPanel/CourseSearchPanel";
import StartYearSelect from "../CoursePlanToolbar/StartYearSelect";
import NumYearsSelect from "../CoursePlanToolbar/NumYearsSelect";
import idManager from "../CoursePlanner/DraggableIdManager";
import CoursePlanSelect from "../CoursePlanToolbar/CoursePlanSelect";
import RequirementsContext from "../../contexts/RequirementsContext";
import AlertNotification from "./AlertNotification";
import TotalUnitsCount from "../CoursePlanToolbar/TotalUnitsCount.js";

const DEFAULT_YEARS = 4;
const DEFAULT_START_YEAR = new Date().getFullYear();
const MAX_COURSE_PLANS = 3;
const MAX_DEGREES = 10;
const REMEMBER_PASSWORD_KEY = "ZOTDEGREE_REMEMBER_PASSWORD";
const USER_KEY_KEY = "ZOTDEGREE_USER_KEY";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0064A4",
    },
    secondary: {
      main: "#FFD200",
    },
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    // USER DATA --------------------------------------------------------------
    this.setUserKey = (newUserKey) => {
      this.setState({ userKey: newUserKey });
    };

    this.setRememberPassword = (newRememberPassword) => {
      localStorage.setItem(REMEMBER_PASSWORD_KEY, newRememberPassword);
      if (newRememberPassword) {
        localStorage.setItem(USER_KEY_KEY, this.state.userKey);
      } else {
        localStorage.setItem(USER_KEY_KEY, null);
      }
      this.setState({ rememberPassword: newRememberPassword });
    };

    this.prepareCourses = (coursePlans) =>
      coursePlans.map((courses) =>
        courses.map((course) => ({
          id: course.content.id,
          year: course.year,
          quarter: course.quarter,
        }))
      );

    this.getUserData = () => {
      const { degrees, coursePlans, startYear, numYears } = this.state;
      return {
        userData: {
          startYear,
          numYears,
          degrees: degrees.map((degree) => degree.value),
          coursePlans: this.prepareCourses(coursePlans),
        },
      };
    };

    this.saveUserData = () => {
      if (this.state.isLoadingUserDataSave) {
        return;
      }
      if (this.state.userKey.length === 0) {
        this.openAlert("You must enter a password!", "error");
        return;
      }
      this.startLoadingUserDataSave(async () => {
        const userData = this.getUserData();
        const jsonData = await apiSaveUserData(this.state.userKey, userData);
        this.stopLoadingUserDataSave();
        if ("error" in jsonData) {
          this.openAlert("Save Data Failed! " + jsonData.error, "error");
          return;
        }
        this.setState({ changesSaved: true });
      });
    };

    this.getPreparedCourses = (coursePlans) =>
      coursePlans.map((courses) =>
        courses.map((course) => ({ id: idManager.getNextId(), ...course }))
      );

    this.setUserData = (userData) => {
      const { degrees, coursePlans, startYear, numYears } = userData;
      const preparedCoursePlans = this.getPreparedCourses(coursePlans);
      this.setState({
        startYear,
        numYears,
        degrees: degrees.map((degree) => ({ value: degree, label: degree })),
        coursePlans: preparedCoursePlans,
        courses: preparedCoursePlans[this.state.currentCoursePlan],
      });
      this.getRequirements(degrees);
    };

    this.loadUserData = () => {
      if (this.state.isLoadingUserDataLoad) {
        return;
      }
      this.startLoadingUserDataLoad(async () => {
        const jsonData = await apiLoadUserData(this.state.userKey);
        this.stopLoadingUserDataLoad();
        if ("error" in jsonData) {
          this.openAlert("Load Data Failed! " + jsonData.error, "error");
          return;
        }
        this.setUserData(jsonData.userData);
      });
    };

    this.startLoadingUserDataLoad = (callback) => {
      this.setState({ isLoadingUserDataLoad: true }, callback);
    };

    this.stopLoadingUserDataLoad = () => {
      this.setState({ isLoadingUserDataLoad: false });
    };
    this.startLoadingUserDataSave = (callback) => {
      this.setState({ isLoadingUserDataSave: true }, callback);
    };

    this.stopLoadingUserDataSave = () => {
      this.setState({ isLoadingUserDataSave: false });
    };

    this.beforeUnload = (e) => {
      if (!this.state.changesSaved) {
        e.preventDefault();
        e.returnValue = true;
      }
    };

    // ALERTS -----------------------------------------------------------------
    this.openAlert = (message, severity = "info") => {
      this.setState({
        alertOpen: true,
        alertMessage: message,
        alertSeverity: severity,
      });
    };

    this.handleClose = (_, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ alertOpen: false });
    };

    // COURSE PLAN ------------------------------------------------------------
    this.removeCourseById = (courseId) => {
      let findIndex = this.findCourseById(courseId);
      if (findIndex === -1) {
        return;
      }
      const sourceClone = Array.from(this.state.courses);
      sourceClone.splice(findIndex, 1);
      this.setCourses(sourceClone);
    };

    this.findCourseById = (courseId) => {
      const courses = this.state.courses;
      for (let i = 0; i < courses.length; ++i) {
        if (courses[i].content.id === courseId) {
          return i;
        }
      }
      return -1;
    };

    this.setCourses = (newCourses) => {
      const newCoursePlans = Array.from(this.state.coursePlans);
      newCoursePlans[this.state.currentCoursePlan] = newCourses;
      this.setState({
        coursePlans: newCoursePlans,
        courses: newCourses,
        changesSaved: false,
      });
    };

    this.setNumYears = (newNumYears) => {
      this.setState({ numYears: newNumYears, changesSaved: false });
    };

    this.setStartYear = (newStartYear) => {
      this.setState({ startYear: newStartYear, changesSaved: false });
    };

    this.setCurrentCoursePlan = (newCurrentCoursePlan) => {
      this.setState({
        currentCoursePlan: newCurrentCoursePlan,
        courses: this.state.coursePlans[newCurrentCoursePlan],
      });
    };

    // COURSE SEARCH ----------------------------------------------------------
    this.searchCourses = async (query) => {
      if (this.state.isLoadingCourseSearch) {
        return;
      }
      this.startLoadingCourseSearch(async () => {
        const jsonData = await apiSearchCourses(query);
        this.stopLoadingCourseSearch();
        if ("error" in jsonData) {
          this.openAlert("Course Search Failed! " + jsonData.error, "error");
          return;
        }
        const courseSearchList = this.getCourseDroppables(jsonData);
        this.setState({ courseSearchList: courseSearchList });
        if (courseSearchList.length === 0) {
          this.openAlert("No Courses Found!", "error");
        }
      });
    };

    this.getCourseDroppables = (courses) =>
      courses.map((course) => ({
        id: idManager.getNextId(),
        content: course,
      }));

    this.startLoadingCourseSearch = (callback) => {
      this.setState({ isLoadingCourseSearch: true }, callback);
    };

    this.stopLoadingCourseSearch = () => {
      this.setState({ isLoadingCourseSearch: false });
    };

    // REQUIREMENTS ----------------------------------------------------
    this.setDegrees = (newDegrees) => {
      if (newDegrees.length > MAX_DEGREES) {
        this.openAlert(`Max degrees limit: ${MAX_DEGREES}`);
        return;
      }
      this.setState({ degrees: newDegrees, changesSaved: false });
      this.getRequirements(newDegrees.map((degree) => degree.value));
    };

    this.getRequirements = (newDegrees) => {
      if (this.state.isLoadingRequirements) {
        return;
      }
      if (newDegrees.length === 0) {
        this.setState({ requirements: [] });
        return;
      }
      this.startLoadingRequirements(async () => {
        let jsonData = await apiGetRequirements(newDegrees);
        this.stopLoadingRequirements();
        if ("errpr" in jsonData) {
          this.openAlert("Get Requirements Failed! " + jsonData.error, "error");
          return;
        }
        this.setState({ requirements: jsonData });
      });
    };

    this.startLoadingRequirements = (callback) => {
      this.setState({ isLoadingRequirements: true }, callback);
    };

    this.stopLoadingRequirements = () => {
      this.setState({ isLoadingRequirements: false });
    };

    this.loadCourse = (courseId) => {
      if (this.state.isLoadingGetCourse) {
        return;
      }
      this.startLoadingGetCourse(async () => {
        let jsonData = await apiGetCourse(courseId);
        this.stopLoadingGetCourse();
        if ("error" in jsonData) {
          this.openAlert("Get Course Failed! " + jsonData.error, "error");
          return;
        }
        const newLoadedCourses = {
          ...this.state.loadedCourses,
          [courseId]: { content: jsonData.course, id: idManager.getNextId() },
        };
        this.setState({
          requirementsContext: {
            ...this.state.requirementsContext,
            loadedCourses: newLoadedCourses,
          },
        });
      });
    };

    this.startLoadingGetCourse = (callback) => {
      this.setState({ isLoadingGetCourse: true }, callback);
    };

    this.stopLoadingGetCourse = () => {
      this.setState({ isLoadingGetCourse: false });
    };

    // STATE ------------------------------------------------------------------
    const coursePlans = [...Array(MAX_COURSE_PLANS).keys()].map(() => []);
    this.state = {
      // USER DATA
      userKey: "",
      rememberPassword: false,
      isLoadingUserDataSave: false,
      isLoadingUserDataLoad: false,
      changesSaved: true,

      // ALERTS
      alertOpen: false,
      alertMessage: "",
      alertSeerity: "",

      // COURSE PLAN
      coursePlans: coursePlans,
      currentCoursePlan: 0,
      courses: coursePlans[0],
      numYears: DEFAULT_YEARS,
      startYear: DEFAULT_START_YEAR,
      coursePlanContext: {
        removeCourseById: this.removeCourseById,
      },

      // COURSE SERACH
      courseSearchList: [],
      isLoadingCourseSearch: false,
      searchCourses: this.searchCourses,

      // REQUIREMENTS
      degrees: [],
      requirements: [],
      isLoadingRequirements: false,
      isLoadingGetCourse: false,
      requirementsContext: {
        loadedCourses: {},
        loadCourse: this.loadCourse,
      },
    };
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeUnload);
    const storageRememberPassword =
      localStorage.getItem(REMEMBER_PASSWORD_KEY) === "true";
    if (storageRememberPassword) {
      this.setState({ rememberPassword: storageRememberPassword });
      const storageUserKey = localStorage.getItem(USER_KEY_KEY);
      if (!storageUserKey) {
        return;
      }
      this.setState({ userKey: storageUserKey });
      this.loadUserData();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeUnload);
  }
  render() {
    const {
      userKey,
      rememberPassword,
      isLoadingUserDataSave,
      isLoadingUserDataLoad,
      changesSaved,
      alertOpen,
      alertSeverity,
      alertMessage,
      currentCoursePlan,
      courses,
      numYears,
      startYear,
      courseSearchList,
      isLoadingCourseSearch,
      degrees,
      requirements,
      isLoadingRequirements,
      coursePlanContext,
      requirementsContext,
    } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <NavBar
          userKey={userKey}
          setUserKey={this.setUserKey}
          rememberPassword={rememberPassword}
          setRememberPassword={this.setRememberPassword}
          saveUserData={this.saveUserData}
          loadUserData={this.loadUserData}
          changesSaved={changesSaved}
          isLoadingUserDataSave={isLoadingUserDataSave}
        ></NavBar>
        <CoursePlanner
          courses={courses}
          loadedCourses={requirementsContext.loadedCourses}
          setCourses={this.setCourses}
          courseSearchList={courseSearchList}
          openAlert={this.openAlert}
        >
          <Fragment>
            <CoursePlanToolbar>
              <CoursePlanSelect
                currentCoursePlan={currentCoursePlan}
                setCurrentCoursePlan={this.setCurrentCoursePlan}
              />
              <StartYearSelect
                startYear={startYear}
                setStartYear={this.setStartYear}
              />
              <NumYearsSelect
                numYears={numYears}
                setNumYears={this.setNumYears}
              />
              <TotalUnitsCount courses={courses} />
            </CoursePlanToolbar>
            <CoursePlanContext.Provider value={coursePlanContext}>
              <CoursePlan
                courses={courses}
                numYears={numYears}
                startYear={startYear}
                isLoading={isLoadingUserDataLoad}
              />
            </CoursePlanContext.Provider>
          </Fragment>
          <ToolPanels>
            <RequirementsContext.Provider value={requirementsContext}>
              <RequirementsPanel
                degrees={degrees}
                requirements={requirements}
                courses={courses}
                isLoading={isLoadingRequirements}
                setDegrees={this.setDegrees}
              />
            </RequirementsContext.Provider>
            <CourseSearchPanel
              openAlert={this.openAlert}
              searchCourses={this.searchCourses}
              courseSearchList={courseSearchList}
              isLoading={isLoadingCourseSearch}
            />
          </ToolPanels>
        </CoursePlanner>
        <AlertNotification
          alertOpen={alertOpen}
          handleClose={this.handleClose}
          alertSeverity={alertSeverity}
          alertMessage={alertMessage}
        />
      </ThemeProvider>
    );
  }
}
export default App;
