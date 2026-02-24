// ---------------------------------------------------------------
// UI DE TAREAS (DOM)
// ---------------------------------------------------------------

import { getInitials, getCurrentTimestamp } from "../utils/helpers.js";

export function renderTasks(container, tasks, currentUser) {
    container.innerHTML = "";

    if (!tasks.length) {
        container.innerHTML = "<p>No hay tareas</p>";
        return;
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