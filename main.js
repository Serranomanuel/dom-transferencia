// ---------------------------------------------------------------
// MAIN - CONTROL TOTAL DE LA APP
// ---------------------------------------------------------------

import { validateUserService } from "./services/userService.js";
import { getTasksByUser, saveTask } from "./services/tasksService.js";
import { renderTasks } from "./ui/tasksUI.js";
import { showUserSections, hideUserSections } from "./ui/layoutUI.js";

const validateBtn = document.getElementById("validateBtn");
const documentoInput = document.getElementById("documento");

const userInfo = document.getElementById("userInfo");
const form = document.getElementById("task-section");
const messages = document.getElementById("messages-section");

const container = document.getElementById("messagesContainer");
const nameDisplay = document.getElementById("userNameDisplay");
const emailDisplay = document.getElementById("userEmailDisplay");

let currentUser = null;

// 🔒 Al iniciar solo se ve validación
hideUserSections(userInfo, form, messages);

// ================= VALIDAR USUARIO =================
validateBtn.addEventListener("click", async () => {
    const id = documentoInput.value.trim();

    if (!id || isNaN(id)) {
        alert("ID inválido");
        return;
    }

    try {
        currentUser = await validateUserService(id);

        nameDisplay.textContent = currentUser.name;
        emailDisplay.textContent = currentUser.email;

        showUserSections(userInfo, form, messages);

        const tasks = await getTasksByUser(currentUser.id);
        renderTasks(container, tasks, currentUser);

    } catch {
        alert("Usuario no encontrado");
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

    const tasks = await getTasksByUser(currentUser.id);
    renderTasks(container, tasks, currentUser);
});