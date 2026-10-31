// =============================
// PAGE NAVIGATION
// =============================

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

const floatingTimer = document.getElementById("floatingTimer");

navButtons.forEach(function(button) {
button.addEventListener("click", function() {

    const pageName = button.dataset.page;

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    navButtons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (pageName === "home" || pageName === "timer") {
    floatingTimer.classList.remove("visible");
    } else {
    floatingTimer.classList.add("visible");
    }
});

});

floatingTimer.addEventListener("click", function() {
document.querySelector('[data-page="timer"]').click();
});

// =============================
// STUDY TIMER
// =============================

let seconds = Number(localStorage.getItem("studyTime")) || 0;
let interval = null;

const timerDisplay = document.getElementById("timerDisplay");
const dashboardTime = document.getElementById("dashboardTime");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

function updateTimer() {

let hours = Math.floor(seconds / 3600);
let minutes = Math.floor((seconds % 3600) / 60);
let remainingSeconds = seconds % 60;

let formatted =
    String(hours).padStart(2, "0") + "h " +
    String(minutes).padStart(2, "0") + "m " +
    String(remainingSeconds).padStart(2, "0") + "s";

timerDisplay.textContent = formatted;
dashboardTime.textContent = formatted;
floatingTimer.textContent = formatted;

}

// START
startButton.addEventListener("click", function() {

if (interval === null) {

    interval = setInterval(function() {

        seconds++;

        localStorage.setItem("studyTime", seconds);

        updateTimer();

    }, 1000);
}

});

// PAUSE
pauseButton.addEventListener("click", function() {

clearInterval(interval);
interval = null;

});

// RESET
resetButton.addEventListener("click", function() {

clearInterval(interval);
interval = null;

seconds = 0;

localStorage.setItem("studyTime", seconds);

updateTimer();

});

// INITIAL DISPLAY
updateTimer();

// INITIAL FLOATING TIMER DISPLAY
floatingTimer.classList.remove("visible");
// =============================
// BACKLOG MANAGEMENT
// =============================

let backlog = JSON.parse(localStorage.getItem("backlog")) || [];

const backlogInput = document.getElementById("backlogInput");
const addBacklog = document.getElementById("addBacklog");

const backlogList = document.getElementById("backlogList");
const dashboardBacklogList = document.getElementById("dashboardBacklogList");


function saveBacklog() {
    localStorage.setItem("backlog", JSON.stringify(backlog));
}


// DISPLAY BACKLOG ON BOTH PAGES

function displayBacklog() {

    backlogList.innerHTML = "";
    dashboardBacklogList.innerHTML = "";

    const pendingTasks = backlog.filter(task => !task.completed);

    // HOME PAGE DISPLAY

    pendingTasks.forEach(function(task) {

        const item = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        checkbox.addEventListener("change", function() {

            task.completed = true;

            saveBacklog();
            displayBacklog();

        });

        const topicName = document.createElement("span");
        topicName.textContent = task.name;

        item.appendChild(checkbox);
        item.appendChild(topicName);

        dashboardBacklogList.appendChild(item);

    });


    // BACKLOG TAB DISPLAY

    pendingTasks.forEach(function(task) {

        const item = document.createElement("div");

        const topicName = document.createElement("span");
        topicName.textContent = task.name;

        // EDIT BUTTON

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {

            const newName = prompt("Edit your topic:", task.name);

            if (newName !== null && newName.trim() !== "") {

                task.name = newName.trim();

                saveBacklog();
                displayBacklog();

            }

        });

        // DELETE BUTTON

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            backlog = backlog.filter(item => item !== task);

            saveBacklog();
            displayBacklog();

        });

        item.appendChild(topicName);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        backlogList.appendChild(item);

    });

}


// ADD NEW TOPIC

addBacklog.addEventListener("click", function() {

    const topic = backlogInput.value.trim();

    if (topic === "") {
        return;
    }

    backlog.push({
        name: topic,
        completed: false
    });

    saveBacklog();
    displayBacklog();

    backlogInput.value = "";

});


// INITIAL DISPLAY

displayBacklog();
// =============================
// IMPORTANT NOTES MANAGEMENT
// =============================

let notes = JSON.parse(localStorage.getItem("importantNotes")) || [];

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNote = document.getElementById("addNote");

const notesList = document.getElementById("notesList");
const dashboardNotesList = document.getElementById("dashboardNotesList");

// SAVE NOTES
function saveNotes() {
localStorage.setItem("importantNotes", JSON.stringify(notes));
}

// DISPLAY NOTES
function displayNotes() {

notesList.innerHTML = "";
dashboardNotesList.innerHTML = "";

notes.forEach(function(note, index) {

    // HOME PAGE DISPLAY
    const homeItem = document.createElement("li");
    homeItem.textContent = note.title;
    dashboardNotesList.appendChild(homeItem);

    // IMPORTANT NOTES TAB DISPLAY
    const item = document.createElement("div");

    const details = document.createElement("div");
    details.className = "note-details";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    details.appendChild(title);
    details.appendChild(content);

    // EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {

        const newTitle = prompt("Edit topic:", note.title);

        if (newTitle === null || newTitle.trim() === "") {
            return;
        }

        const newContent = prompt("Edit note:", note.content);

        if (newContent === null || newContent.trim() === "") {
            return;
        }

        note.title = newTitle.trim();
        note.content = newContent.trim();

        saveNotes();
        displayNotes();
    });

    // DELETE BUTTON
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        notes.splice(index, 1);
        saveNotes();
        displayNotes();
    });

    item.appendChild(details);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    notesList.appendChild(item);
});

}

// ADD NEW NOTE
addNote.addEventListener("click", function() {

const title = noteTitle.value.trim();
const content = noteContent.value.trim();

if (title === "" || content === "") {
    return;
}

notes.push({
    title: title,
    content: content
});

saveNotes();
displayNotes();

noteTitle.value = "";
noteContent.value = "";

});

// INITIAL DISPLAY
displayNotes();
// =============================
// TODAY'S TASKS MANAGEMENT
// =============================

let tasks = JSON.parse(localStorage.getItem("dailyTasks")) || [];

const taskChapter = document.getElementById("taskChapter");
const taskTopic = document.getElementById("taskTopic");
const addTask = document.getElementById("addTask");

const taskManagementList = document.getElementById("taskManagementList");
const dashboardTaskList = document.getElementById("dashboardTaskList");

// SAVE TASKS
function saveTasks() {
localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

// DISPLAY TASKS
function displayTasks() {

taskManagementList.innerHTML = "";
dashboardTaskList.innerHTML = "";

// Pending tasks first, completed tasks last
const sortedTasks = [
    ...tasks.filter(task => !task.completed),
    ...tasks.filter(task => task.completed)
];

sortedTasks.forEach(function(task) {

    // HOME PAGE CARD
    const card = document.createElement("div");
    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function() {
        task.completed = checkbox.checked;
        saveTasks();
        displayTasks();
    });

    const chapter = document.createElement("h3");
    chapter.textContent = task.chapter;

    const topic = document.createElement("p");
    topic.textContent = task.topic;

    card.appendChild(checkbox);
    card.appendChild(chapter);
    card.appendChild(topic);

    dashboardTaskList.appendChild(card);


    // MANAGEMENT PAGE
    const item = document.createElement("div");
    item.className = "task-management-item";

    const details = document.createElement("div");

    const chapterName = document.createElement("h3");
    chapterName.textContent = task.chapter;

    const topicName = document.createElement("p");
    topicName.textContent = task.topic;

    details.appendChild(chapterName);
    details.appendChild(topicName);

    // EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {

        const newChapter = prompt("Edit chapter:", task.chapter);

        if (newChapter === null || newChapter.trim() === "") {
            return;
        }

        const newTopic = prompt("Edit topic:", task.topic);

        if (newTopic === null || newTopic.trim() === "") {
            return;
        }

        task.chapter = newChapter.trim();
        task.topic = newTopic.trim();

        saveTasks();
        displayTasks();
    });

    // DELETE BUTTON
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        tasks = tasks.filter(item => item !== task);
        saveTasks();
        displayTasks();
    });

    item.appendChild(details);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    taskManagementList.appendChild(item);
});

}

// ADD TASK
addTask.addEventListener("click", function() {

const chapter = taskChapter.value.trim();
const topic = taskTopic.value.trim();

if (chapter === "" || topic === "") {
    return;
}

tasks.push({
    chapter: chapter,
    topic: topic,
    completed: false
});

saveTasks();
displayTasks();

taskChapter.value = "";
taskTopic.value = "";

});

// INITIAL DISPLAY
displayTasks();
// =============================
// ENTER KEY SUPPORT
// =============================

// BACKLOG
backlogInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addBacklog.click();
    }
});

// IMPORTANT NOTES
noteTitle.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addNote.click();
        noteContent.focus();
    }
});

noteContent.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addNote.click();
    }
});

// TODAY'S TASKS
taskChapter.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        taskTopic.focus();
    }
});

taskTopic.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask.click();
        taskChapter.focus();
    }
});
