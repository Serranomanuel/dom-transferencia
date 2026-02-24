// ---------------------------------------------------------------
// SERVICIO DE TAREAS (LÓGICA)
// ---------------------------------------------------------------

import { fetchTasks, createTask } from "../api/tasksApi.js";

export async function getTasksByUser(userId) {
    const tasks = await fetchTasks();
    return tasks
        .filter(t => String(t.userId) === String(userId))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function saveTask(task) {
    return createTask(task);
}