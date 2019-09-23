export class ToDo {
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
