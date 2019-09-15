class ToDoApplication {
  constructor() {}

  execute() {
    const store = new StoreJS();
    const render = new Render();
    const taskManager = new TaskManager(store);
    const toDo = new ToDo(taskManager, render);

    let titleInputRef = document.getElementById("title-input");
    let createTaskBtnRef = document.getElementById("create-btn");
    let debugBtnRef = document.getElementById("debug-btn");

    let idInputRef = document.getElementById("id-input");
    let deleteBtnReg = document.getElementById("delete-btn");

    createTaskBtnRef.addEventListener("click", () => {
      toDo.addTask(titleInputRef.value);
    });

    debugBtnRef.addEventListener("click", () => {
      toDo.init();
    });

    deleteBtnReg.addEventListener("click", () => {
      toDo.toggleTask(idInputRef.value);
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

  async addTask(title) {
    let taskPromise = this._taskManager.createTask(title);
    taskPromise.then(task => this._render.renderTask(task));
  }

  deleteTask(id) {
    let promiseTask = this._taskManager.deleteTask(id);
  }

  toggleTask(id) {
    let promiseTask = this._taskManager.toggleTask(id);
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

  deleteTask(id) {
    return this._store.deleteTask(id);
  }

  toggleTask(id) {
    return this._store.toggleTask(id);
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

class StoreJS extends AbstractStore {
  constructor() {
    super();
    this._headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, PATCH"
    };
  }

  async getTask(id) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`);
    return await response.json();
  }

  async getTasks() {
    let response = await fetch("http://localhost:3000/tasks");
    return await response.json();
  }

  async saveTask(task, headers = this._headers) {
    let response = await fetch("http://localhost:3000/tasks", {
      headers,
      method: "POST",
      body: Task.toJSON(task)
    });
    return await response.json();
  }

  async deleteTask(id, headers = this._headers) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`, {
      headers,
      method: "DELETE"
    });
    return await response.json();
  }

  async toggleTask(id, headers = this._headers){
    let task = await this.getTask(id);
    task.completed = !task.completed;
    const response = await fetch(
      `http://localhost:3000/tasks/${id}`,
      {
        headers,
        method: 'PUT',
        body: Task.toJSON(task)
      }
    );  
    return await response.json();
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

  deleteTask(id) {
    let key = this._prefix + id;
    localStorage.removeItem(key);
    return Promise.resolve({});
  }

  async toggleTask(id) {
    let key = this._prefix + id;
    let taskPromise = this.getTask(id);
    let task = await taskPromise.then();
    localStorage.setItem(key, Task.toJSON(task.toggle()));
    return Promise.resolve(task);
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

  deleteTask(id) {
    for (let index = 0; index < this._storage.length; index++) {
      if (this._storage[index].id === id) {
        this._storage.splice(index, 1);
      }
    }
    return Promise.resolve({});
  }

  toggleTask(id) {
    for (let index = 0; index < this._storage.length; index++) {
      if (this._storage[index].id === id) {
        this._storage[index].toggle();
        return Promise.resolve(this._storage[index].copy());
      }
    }
  }
}

class Render {
  renderTask(task) {
    console.log(task);
  }
}

let app = new ToDoApplication();
app.execute();
