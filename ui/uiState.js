// ---------------------------------------------------------------
// CONTROL VISUAL DE SECCIONES
// ---------------------------------------------------------------

export function showUserUI(userInfo, form, messages) {
    userInfo.classList.remove("hidden");
    form.classList.remove("hidden");
    messages.classList.remove("hidden");
}

export function hideUserUI(userInfo, form, messages) {
    userInfo.classList.add("hidden");
    form.classList.add("hidden");
    messages.classList.add("hidden");
}

export function showEmpty(emptyState) {
    emptyState.classList.remove("hidden");
}

export function hideEmpty(emptyState) {
    emptyState.classList.add("hidden");
}

/**
 * Muestra un mensaje de error en un elemento específico
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error a mostrar
 */
export function showError(errorElement, message) {
    errorElement.textContent = message;
}

/**
 * Limpia el mensaje de error de un elemento específico
 * @param {HTMLElement} errorElement - Elemento del que limpiar el error
 */
export function clearError(errorElement) {
    errorElement.textContent = '';
}