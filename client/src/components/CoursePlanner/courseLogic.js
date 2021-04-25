export const DEFAULT_YEARS = 4;
export const DEFAULT_START_YEAR = new Date().getFullYear();
export const QUARTERS = ["Fall", "Winter", "Spring", "Summer"];

const MAX_COURSE_LIMIT = 10;

export function newYearPlans() {
  let yearPlans = {};
  for (let i = 0; i < DEFAULT_YEARS + 1; ++i) {
    yearPlans[i] = newYearPlan();
  }
  return yearPlans;
}

export function findCourseById(yearPlans, courseId) {
  for (let year in yearPlans) {
    for (let quarter in yearPlans[year]) {
      for (let course of yearPlans[year][quarter]) {
        if (course.content === courseId) {
          return [year, quarter];
        }
      }
    }
  }
  return null;
}

export function removeCourseFromQuarter(yearPlans, year, quarter, index) {
  const items = removeFrom(yearPlans[year][quarter], index);
  const newYearPlans = replaceItems(yearPlans, items, year, quarter);
  return newYearPlans;
}

export function dragLogic(
  yearPlans,
  courseSearchList,
  source,
  destination,
  openAlert,
  draggableIdManager
) {
  if (
    !destination ||
    (source.droppableId === "course-search" &&
      destination.droppableId === "course-search")
  ) {
    return yearPlans;
  }
  if (source.droppableId === "course-search") {
    return addCourse(
      yearPlans,
      courseSearchList,
      source,
      destination,
      openAlert,
      draggableIdManager
    );
  }
  if (destination.droppableId === "course-search") {
    return removeCourse(yearPlans, source);
  }
  return moveCourse(yearPlans, source, destination, openAlert);
}

function newYearPlan() {
  let yearPlan = {};
  for (let quarter of QUARTERS) {
    yearPlan[quarter] = [];
  }
  return yearPlan;
}

function addCourse(
  yearPlans,
  courseSearchList,
  source,
  destination,
  openAlert,
  draggableIdManager
) {
  // don't add if it's already present
  let course = courseSearchList[source.index];
  if (findCourseById(course.content)) {
    openAlert("This class was already added!", "error");
    return yearPlans;
  }
  const [destinationYear, destinationQuarter] = getYearQuarter(
    destination.droppableId
  );
  const newItems = copyTo(
    courseSearchList,
    yearPlans[destinationYear][destinationQuarter],
    source.index,
    destination.index,
    draggableIdManager.getNextId()
  );
  if (newItems.length > MAX_COURSE_LIMIT) {
    openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
    return yearPlans;
  }
  // copy the course into the section
  return replaceItems(yearPlans, newItems, destinationYear, destinationQuarter);
}

function removeCourse(yearPlans, source) {
  // remove the droppable
  const [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
  return removeCourseFromQuarter(
    yearPlans,
    sourceYear,
    sourceQuarter,
    source.index
  );
}

function moveCourse(yearPlans, source, destination, openAlert) {
  // move the course within the year plan
  let [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
  let [destinationYear, destinationQuarter] = getYearQuarter(
    destination.droppableId
  );
  if (source.droppableId === destination.droppableId) {
    // swap within a quarter
    return reorderCourses(
      yearPlans,
      sourceYear,
      sourceQuarter,
      source.index,
      destination.index
    );
  }
  if (sourceYear === destinationYear) {
    // swap within a year
    const [sourceCourses, destinationCourses] = move(
      yearPlans[sourceYear][sourceQuarter],
      yearPlans[sourceYear][destinationQuarter],
      source.index,
      destination.index
    );
    if (
      sourceCourses.length > MAX_COURSE_LIMIT ||
      destinationCourses.length > MAX_COURSE_LIMIT
    ) {
      openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
      return yearPlans;
    }
    const yearPlan = {
      ...yearPlans[sourceYear],
      [sourceQuarter]: sourceCourses,
      [destinationQuarter]: destinationCourses,
    };
    return { ...yearPlans, [sourceYear]: yearPlan };
  }
  // otherwise, move between different years
  const [sourceCourses, destinationCourses] = move(
    yearPlans[sourceYear][sourceQuarter],
    yearPlans[destinationYear][destinationQuarter],
    source.index,
    destination.index
  );
  if (
    sourceCourses.length > MAX_COURSE_LIMIT ||
    destinationCourses.length > MAX_COURSE_LIMIT
  ) {
    openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`);
    return yearPlans;
  }
  const sourceYearPlan = {
    ...yearPlans[sourceYear],
    [sourceQuarter]: sourceCourses,
  };
  const destinationYearPlan = {
    ...yearPlans[destinationYear],
    [destinationQuarter]: destinationCourses,
  };
  return {
    ...yearPlans,
    [sourceYear]: sourceYearPlan,
    [destinationYear]: destinationYearPlan,
  };
}

function replaceItems(yearPlans, items, year, quarter) {
  const yearPlan = {
    ...yearPlans[year],
    [quarter]: items,
  };
  return { ...yearPlans, [year]: yearPlan };
}

function reorderCourses(
  yearPlans,
  year,
  quarter,
  sourceIndex,
  destinationIndex
) {
  const items = reorder(
    yearPlans[year][quarter],
    sourceIndex,
    destinationIndex
  );
  return replaceItems(yearPlans, items, year, quarter);
}

function getYearQuarter(droppableId) {
  return [droppableId.substr(0, 1), droppableId.substr(1)];
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function copyTo(source, destination, sourceIndex, destinationIndex, newId) {
  let sourceObjectClone = { ...source[sourceIndex] };
  sourceObjectClone.id = newId;
  const destClone = Array.from(destination);
  destClone.splice(destinationIndex, 0, sourceObjectClone);
  return destClone;
}

function removeFrom(source, sourceIndex) {
  const sourceClone = Array.from(source);
  sourceClone.splice(sourceIndex, 1);
  return sourceClone;
}

function move(source, destination, sourceIndex, destinationIndex) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destinationIndex, 0, removed);
  return [sourceClone, destClone];
}
