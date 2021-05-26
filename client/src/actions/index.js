import {
  apiGetCourse,
  apiGetRequirements,
  apiLoadUserData,
  apiSaveUserData,
  apiSearchCourses,
} from "../api/api";
import idCounter from "../util/IdCounter";

// ALERTS

export const OPEN_ALERT = "OPEN_ALERT";
export const CLOSE_ALERT = "CLOSE_ALERT";

export const openAlert = (message, severity = "info") => ({
  type: OPEN_ALERT,
  message,
  severity,
});

export const closeAlert = () => ({
  type: CLOSE_ALERT,
});

// USER DATA

export const SET_USER_KEY = "SET_USER_KEY";
export const SET_REMEMBER_PASSWORD = "SET_REMEMBER_PASSWORD";
export const LOAD_PASSWORD = "LOAD_PASSWORD";
export const REQUEST_SAVE_DATA = "REQUEST_SAVE_DATA";
export const RECEIVE_SAVE_DATA = "RECEIVE_SAVE_DATA";
export const REQUEST_LOAD_DATA = "REQUEST_LOAD_DATA";
export const RECEIVE_LOAD_DATA = "RECEIVE_LOAD_DATA";
export const ADD_CHANGES = "ADD_CHANGES";

export const REMEMBER_PASSWORD_KEY = "ZOTDEGREE_REMEMBER_PASSWORD";
export const USER_KEY_KEY = "ZOTDEGREE_USER_KEY";

export const setUserKey = (userKey) => ({
  type: SET_USER_KEY,
  userKey,
});

export const setRememberPassword = (rememberPassword) => ({
  type: SET_REMEMBER_PASSWORD,
  rememberPassword,
});

export const saveRememberPassword =
  (rememberPassword) => (dispatch, getState) => {
    localStorage.setItem(REMEMBER_PASSWORD_KEY, rememberPassword);
    if (rememberPassword) {
      localStorage.setItem(USER_KEY_KEY, getState().userData.userKey);
    } else {
      localStorage.setItem(USER_KEY_KEY, null);
    }
    dispatch(setRememberPassword(rememberPassword));
  };

export const loadPassword = () => (dispatch) => {
  const storageRememberPassword =
    localStorage.getItem(REMEMBER_PASSWORD_KEY) === "true";
  if (storageRememberPassword) {
    dispatch(setRememberPassword(storageRememberPassword));
    const storageUserKey = localStorage.getItem(USER_KEY_KEY);
    if (!storageUserKey) {
      return;
    }
    dispatch(setUserKey(storageUserKey));
    dispatch(loadUserDataIfNeeded());
  }
};

const requestSaveData = () => ({
  type: REQUEST_SAVE_DATA,
});

const receiveSaveData = () => ({
  type: RECEIVE_SAVE_DATA,
});

const saveUserData = (userKey, userData) => async (dispatch) => {
  if (userKey.length === 0) {
    dispatch(openAlert("You must enter a password!", "error"));
    return;
  }
  dispatch(requestSaveData);
  const jsonData = await apiSaveUserData(userKey, userData);
  if ("error" in jsonData) {
    dispatch(openAlert("Save Data Failed! " + jsonData.error, "error"));
    dispatch(receiveSaveData());
    return;
  }
  dispatch(openAlert("Save Data Success!", "success"));
  dispatch(receiveSaveData());
};

const getSaveCoursePlans = (coursePlans) =>
  coursePlans.map((courses) =>
    courses.map((course) => ({
      id: course.content.id,
      year: course.year,
      quarter: course.quarter,
    }))
  );

const getUserData = (state) => ({
  userData: {
    startYear: state.coursePlans.startYear,
    numYears: state.coursePlans.numYears,
    degrees: getDegreeValues(state.requirements.degrees),
    coursePlans: getSaveCoursePlans(state.coursePlans.coursePlans),
    checkedRequirements: state.requirements.checkedRequirements,
  },
});

const shouldSaveUserData = (state) => !state.userData.isFetchingSave;

export const saveUserDataIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldSaveUserData(state)) {
    const userData = getUserData(state);
    dispatch(saveUserData(state.userData.userKey, userData));
  }
};

const requestLoadData = () => ({
  type: REQUEST_LOAD_DATA,
});

const receiveLoadData = () => ({
  type: RECEIVE_LOAD_DATA,
});

const getLoadCoursePlans = (coursePlans) =>
  coursePlans.map((courses) =>
    courses.map((course) => ({ id: idCounter.getNextId(), ...course }))
  );

const setUserData = (userData, dispatch) => {
  const { degrees, coursePlans, startYear, numYears, checkedRequirements } =
    userData;
  dispatch(setStartYear(startYear));
  dispatch(setNumYears(numYears));
  dispatch(maybeSetDegrees(getDegrees(degrees)));
  dispatch(setCheckedRequirements(checkedRequirements));
  dispatch(setCoursePlans(getLoadCoursePlans(coursePlans)));
};

const loadUserData = (userKey) => async (dispatch) => {
  dispatch(requestLoadData);
  const jsonData = await apiLoadUserData(userKey);
  if ("error" in jsonData) {
    dispatch(openAlert("Load Data Failed! " + jsonData.error, "error"));
    dispatch(receiveLoadData());
    return;
  }
  setUserData(jsonData.userData, dispatch);
  dispatch(openAlert("Load Data Success!", "success"));
  dispatch(receiveLoadData());
};

const shouldLoadUserData = (state) => !state.userData.isFetchingLoad;

export const loadUserDataIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldLoadUserData(state)) {
    dispatch(loadUserData(state.userData.userKey));
  }
};

const addChanges = () => ({
  type: ADD_CHANGES,
});

export const modifyUserState = (action) => (dispatch) => {
  dispatch(addChanges());
  return dispatch(action);
};

// SEARCH LIST

export const REQUEST_COURSE_SEARCH = "REQUEST_SEARCH_LIST";
export const RECEIVE_COURSE_SEARCH = "RECEIVE_SEARCH_LIST";

const requestCourseSearch = () => ({
  type: REQUEST_COURSE_SEARCH,
});

const receiveCourseSearch = (searchList) => ({
  type: RECEIVE_COURSE_SEARCH,
  searchList,
});

const fetchSearchList = (query) => async (dispatch) => {
  dispatch(requestCourseSearch());
  const jsonData = await apiSearchCourses(query);
  if ("error" in jsonData) {
    dispatch(openAlert("Course Search Failed! " + jsonData.error, "error"));
    dispatch(receiveCourseSearch([]));
    return;
  }
  const searchList = jsonData.map((course) => ({
    id: idCounter.getNextId(),
    content: course,
  }));
  dispatch(receiveCourseSearch(searchList));
};

const shouldFetchSearchList = (state) => !state.courseSearch.isFetching;

export const fetchSearchListIfNeeded = (query) => (dispatch, getState) => {
  if (shouldFetchSearchList(getState())) {
    dispatch(fetchSearchList(query));
  }
};

// COURSE PLANS

export const REMOVE_COURSE = "REMOVE_COURSE";
export const SET_COURSE_PLANS = "SET_COURSE_PLANS";
export const SET_COURSE_PLAN = "SET_COURSE_PLAN";
export const SET_NUM_YEARS = "SET_NUM_YEARS";
export const SET_START_YEAR = "SET_START_YEAR";
export const SET_CURRENT_COURSE_PLAN = "SET_CURRENT_COURSE_PLAN";
export const HIGHLIGHT_COURSE = "HIGHLIGHT_COURSE";
export const UNHIGHLIGHT_COURSE = "UNHIGHLIGHT_COURSE";

export const removeCourse = (courseId) =>
  modifyUserState({
    type: REMOVE_COURSE,
    courseId,
  });

export const setCoursePlans = (coursePlans) => ({
  type: SET_COURSE_PLANS,
  coursePlans,
});

export const setCoursePlan = (coursePlan) =>
  modifyUserState({
    type: SET_COURSE_PLAN,
    coursePlan,
  });

export const setNumYears = (numYears) =>
  modifyUserState({
    type: SET_NUM_YEARS,
    numYears,
  });

export const setStartYear = (startYear) =>
  modifyUserState({
    type: SET_START_YEAR,
    startYear,
  });

export const setCurrentCoursePlan = (currentCoursePlan) => ({
  type: SET_CURRENT_COURSE_PLAN,
  currentCoursePlan,
});

export const highlightCourse = (courseId) => ({
  type: HIGHLIGHT_COURSE,
  courseId,
});

export const unhighlightCourse = (courseId) => ({
  type: UNHIGHLIGHT_COURSE,
  courseId,
});

// REQUIREMENTS

export const SET_DEGREES = "SET_DEGREES";
export const REQUEST_REQUIREMENTS = "REQUEST_REQUIREMENTS";
export const RECEIVE_REQUIREMENTS = "RECEIVE_REQUIREMENTS";
export const REQUEST_COURSE = "REQUEST_COURSE";
export const RECEIVE_COURSE = "RECEIVE_COURSE";
export const UNLOAD_COURSE = "UNLOAD_COURSE";
export const CHECK_REQUIREMENT = "CHECK_REQUIREMENT";
export const SET_CHECKED_REQUIREMENTS = "SET_CHECKED_REQUIREMENTS";

const MAX_DEGREES = 10;

const setDegrees = (degrees) =>
  modifyUserState({
    type: SET_DEGREES,
    degrees,
  });

const shouldSetDegrees = (degrees) => degrees.length <= MAX_DEGREES;

export const maybeSetDegrees = (degrees) => (dispatch) => {
  if (shouldSetDegrees(degrees)) {
    dispatch(setDegrees(degrees));
    dispatch(fetchRequirementsIfNeeded(degrees));
  }
};

const requestRequirements = () => ({
  type: REQUEST_REQUIREMENTS,
});

const receiveRequirements = (requirements) => ({
  type: RECEIVE_REQUIREMENTS,
  requirements,
});

const fetchRequirements = (degrees) => async (dispatch) => {
  if (degrees.length === 0) {
    dispatch(receiveRequirements([]));
    return;
  }
  dispatch(requestRequirements());
  const jsonData = await apiGetRequirements(degrees);
  if ("error" in jsonData) {
    dispatch(openAlert("Get Requirements Failed! " + jsonData.error, "error"));
    dispatch(receiveRequirements([]));
    return;
  }
  const requirements = jsonData;
  dispatch(receiveRequirements(requirements));
};

const shouldFetchRequirements = (state) =>
  !state.requirements.isFetchingRequirements;

const getDegrees = (degrees) =>
  degrees.map((degree) => ({ value: degree, label: degree }));
const getDegreeValues = (degrees) => degrees.map((degree) => degree.value);

export const fetchRequirementsIfNeeded = (degrees) => (dispatch, getState) => {
  if (shouldFetchRequirements(getState())) {
    dispatch(fetchRequirements(getDegreeValues(degrees)));
  }
};

const requestCourse = () => ({
  type: REQUEST_COURSE,
});

const receiveCourse = (requirementId, course) => ({
  type: RECEIVE_COURSE,
  requirementId,
  course,
});

const fetchCourse = (requirementId, courseId) => async (dispatch) => {
  dispatch(requestCourse());
  const jsonData = await apiGetCourse(courseId);
  if ("error" in jsonData) {
    dispatch(openAlert("Get Course Failed! " + jsonData.error, "error"));
    return;
  }
  const course = jsonData.course;
  dispatch(receiveCourse(requirementId, course));
};

const shouldFetchCourse = (state, requirementId) =>
  !(requirementId in state.requirements.loadedRequirements);

export const fetchCourseIfNeeded =
  (requirementId, courseId) => (dispatch, getState) => {
    if (shouldFetchCourse(getState(), requirementId)) {
      dispatch(fetchCourse(requirementId, courseId));
    }
  };

export const unloadCourse = (courseId) => ({
  type: UNLOAD_COURSE,
  courseId,
});

export const checkRequirement = (courseId) =>
  modifyUserState({
    type: CHECK_REQUIREMENT,
    courseId,
  });

const setCheckedRequirements = (checkedRequirements) => ({
  type: SET_CHECKED_REQUIREMENTS,
  checkedRequirements,
});
