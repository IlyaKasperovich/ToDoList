class ToDoApplication {
  constructor() {}

  execute() {
    let taskManager = new TaskManager(new Store(), new Render());
    taskManager.createTask('go to school');
    taskManager.createTask('go to shop');
    taskManager.createTask('go to gym');
    let testId = taskManager._store._store[0].getId();
    taskManager.removeTask(testId);// удалили 'go to school'


  }
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
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
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
  constructor(store, render) {
    this._store = store;
    this._render = render;
  }

  createTask(title) {
    let newTask = new Task(title);
    this._store.createTask(newTask);
    this._render.rederTask(newTask);
  }

  removeTask(id){
    this._store.removeTask(id);
    this._render.dispose(this._store.getTasks());
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

  rederTask(task) {
    console.log(task);
  }

  updateTask(id) {
    //????????
  }

  dispose(tasks) {
    console.clear();
    for (let i = 0; i < tasks.length; i++) {
      console.log(tasks[i]);
    }
  }
}

let app = new ToDoApplication();
app.execute();
