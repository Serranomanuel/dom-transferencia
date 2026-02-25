// ---------------------------------------------------------------
// MAIN - CONTROL TOTAL DE LA APP
// ---------------------------------------------------------------

import { validateUserService } from "./services/userService.js";
import { filterTasks, getTasksByUser, saveTask, sortTasks } from "./services/tasksService.js";
import { renderTasks, resetFiltersUI, tasksNull } from "./ui/tasksUI.js";
import { showUserSections, hideUserSections } from "./ui/layoutUI.js";
import { hideEmpty, hideUserUI } from "./ui/uiState.js";
import { getSelectedValues, processTasks } from "./utils/helpers.js";

const validateBtn = document.getElementById("validateBtn");
const documentoInput = document.getElementById("documento");

const userInfo = document.getElementById("userInfo");
const form = document.getElementById("task-section");
const messages = document.getElementById("messages-section");

const container = document.getElementById("messagesContainer");
const nameDisplay = document.getElementById("userNameDisplay");
const emailDisplay = document.getElementById("userEmailDisplay");

const emptyState = document.getElementById("emptyState");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription")
const taskStatus = document.getElementById("taskStatus")

const messagesFilters = document.getElementById("messagesFilters")

// Area de filtro y orden
const sortTasksArea = document.getElementById('sortTasks')
const applyFiltersBtn = document.getElementById('applyFiltersBtn')
const filterStatus = document.querySelectorAll(".filterStatus")

let currentUser = null;
let tasksUser = []

// Al iniciar solo se ve validación
hideUserSections(userInfo, form, messages);

// ================= VALIDAR USUARIO =================
validateBtn.addEventListener("click", async () => {
    const id = documentoInput.value.trim();

    if (!id || isNaN(id)) {
        alert("ID inválido");
        return;
    }

    try {
        tasksUser = []
        currentUser = null
        currentUser = await validateUserService(id);

        if (currentUser == null) {
            hideUserUI(userInfo, form, messages);
            alert("Usuario no registrado")
            console.log("Usuario no registrado")
            return;
        }

        nameDisplay.textContent = currentUser.name;
        emailDisplay.textContent = currentUser.email;

        showUserSections(userInfo, form, messages);

        tasksUser = await getTasksByUser(currentUser.id, container, messagesFilters);

        if (tasksUser.length == 0) {
            hideEmpty(messagesFilters)
            tasksNull(container)
        } else {
            renderTasks(container, tasksUser, currentUser);
        }

        resetFiltersUI(filterStatus, sortTasksArea)

    } catch (error) {
        alert("Usuario no encontrado");
        console.log("Se ha presentado un error: " + error)
    }
});

// ================= CREAR TAREA =================
document.getElementById("taskForm").addEventListener("submit", async e => {
    e.preventDefault();

    if (!currentUser) return alert("Primero valida usuario");

    const task = {
        userId: currentUser.id,
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        status: taskStatus.value,
        createdAt: new Date().toISOString()
    };

    await saveTask(task);

    tasksUser = await getTasksByUser(currentUser.id, emptyState);
    renderTasks(container, tasksUser, currentUser, emptyState, messagesFilters);

    taskTitle.value = ''
    taskDescription.value = ''
    taskStatus.value = ''
});

// ================= FILTRAR Y ORDENAR =================
applyFiltersBtn.addEventListener("click", () => {
    const estados = getSelectedValues(filterStatus);
    const sort = sortTasksArea.value;

    const result = processTasks(tasksUser, estados, sort, filterTasks, sortTasks);

    result.length === 0
        ? tasksNull(container)
        : renderTasks(container, result, currentUser);
});