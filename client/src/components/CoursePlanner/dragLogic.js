import idCounter from "../../util/IdCounter";

export const COURSE_SEARCH_ID = "course-search";
export const REQUIREMENTS_PREFIX = "req";
const MAX_COURSE_LIMIT = 100;

export const onDragEnd = (
  result,
  coursePlan,
  searchList,
  loadedRequirements,
  setCourses,
  openAlert
) => {
  // utility functions
  const shouldDrag = (source, destination) =>
    destination &&
    !destination.droppableId.startsWith(REQUIREMENTS_PREFIX) &&
    !(
      source.droppableId === COURSE_SEARCH_ID &&
      destination.droppableId === COURSE_SEARCH_ID
    );

  const dragLogic = (source, destination) => {
    if (isRequirement(source)) return maybeAddRequirement(source, destination);
    if (isSearchList(source)) return maybeAddCourseCopy(source, destination);
    if (isRemove(destination)) return removeCourse(source);
    return moveCourse(source, destination);
  };

  const isRequirement = (source) =>
    source.droppableId.startsWith(REQUIREMENTS_PREFIX);

  const isSearchList = (source) => source.droppableId === COURSE_SEARCH_ID;

  const isRemove = (destination) =>
    destination.droppableId === COURSE_SEARCH_ID;

  const duplicateCourse = (course) => ({...course, id: idCounter.getNextId()});

  const copyTo = (destination, newCourse) => {
    let [year, quarter] = getYearQuarter(destination.droppableId);
    newCourse.year = year;
    newCourse.quarter = quarter;
    const newCoursePlan = Array.from(coursePlan);
    newCoursePlan.push(newCourse);
    newCoursePlan.sort((c1, c2) => c1.content.id < c2.content.id);
    return newCoursePlan;
  };

  const maybeAddCourse = (destination, course) => {
    const newCoursePlan = copyTo(destination, course);
    if (newCoursePlan.length > MAX_COURSE_LIMIT) {
      openAlert(`Max course limit: ${MAX_COURSE_LIMIT}`, "error");
      return coursePlan;
    }
    return newCoursePlan;
  };

  const maybeAddRequirement = (source, destination) => {
    const requirementId = getRequirementId(source.droppableId);
    const newCourse = duplicateCourse(loadedRequirements[requirementId]);
    return maybeAddCourse(destination, newCourse);
  };

  const getRequirementId = (droppableId) => droppableId.substr(REQUIREMENTS_PREFIX.length);

  const maybeAddCourseCopy = (source, destination) => {
    const newCourse = duplicateCourse(searchList[source.index]);
    return maybeAddCourse(destination, newCourse);
  };

  const findDraggable = (year, quarter, draggableIndex) => {
    let count = 0;
    for (let i = 0; i < coursePlan.length; ++i) {
      const course = coursePlan[i];
      if (
        course.year === year &&
        course.quarter === quarter &&
        count++ === draggableIndex
      ) {
        return i;
      }
    }
    return -1;
  };

  const removeCourse = (source) => {
    let [year, quarter] = getYearQuarter(source.droppableId);
    let find = findDraggable(year, quarter, source.index);
    const sourceClone = Array.from(coursePlan);
    sourceClone.splice(find, 1);
    return sourceClone;
  };

  const moveCourse = (source, destination) => {
    const newCourses = move(source, destination);
    if (coursePlan === newCourses) {
      openAlert("Classes are sorted alphabetically.", "info");
      return newCourses;
    }
    return newCourses;
  };

  const move = (source, destination) => {
    let [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
    let [destinationYear, destinationQuarter] = getYearQuarter(
      destination.droppableId
    );

    if (
      sourceYear === destinationYear &&
      sourceQuarter === destinationQuarter
    ) {
      return coursePlan;
    }

    const find = findDraggable(sourceYear, sourceQuarter, source.index);
    const newCoursePlan = Array.from(coursePlan);
    newCoursePlan[find].year = destinationYear;
    newCoursePlan[find].quarter = destinationQuarter;
    return newCoursePlan;
  };
  // function body
  const { source, destination } = result;
  if (!shouldDrag(source, destination)) return;
  const newCoursePlan = dragLogic(source, destination);
  setCourses(newCoursePlan);
};

const getYearQuarter = (droppableId) => {
  return [parseInt(droppableId.substr(0, 1)), droppableId.substr(1)];
};
