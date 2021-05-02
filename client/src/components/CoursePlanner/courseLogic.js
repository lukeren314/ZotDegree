export const DEFAULT_YEARS = 4;
export const DEFAULT_START_YEAR = new Date().getFullYear();
export const QUARTERS = ["Fall", "Winter", "Spring", "Summer"];


export function copyTo(sourceList, destinationList, source, destination, newId) {
  let sourceObjectClone = { ...sourceList[source.index] };
  let [year, quarter] = getYearQuarter(destination.droppableId);
  sourceObjectClone.id = newId;
  sourceObjectClone.year = year;
  sourceObjectClone.quarter = quarter;
  const destClone = Array.from(destinationList);
  destClone.push(sourceObjectClone);
  destClone.sort((firstObject, secondObject)=>firstObject.content.id < secondObject.content.id);
  return destClone;
}

export function removeFrom(sourceList, source) {
  let [year, quarter] = getYearQuarter(source.droppableId);
  let find = findDraggable(sourceList, year, quarter, source.index);
  
  const sourceClone = Array.from(sourceList);
  sourceClone.splice(find, 1);
  return sourceList;
}

export function move(draggableList, source, destination) {
  let [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
  let [destinationYear, destinationQuarter] = getYearQuarter(destination.droppableId);
  
  if (sourceYear === destinationYear && sourceQuarter === destinationQuarter) {
    return draggableList;
  }

  let findSource = findDraggable(draggableList, sourceYear, sourceQuarter, source.index);
  const listClone = Array.from(draggableList);
  listClone[findSource].year = destinationYear;
  listClone[findSource].quarter = destinationQuarter;
  return listClone;
}

function getYearQuarter(droppableId) {
  return [droppableId.substr(0, 1), droppableId.substr(1)];
}

function findDraggable(list, year, quarter, draggableIndex) {
  let count = 0;
  for (let i = 0; i < list.length; ++i) {
    const item = list[i];
    if (item.year === year && item.quarter === quarter && count++ === draggableIndex) {
      return i;
    }
  };
  return -1;
}