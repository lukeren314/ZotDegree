export const DEFAULT_YEARS = 4;
export const DEFAULT_START_YEAR = new Date().getFullYear();
export const QUARTERS = ["Fall", "Winter", "Spring", "Summer"];

export function newYearPlans() {
  let yearPlans = {};
  for (let i = 0; i < DEFAULT_YEARS + 1; ++i) {
    yearPlans[i] = newYearPlan();
  }
  return yearPlans;
}

export function newYearPlan() {
  let yearPlan = {};
  for (let quarter of QUARTERS) {
    yearPlan[quarter] = [];
  }
  return yearPlan;
}

export function getSourceInfo(source) {
  return [...getYearQuarter(source.droppableId), source.index];
}

export function removeCourseFromQuarter(yearPlans, year, quarter, index) {
  const items = removeFrom(yearPlans[year][quarter], index);
  const newYearPlans = replaceItems(yearPlans, items, year, quarter);
  return newYearPlans;
}

export function replaceItems(yearPlans, items, year, quarter) {
  const yearPlan = {
    ...yearPlans[year],
    [quarter]: items,
  };
  return { ...yearPlans, [year]: yearPlan };
}

export function reorderCourses(
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

export function getYearQuarter(droppableId) {
  return [droppableId.substr(0, 1), droppableId.substr(1)];
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function copyTo(
  source,
  destination,
  sourceIndex,
  destinationIndex,
  newId
) {
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

export function move(source, destination, sourceIndex, destinationIndex) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destinationIndex, 0, removed);
  return [sourceClone, destClone];
}
