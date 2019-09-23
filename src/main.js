import { Render } from "./render";
import { AbstractStore } from "./store";
import { StoreJS } from "./store";
import { StoreLS } from "./store";
import { Store } from "./store";
import { Logger } from "./logger";
import { LoggerWithHistory } from "./logger";
import { Task } from "./task";
import { TaskManager } from "./taskManager";
import { LoggerableTaskManager } from "./taskManager";
import { ToDo } from "./todo";

class ToDoApplication {
  constructor() {}

  execute() {
    const store = new StoreJS();
    const render = new Render();
    const taskManager = new LoggerableTaskManager(
      store,
      new Logger({ level: "debug" })
    );
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
      toDo.deleteTask(idInputRef.value);
    });

    toDo.init();
  }
}

let app = new ToDoApplication();
app.execute();
