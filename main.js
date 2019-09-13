class ToDoApplication {
  constructor() {}

  execute() {
    const store = new StoreLS();
    const render = new Render();
    const taskManager = new TaskManager(store);
    const toDo = new ToDo(taskManager, render);

    let titleInputRef = document.getElementById("title-input");
    let createTaskBtnRef = document.getElementById("create-btn");
    let debugBtnRef = document.getElementById("debug-btn");

    createTaskBtnRef.addEventListener("click", () => {
      toDo.addTask(titleInputRef.value);
    });

    debugBtnRef.addEventListener("click", () => {
      toDo.init();
    });

    toDo.init();
  }
}

class ToDo {
  constructor(taskManager, render) {
    this._taskManager = taskManager;
    this._render = render;
  }

  init() {
    let tasksPromise = this._taskManager.getTasks();
    tasksPromise.then(tasks =>
      tasks.forEach(task => {
        this._render.renderTask(task);
      })
    );
  }

  addTask(title) {
    let taskPromise = this._taskManager.createTask(title);
    taskPromise.then(task => this._render.renderTask(task));
  }
}

class Task {
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

  touggle() {
    this._completed = !this._completed;
  }

  copy(){
    return{
      id : this.id,
      title: this.title,
      completed: this.completed,
      creationMoment: this.creationMoment
    }
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
      throw new Error("invalid json: ${json}", error.message);
    }

    return new Task(obj.id, obj.title, obj.completed, obj.creationMoment);
  }
}

class TaskManager {
  constructor(store) {
    if (!(store instanceof AbstractStore)) {
      throw new Error("Store should be implements AbstractStore interface");
    }
    this._store = store;
  }

  createTask(title) {
    let id = Math.random()
      .toString(36)
      .substring(2, 16);
    let task = new Task(id, title);
    return this._store.saveTask(task);
  }

  getTasks() {
    return this._store.getTasks();
  }

  removeTask(id) {
    this._store.removeTask(id);
    this._render.dispose(this._store.getTasks());
  }
}

class AbstractStore {
  getTask(id) {
    throw new Error("Not implemented");
  }

  getTasks() {
    throw new Error("Not implemented");
  }

  saveTask(task) {
    throw new Error("Not implemented");
  }
}

class StoreLS extends AbstractStore {
  constructor() {
    super();
    this._prefix = "strLS";
  }

  getTask(id) {
    let key = this._prefix + id;
    const taskJson = localStorage.getItem(key);
    if (!taskJson) {
      throw new Error("There is no task with id = ${id}");
    }

    let task = null;
    try {
      task = Task.fromJSON(taskJson);
    } catch (error) {
      throw new Error("impossible get task with id = ${id}", error.message);
    }

    return Promise.resolve(task);
  }

  getTasks() {
    const tasks = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key.includes(this._prefix)) {
        let task = null;
        try {
          task = Task.fromJSON(localStorage.getItem(key));
        } catch (error) {
          throw new Error("impossible get task with id = ${id}", error.message);
        }
        tasks.push(task);
      }
    }
    return Promise.resolve(tasks);
  }

  saveTask(task) {
    let key = this._prefix + task.id;
    const json = Task.toJSON(task);
    localStorage.setItem(key, json);
    return Promise.resolve(task.copy());
  }
}

class Store extends AbstractStore {
  constructor() {
    super();
    this._storage = [];
  }

  saveTask(task) {
    let copyTask = task.copy();
    this._storage.push(task);
    return Promise.resolve(copyTask);
  }

  getTasks() {
    return Promise.resolve(
      this._storage.map(task => {
        let taskCopy = null;
        try {
          taskCopy = task.copy();
        } catch (error) {
          throw new Error("impossible get task with id = ${id}", error.message);
        }
        return taskCopy;
      })
    );
  }

  getTask(id) {
    const task = this._storage.find(task => task.id === id);

    if (!task) {
      throw new Error("There is no task with id = ${id}");
    }

    let taskCopy = null;
    try {
      taskCopy = task.copy();
    } catch (error) {
      throw new Error("impossible get task with id = ${id}", error.message);
    }

    return Promise.resolve(taskCopy);
  }
}

class Render {
  renderTask(task) {
    console.log(task);
  }
}

let app = new ToDoApplication();
app.execute();
