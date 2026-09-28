const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const taskCounter = document.getElementById("taskCounter");
const progressBar = document.getElementById("progressBar");
const clearCompletedButton = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const currentDate = document.getElementById("currentDate");

let tasks = loadTasks();
let currentFilter = "all";


function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return [];
}


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent =
            "Please enter a task before adding it.";

        taskInput.classList.remove("input-error");

        void taskInput.offsetWidth;

        taskInput.classList.add("input-error");

        taskInput.focus();

        return;
    }

    taskInput.classList.remove("input-error");

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    errorMessage.textContent = "";

    taskInput.focus();
}


function toggleTask(id) {
    tasks = tasks.map(function(task) {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


function clearCompletedTasks() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
}


function getFilteredTasks() {

    if (currentFilter === "active") {
        return tasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        return tasks.filter(function(task) {
            return task.completed;
        });
    }

    return tasks;
}


function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(function(task) {

        const listItem = document.createElement("li");

        listItem.className = "task-item";


        if (task.completed) {
            listItem.classList.add("completed");
        }


        const checkbox = document.createElement("button");

        checkbox.className = "task-checkbox";

        checkbox.type = "button";

        checkbox.setAttribute(
            "aria-label",
            task.completed
                ? "Mark task as incomplete"
                : "Mark task as complete"
        );

        checkbox.textContent =
            task.completed ? "✓" : "";


        checkbox.addEventListener("click", function() {
            toggleTask(task.id);
        });


        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.type = "button";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task"
        );

        deleteButton.textContent = "×";


        deleteButton.addEventListener(
            "click",
            function() {
                deleteTask(task.id);
            }
        );


        listItem.appendChild(checkbox);

        listItem.appendChild(taskText);

        listItem.appendChild(deleteButton);


        taskList.appendChild(listItem);
    });


    updateInterface(filteredTasks);
}


function updateInterface(filteredTasks) {

    const completedTasks =
        tasks.filter(function(task) {
            return task.completed;
        }).length;


    const taskWord =
        tasks.length === 1
            ? "task"
            : "tasks";


    taskCounter.textContent =
        tasks.length +
        " " +
        taskWord +
        " · " +
        completedTasks +
        " completed";


    const progress =
        tasks.length === 0
            ? 0
            : (completedTasks / tasks.length) * 100;


    progressBar.style.width =
        progress + "%";


    if (tasks.length === 0) {

        emptyState.style.display = "block";

        emptyState.querySelector("h2").textContent =
            "Nothing here yet";

        emptyState.querySelector("p").textContent =
            "Add your first task and make today productive.";

    }

    else if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        emptyState.querySelector("h2").textContent =
            "No tasks here";

        emptyState.querySelector("p").textContent =
            "Try another filter to see your tasks.";

    }

    else {

        emptyState.style.display = "none";

    }


    clearCompletedButton.style.display =
        completedTasks > 0
            ? "block"
            : "none";
}


function changeFilter(event) {

    filterButtons.forEach(
        function(button) {

            button.classList.remove("active");

        }
    );


    event.target.classList.add("active");


    currentFilter =
        event.target.dataset.filter;


    renderTasks();
}


function displayDate() {

    const today = new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );
}


/* EVENTS */

taskForm.addEventListener(
    "submit",
    addTask
);


clearCompletedButton.addEventListener(
    "click",
    clearCompletedTasks
);


filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            changeFilter
        );

    }
);


/* START APPLICATION */

displayDate();

renderTasks();