// ---------------------------------------------------------------
// FUNCIONES AUXILIARES REUTILIZABLES
// ---------------------------------------------------------------

export function isValidInput(value) {
    return value.trim().length > 0;
}

export function getCurrentTimestamp() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('es-ES', options);
}

export function getInitials(name) {
    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/);

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return words.map(w => w[0]).join('').toUpperCase();
}

/**
 * Obtiene valores de checkboxes seleccionados
 * @param {NodeList} checkboxes 
 * @returns {Array}
 */
export const getSelectedValues = (checkboxes) =>
    [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);

/**
 * Combina el filtrado y ordenamiento de tareas en un solo proceso.
 * 
 * @param {Array} tasks Lista completa de tareas del usuario
 * @param {Array} estados Estados seleccionados en los checkboxes
 * @param {string} sort Criterio de orden seleccionado en el select
 * @param {Function} filterFn Función encargada de filtrar tareas
 * @param {Function} sortFn Función encargada de ordenar tareas
 * @returns {Array} Lista final de tareas procesadas
 */
export const processTasks = (tasks, estados, sort, filterFn, sortFn) => {

    // Si hay estados seleccionados, filtra; si no, usa la lista original
    const filtered = estados.length > 0 ? filterFn(tasks, estados) : tasks;

    // Si hay criterio de orden, ordena; si no, devuelve las tareas filtradas
    return sort ? sortFn(filtered, sort) : filtered;
};