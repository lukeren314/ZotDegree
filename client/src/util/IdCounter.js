class IdCounter {
  constructor() {
    this.idCounter = 0;
  }
  getNextId() {
    let nextId = this.idCounter + "";
    this.idCounter++;
    return nextId;
  }
}

const idCounter = new IdCounter();

export default idCounter;
