// ---------------------------------------------------------------
// CONTROL DE VISIBILIDAD DE SECCIONES
// ---------------------------------------------------------------

export function showUserSections(userInfo, form, messages) {
    userInfo.classList.remove("hidden");
    form.classList.remove("hidden");
    messages.classList.remove("hidden");
}

export function hideUserSections(userInfo, form, messages) {
    userInfo.classList.add("hidden");
    form.classList.add("hidden");
    messages.classList.add("hidden");
}