// ---------------------------------------------------------------
// UI DE TAREAS (DOM)
// ---------------------------------------------------------------

import { getInitials, getCurrentTimestamp } from "../utils/helpers.js";

export function renderTasks(container, tasks, currentUser) {

    container.innerHTML = "";

    // Si no hay tareas, corta el proceso y lo indica
    if (tasks.length == 0) {
        tasks = null
        // Inserta el nuevo bloque HTML
        tasksNull(container)
        return tasks;
    }

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.classList.add("message-card");

        card.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">${getInitials(currentUser.name)}</div>
                <span class="message-card__username">${task.title}</span>
            </div>
            <span class="message-card__timestamp">${getCurrentTimestamp()}</span>
        </div>
        <div class="message-card__content">
            <p><strong>Descripción:</strong> ${task.description}</p>
            <p><strong>Estado:</strong> ${task.status}</p>
        </div>
        `;

        container.appendChild(card);
    });
}

export function tasksNull(container) {
    container.innerHTML = `
    <div class="messages-empty" id="emptyState">
        <svg class="messages-empty__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p class="messages-empty__text">Aún no hay mensajes</p>
        <p class="messages-empty__subtext">Completa el formulario para agregar tu primer mensaje</p>
    </div>
    `;
}
