class ToDoApplication {
  constructor() {}

  execute() {}
}

class Task {
  constructor(title) {
    this._title = title;
    this._completed = false;
    this._id = this.makeid();
  }

  isCompleted() {
    return this._completed;
  }

  makeid(length = 10) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getId() {
    return this._id;
  }

  touggle() {
    this._completed ? (this._completed = false) : (this._completed = true);
  }
}

class TaskManager {
  constructor() {}

  createTask(title) {
    return new Task(title);
  }
}

class Store {
  constructor() {
    this._store = [];
  }

  createTask(task) {
    this._store.push(task);
  }

  removeTask(id) {
    for (let i = 0; i < this._store.length; i++) {
      if (this._store[i].getId() === id) {
        this._store.splice(i, 1);
      }
    }
  }

  getTasks() {
    return this._store;
  }

  getTask(id) {
    for (let i = 0; i < this._store.length; i++) {
      if (this._store[i].getId() === id) {
        return this._store[i];
      }
    }
  }

  updateTask(task) {
    for (let i = 0; i < this._store.length; i++) {
      if (this._store[i].getId() === task.getId()) {
        this._store.splice(i, 1, task);
      }
    }
  }
}

class Render {
  constructor() {}
}

let app = new ToDoApplication();
app.execute();
