// ---------------------------------------------------------------
// SERVICIO DE TAREAS (LÓGICA)
// ---------------------------------------------------------------

import { fetchTasks, createTask } from "../api/tasksApi.js";
import { tasksNull } from "../ui/tasksUI.js";

export async function getTasksByUser(userId, container) {
    const tasks = await fetchTasks();

    if (!tasks.ok) {
        tasksNull(container)
    }

    return tasks.filter(t => t.userId === userId);
}

export async function saveTask(task) {
    return createTask(task);
}