const STORAGE_KEY = "todoListTasks";
let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const errorMsg = document.getElementById("errorMsg");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    
  }
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (text === "") {
    showError("Please enter a task. It cannot be empty or only spaces.");
    return;
  }

  tasks.push({ id: Date.now(), text: text, completed: false });
  taskInput.value = "";
  clearError();
  saveTasks();
  render();
  taskInput.focus();
});

taskInput.addEventListener("input", clearError);

function showError(message) {
  errorMsg.textContent = message;
  taskInput.classList.add("is-invalid");
  taskInput.focus();
}

function clearError() {
  taskInput.classList.remove("is-invalid");
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    render();
  });
});

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (t) { return !t.completed; });
  }
  if (currentFilter === "completed") {
    return tasks.filter(function (t) { return t.completed; });
  }
  return tasks;
}

clearCompletedBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  render();
});

function updateCounter() {
  const remaining = tasks.filter(function (t) { return !t.completed; }).length;
  taskCounter.textContent = remaining + " remaining";
}

function render() {
  taskList.innerHTML = "";
  const visible = getVisibleTasks();

  visible.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "list-group-item task-item" + (task.completed ? " completed" : "");

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input mt-0";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () { toggleTask(task.id); });

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text; 

    label.appendChild(checkbox);
    label.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", function () { deleteTask(task.id); });

    li.appendChild(label);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  const isEmpty = visible.length === 0;
  taskList.classList.toggle("d-none", isEmpty);
  emptyMsg.classList.toggle("d-none", !isEmpty);
  emptyMsg.textContent = tasks.length === 0
    ? "No tasks yet. Add your first task!"
    : "No " + currentFilter + " tasks to show.";

  updateCounter();
}

render();
