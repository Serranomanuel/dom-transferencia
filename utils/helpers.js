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