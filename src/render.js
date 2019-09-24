class AbstractRender {
  renderTask(task){
    throw new Error ("not implemented");
  }
}

export class Render extends AbstractRender {
  constructor(){    
    super();
  }
  renderTask(task) {
    console.log(task);
  }
}

export class RealRender extends AbstractRender {
  constructor(taskContainer){
    super();
    this._taskContainer = taskContainer;
  }

  set deleteTaskFunction(func){
    this._deleteTaskFunction = func;
  }

  set toggleTaskFunction(func){
    this._toggleTaskFunction = func;
  }

  deleteTask(id){
    let div = this._taskContainer.querySelector(`#${id}`);
    div.remove();
  }

  toggleTask(id){
    let task = this._taskContainer.querySelector(`#${id}`);

    if(task.getAttribute("class") === "task"){
      task.removeAttribute("class");
      task.setAttribute("class","task task_toggled");
    } else if(task.getAttribute("class") === "task task_toggled"){
      task.setAttribute("class","task");
    }
  }

  renderTask(task){
    let div = document.createElement("div");
    if(!task.completed){
      div.setAttribute("class","task");
    } else{
      div.setAttribute("class","task task_toggled");
    }
    div.setAttribute("id",`${task.id}`);

    let p = document.createElement("p");
    p.setAttribute("class", "task__title");
    p.innerText = task.title;

    let toggleBtn = document.createElement("button");
    toggleBtn.setAttribute("class","button");
    toggleBtn.innerText = "Complete";

    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class","button");
    deleteBtn.innerText = "Delete";

    div.addEventListener("click", (event)=>{
      let target = event.target;

      if(target.getAttribute("class") === "button" && target.innerText === "Delete"){
        this._deleteTaskFunction(task.id);
        this.deleteTask(task.id);
      }

      if(target.getAttribute("class") === "button" && target.innerText === "Complete"){
        this._toggleTaskFunction(task.id);
        this.toggleTask(task.id);
      }
    })

    div.append(p,toggleBtn, deleteBtn);
    this._taskContainer.append(div);
  }
}