import { combineReducers } from "redux";
import {
  OPEN_ALERT,
  CLOSE_ALERT,
  REQUEST_COURSE_SEARCH,
  RECEIVE_COURSE_SEARCH,
  REMOVE_COURSE,
  SET_NUM_YEARS,
  SET_START_YEAR,
  SET_CURRENT_COURSE_PLAN,
  ADD_CHANGES,
  SET_COURSE_PLAN,
  HIGHLIGHT_COURSE,
  UNHIGHLIGHT_COURSE,
  SET_DEGREES,
  REQUEST_REQUIREMENTS,
  RECEIVE_REQUIREMENTS,
  CHECK_REQUIREMENT,
  REQUEST_COURSE,
  RECEIVE_COURSE,
  SET_USER_KEY,
  SET_REMEMBER_PASSWORD,
  REQUEST_SAVE_DATA,
  RECEIVE_SAVE_DATA,
  REQUEST_LOAD_DATA,
  RECEIVE_LOAD_DATA,
  SET_CHECKED_REQUIREMENTS,
  SET_COURSE_PLANS,
  UNLOAD_COURSE,
} from "../actions";
import idCounter from "../util/IdCounter";

const alerts = (
  state = {
    open: false,
    message: "",
    severity: "info",
  },
  action
) => {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        open: true,
        message: action.message,
        severity: action.severity,
      };
    case CLOSE_ALERT:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

const userData = (
  state = {
    changesSaved: true,
    userKey: "",
    rememberPassword: false,
    isFetchingSave: false,
    isFetchingLoad: false,
  },
  action
) => {
  switch (action.type) {
    case ADD_CHANGES:
      return {
        ...state,
        changesSaved: false,
      };
    case SET_USER_KEY:
      return {
        ...state,
        userKey: action.userKey,
      };
    case SET_REMEMBER_PASSWORD:
      return {
        ...state,
        rememberPassword: action.rememberPassword,
      };
    case REQUEST_SAVE_DATA:
      return {
        ...state,
        isFetchingSave: true,
      };
    case RECEIVE_SAVE_DATA:
      return {
        ...state,
        isFetchingSave: false,
        changesSaved: true,
      };
    case REQUEST_LOAD_DATA:
      return {
        ...state,
        isFetchingLoad: true,
      };
    case RECEIVE_LOAD_DATA:
      return {
        ...state,
        isFetchingLoad: false,
        changesSaved: true,
      };
    default:
      return state;
  }
};

const courseSearch = (
  state = {
    isFetching: false,
    searchList: [],
  },
  action
) => {
  switch (action.type) {
    case REQUEST_COURSE_SEARCH:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_COURSE_SEARCH:
      return {
        ...state,
        isFetching: false,
        searchList: action.searchList,
      };
    default:
      return state;
  }
};

const DEFAULT_YEARS = 4;
const DEFAULT_START_YEAR = new Date().getFullYear();
const MAX_COURSE_PLANS = 3;
const DEFAULT_COURSE_PLANS = [...Array(MAX_COURSE_PLANS).keys()].map(() => []);

const coursePlans = (
  state = {
    coursePlans: DEFAULT_COURSE_PLANS,
    currentCoursePlan: 0,
    coursePlan: DEFAULT_COURSE_PLANS[0],
    numYears: DEFAULT_YEARS,
    startYear: DEFAULT_START_YEAR,
    highlightedCourses: [],
  },
  action
) => {
  switch (action.type) {
    case REMOVE_COURSE:
      return {
        ...state,
        coursePlan: state.coursePlan.filter(
          (course) => course.id !== action.draggableId
        ),
      };
    case SET_COURSE_PLANS:
      return {
        ...state,
        coursePlans: action.coursePlans,
        coursePlan: action.coursePlans[state.currentCoursePlan],
      };
    case SET_COURSE_PLAN:
      const coursePlans = Array.from(state.coursePlans);
      coursePlans[state.currentCoursePlan] = action.coursePlan;
      return {
        ...state,
        coursePlans,
        coursePlan: action.coursePlan,
      };
    case SET_NUM_YEARS:
      return {
        ...state,
        numYears: action.numYears,
      };
    case SET_START_YEAR:
      return {
        ...state,
        startYear: action.startYear,
      };
    case SET_CURRENT_COURSE_PLAN:
      return {
        ...state,
        currentCoursePlan: action.currentCoursePlan,
        coursePlan: state.coursePlans[action.currentCoursePlan],
      };
    case HIGHLIGHT_COURSE:
      if (state.highlightedCourses.includes(action.courseId)) return state;
      return {
        ...state,
        highlightedCourses: [...state.highlightedCourses, action.courseId],
      };
    case UNHIGHLIGHT_COURSE:
      if (!state.highlightedCourses.includes(action.courseId)) return state;
      return {
        ...state,
        highlightedCourses: state.highlightedCourses.filter(
          (id) => id !== action.courseId
        ),
      };
    default:
      return state;
  }
};

const requirements = (
  state = {
    degrees: [],
    requirements: [],
    isFetchingRequirements: false,
    isFetchingCourse: false,
    loadedRequirements: {},
    checkedRequirements: [],
  },
  action
) => {
  switch (action.type) {
    case SET_DEGREES:
      return {
        ...state,
        degrees: action.degrees,
      };
    case REQUEST_REQUIREMENTS:
      return {
        ...state,
        isFetchingRequirements: true,
      };
    case RECEIVE_REQUIREMENTS:
      return {
        ...state,
        requirements: action.requirements,
        isFetchingRequirements: false,
      };
    case REQUEST_COURSE:
      return {
        ...state,
        isFetchingCourse: true,
      };
    case RECEIVE_COURSE:
      return {
        ...state,
        loadedRequirements: {
          ...state.loadedRequirements,
          [action.requirementId]: {
            content: action.course,
            id: idCounter.getNextId(),
          },
        },
        isFetchingCourse: false,
      };
    case CHECK_REQUIREMENT:
      const checkedRequirements = state.checkedRequirements.includes(
        action.courseId
      )
        ? state.checkedRequirements.filter((val) => val !== action.courseId)
        : [...state.checkedRequirements, action.courseId];
      return {
        ...state,
        checkedRequirements,
      };
    case SET_CHECKED_REQUIREMENTS:
      return {
        ...state,
        checkedRequirements: action.checkedRequirements,
      };
    case UNLOAD_COURSE:
      const loadedRequirements = { ...state.loadedRequirements };
      for (let requirementId in state.loadedRequirements) {
        if (
          state.loadedRequirements[requirementId].content.id === action.courseId
        ) {
          delete loadedRequirements[requirementId];
        }
      }
      return {
        ...state,
        loadedRequirements,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  alerts,
  userData,
  courseSearch,
  coursePlans,
  requirements,
});

export default rootReducer;
