export class Task {
  constructor(id, title, completed = false, creationMoment = Date.now()) {
    this._id = id;
    this._title = title;
    this._completed = completed;
    this._creationMoment = creationMoment;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get completed() {
    return this._completed;
  }

  get creationMoment() {
    return this._creationMoment;
  }

  isCompleted() {
    return this._completed;
  }

  toggle() {
    this._completed = !this._completed;
    return this;
  }

  copy() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      creationMoment: this.creationMoment
    };
  }

  static toJSON(task) {
    return JSON.stringify({
      id: task.id,
      title: task.title,
      completed: task.completed,
      creationMoment: task.creationMoment
    });
  }

  static fromJSON(json) {
    let obj = null;
    try {
      obj = JSON.parse(json);
    } catch (error) {
      throw new Error(`invalid json: ${json}`, error.message);
    }

    return new Task(obj.id, obj.title, obj.completed, obj.creationMoment);
  }
}
