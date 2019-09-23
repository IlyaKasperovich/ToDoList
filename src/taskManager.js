import { AbstractStore } from "./store";
import { Task } from "./task";


export class TaskManager {
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

export class LoggerableTaskManager extends TaskManager {
  constructor(store, logger) {
    super(...arguments);
    this._logger = logger;
  }

  async createTask(title) {
    let result = await super.createTask(title);
    this._logger.log(`created task ${title}`);
    return result;
  }

  getTasks() {
    return super.getTasks();
  }

  async deleteTask(id) {
    let result = await super.deleteTask(id);
    this._logger.log(`deleted task id: ${id}`);
    return result;
  }

  async toggleTask(id) {
    let result = await super.toggleTask(id);
    this._logger.log(`toggled task id: ${id}`);
    return result;
  }

  getLogs() {
    return this._logger.history;
  }
}
