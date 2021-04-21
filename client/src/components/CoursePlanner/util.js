export const DEFAULT_YEARS = 4;
export const QUARTERS = ["Fall", "Winter", "Spring", "Summer"];

export function newYearPlans() {
  let yearPlans = {};
  for (let i = 0; i < DEFAULT_YEARS; ++i) {
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

export function addCourse(
  courseSearchList,
  yearPlans,
  source,
  destination,
  newId
) {
  const [destinationYear, destinationQuarter] = getYearQuarter(
    destination.droppableId
  );
  const items = copyTo(
    courseSearchList,
    yearPlans[destinationYear][destinationQuarter],
    source.index,
    destination.index,
    newId
  );
  const newYearPlans = replaceItems(
    yearPlans,
    items,
    destinationYear,
    destinationQuarter
  );
  return newYearPlans;
}

export function removeCourse(yearPlans, source) {
  const [sourceYear, sourceQuarter, index] = getSourceInfo(source);
  const newYearPlans = removeCourseFromQuarter(
    yearPlans,
    sourceYear,
    sourceQuarter,
    index
  );
  return newYearPlans;
}

export function getSourceInfo(source) {
  return [...getYearQuarter(source.droppableId), source.index];
}

export function removeCourseFromQuarter(yearPlans, year, quarter, index) {
  const items = removeFrom(yearPlans[year][quarter], index);
  const newYearPlans = replaceItems(yearPlans, items, year, quarter);
  return newYearPlans;
}

function replaceItems(yearPlans, items, year, quarter) {
  const yearPlan = {
    ...yearPlans[year],
    [quarter]: items,
  };
  return { ...yearPlans, [year]: yearPlan };
}

export function moveCourse(yearPlans, source, destination) {
  let [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
  let [destinationYear, destinationQuarter] = getYearQuarter(
    destination.droppableId
  );
  if (source.droppableId === destination.droppableId) {
    // swap within a quarter
    const items = reorder(
      yearPlans[sourceYear][sourceQuarter],
      source.index,
      destination.index
    );
    return replaceItems(yearPlans, items, sourceYear, sourceQuarter);
  }
  if (sourceYear === destinationYear) {
    // swap within a year
    const result = move(
      yearPlans[sourceYear][sourceQuarter],
      yearPlans[sourceYear][destinationQuarter],
      source.index,
      destination.index
    );
    const yearPlan = {
      ...yearPlans[sourceYear],
      [sourceQuarter]: result[0],
      [destinationQuarter]: result[1],
    };
    return { ...yearPlans, [sourceYear]: yearPlan };
  } else {
    const result = move(
      yearPlans[sourceYear][sourceQuarter],
      yearPlans[destinationYear][destinationQuarter],
      source.index,
      destination.index
    );
    const sourceYearPlan = {
      ...yearPlans[sourceYear],
      [sourceQuarter]: result[0],
    };
    const destinationYearPlan = {
      ...yearPlans[destinationYear],
      [destinationQuarter]: result[1],
    };

    return {
      ...yearPlans,
      [sourceYear]: sourceYearPlan,
      [destinationYear]: destinationYearPlan,
    };
  }
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
