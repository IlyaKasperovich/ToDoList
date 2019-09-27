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

    const store = new Store();
    const render = new RealRender(taskContainer);
    const taskManager = new TaskManager(store);
    const toDo = new ToDo(taskManager, render);

    render.deleteTaskFunction = toDo.deleteTask.bind(toDo);
    render.toggleTaskFunction = toDo.toggleTask.bind(toDo);

    let titleInputRef = document.querySelector(".todo-app__input");
    let createTaskBtnRef = document.querySelector(
      ".todo-app__input-content .button"
    );

    createTaskBtnRef.addEventListener("click", () => {
      toDo.addTask(titleInputRef.value);
      titleInputRef.value = "";
    });

    document.addEventListener("keyup", event => {
      if (event.keyCode == 13) {
        createTaskBtnRef.click();
      }
    });

    $("#button1").click(function() {
      alert("Button works!");
    });

    toDo.init();
  }
}

let app = new ToDoApplication();
app.execute();
