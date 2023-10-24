//  Находим элемент на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    renderTask(task);
  });
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

//  Функции
function addTask(event) {
  //  Отменяет отправку формиы
  event.preventDefault();

  //  Достать текст задачи из поля для ввода.
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в масив сзадачей
  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  //  Очишяем поля ввода и возврашем на него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  //  Verificam daca click nu este pe butonul de sters din lista
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  //Gasim ID zadaci
  const id = Number(parentNode.id);

  //stergem prin filtrarea in masiv

  tasks = tasks.filter(function (task) {
    if (task.id === id) {
      return false;
    } else {
      return true;
    }
  });

  saveToLocalStorage();

  //Stergem din lista
  parentNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  //  Verificam daca click nu este pe butonul de done din lista
  if (event.target.dataset.action !== "done") return;

  // Daca click a fost pe butodul done
  const parentNode = event.target.closest(".list-group-item");

  // Gasim ID
  const id = Number(parentNode.id);
  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
    <li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
      <div class="empty-list__title">Список дел пуст</div>
    </li>
  `;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // Am format CSS class
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //  Форматируем разметку для новой задачи
  const taskHTML = `
<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
    </button>
    <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
    </button>
  </div>
</li>
`;

  //  Добавляем на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
//!-------------------------------------------------------------------------------
// ? Aici e o metoda de a salva tot HTML in Local Storage
// if (localStorage.getItem("tasksHTML")) {
//   tasksList.innerHTML = localStorage.getItem("tasksHTML");
// }

// function saveHtmltoLS() {
//   localStorage.setItem("tasksHTML", tasksList.innerHTML);
// }
