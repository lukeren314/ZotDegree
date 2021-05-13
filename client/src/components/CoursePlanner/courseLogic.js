export function copyTo(
  sourceList,
  destinationList,
  source,
  destination,
  newId
) {
  let sourceObjectClone = { ...sourceList[source.index] };
  return copyItemTo(destinationList, destination, sourceObjectClone, newId);
}

export function copyItemTo(destinationList, destination, newObject, newId) {
  let [year, quarter] = getYearQuarter(destination.droppableId);
  newObject.id = newId;
  newObject.year = year;
  newObject.quarter = quarter;
  const destClone = Array.from(destinationList);
  destClone.push(newObject);
  destClone.sort(
    (firstObject, secondObject) =>
      firstObject.content.id < secondObject.content.id
  );
  return destClone;
}

export function removeFrom(sourceList, source) {
  let [year, quarter] = getYearQuarter(source.droppableId);
  let find = findDraggable(sourceList, year, quarter, source.index);

  const sourceClone = Array.from(sourceList);
  sourceClone.splice(find, 1);
  return sourceClone;
}

export function move(draggableList, source, destination) {
  let [sourceYear, sourceQuarter] = getYearQuarter(source.droppableId);
  let [destinationYear, destinationQuarter] = getYearQuarter(
    destination.droppableId
  );

  if (sourceYear === destinationYear && sourceQuarter === destinationQuarter) {
    return draggableList;
  }

  let findSource = findDraggable(
    draggableList,
    sourceYear,
    sourceQuarter,
    source.index
  );
  const listClone = Array.from(draggableList);
  listClone[findSource].year = destinationYear;
  listClone[findSource].quarter = destinationQuarter;
  return listClone;
}

function getYearQuarter(droppableId) {
  return [parseInt(droppableId.substr(0, 1)), droppableId.substr(1)];
}

function findDraggable(list, year, quarter, draggableIndex) {
  let count = 0;
  console.log(list, year, quarter, draggableIndex);
  for (let i = 0; i < list.length; ++i) {
    const item = list[i];
    if (
      item.year === year &&
      item.quarter === quarter &&
      count++ === draggableIndex
    ) {
      return i;
    }
  }
  return -1;
}
