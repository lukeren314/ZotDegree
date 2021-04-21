class DraggableIdManager {
  constructor() {
    this.draggableIdCounter = 0;
  }
  getNextId() {
    let nextId = this.draggableIdCounter + "";
    this.draggableIdCounter++;
    return nextId;
  }
}

export default DraggableIdManager;
