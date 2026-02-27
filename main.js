// ---------------------------------------------------------------
// MAIN - CONTROL TOTAL DE LA APP
// ---------------------------------------------------------------

import { validateUserService } from "./services/userService.js";
import { filterTasks, getTasksByUser, saveTask, sortTasks } from "./services/tasksService.js";
import { renderTasks, resetFiltersUI, tasksNull } from "./ui/tasksUI.js";
import { showUserSections, hideUserSections } from "./ui/layoutUI.js";
import { hideEmpty, hideUserUI } from "./ui/uiState.js";
import { getSelectedValues, processTasks } from "./utils/helpers.js";
import { showNotification } from "./ui/notificationsUI.js";
import { generateTasksJSON } from "./services/exportService.js";
import { downloadJSONFile } from "./ui/exportUI.js";

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

//constante boton exportar
const exportTasksBtn = document.getElementById("exportTasksBtn");

let currentUser = null;
let tasksUser = []
let currentFilteredTasks = []; //guarda lo que ve actualmente en tareas 

// Al iniciar solo se ve validación
hideUserSections(userInfo, form, messages);

// ================= VALIDAR USUARIO =================
validateBtn.addEventListener("click", async () => {
    const id = documentoInput.value.trim();

    documentoInput.value = "";
    documentoInput.blur();

    if (!id || isNaN(id)) {
    showNotification("ID inválido. Por favor, ingresa un número.", "warning");
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
        showNotification(`¡Hola de nuevo, ${currentUser.name}!`, "success");
        resetFiltersUI(filterStatus, sortTasksArea)

    } catch (error) {
    showNotification("Usuario no encontrado en la base de datos.", "error");        
    console.log("Se ha presentado un error: " + error)
    }
});

// ================= CREAR TAREA =================
document.getElementById("taskForm").addEventListener("submit", async e => {
    e.preventDefault();

    if (!currentUser)
        showNotification("Primero debes validar tu usuario.", "warning"); 
        return;

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
    showNotification("¡Tarea registrada con éxito!", "success");
    e.target.reset();

    taskTitle.value = ''
    taskDescription.value = ''
    taskStatus.value = ''
});

// ================= FILTRAR Y ORDENAR =================
applyFiltersBtn.addEventListener("click", () => {
    const estados = getSelectedValues(filterStatus);
    const sort = sortTasksArea.value;

    const result = processTasks(tasksUser, estados, sort, filterTasks, sortTasks);

    currentFilteredTasks = result;  

    result.length === 0
        ? tasksNull(container)
        : renderTasks(container, result, currentUser);
});

exportTasksBtn.addEventListener("click", () => {
    // Si no se ha filtrado nada, se usa tasksUser, si ya se filtro, se usa currentFilteredTasks
    const dataToExport = currentFilteredTasks.length > 0 ? currentFilteredTasks : tasksUser;

    if (!currentUser || dataToExport.length === 0) {
        alert("No hay tareas para exportar");
        return;
    }

    const jsonContent = generateTasksJSON(dataToExport);
    const fileName = `tareas_pantalla_${currentUser.name.replace(/\s+/g, '_')}.json`;
    
    downloadJSONFile(jsonContent, fileName);
});