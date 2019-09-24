import { Render } from "./render";
import { RealRender } from "./render";
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
    
    let taskContainer = document.querySelector(".todo-app__tasks");

    const store = new StoreJS();
    const render = new RealRender(taskContainer);
    const taskManager = new TaskManager(store);
    const toDo = new ToDo(taskManager, render);

    render.deleteTaskFunction = toDo.deleteTask.bind(toDo);
    render.toggleTaskFunction = toDo.toggleTask.bind(toDo);


    let titleInputRef = document.querySelector(".todo-app__input");
    let createTaskBtnRef = document.querySelector(".todo-app__input-content .button");
    // let debugBtnRef = document.getElementById("debug-btn");

    // let idInputRef = document.getElementById("id-input");
    // let deleteBtnReg = document.getElementById("delete-btn");

    createTaskBtnRef.addEventListener("click", () => {
      toDo.addTask(titleInputRef.value);
      titleInputRef.value = "";
    });

    // debugBtnRef.addEventListener("click", () => {
    //   toDo.init();
    // });
    // deleteBtnReg.addEventListener("click", () => {
    //   toDo.deleteTask(idInputRef.value);
    // });

    toDo.init();
  }
}

let app = new ToDoApplication();
app.execute();
