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

const idManager = new DraggableIdManager();

export default idManager;
