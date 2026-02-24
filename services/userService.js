// ---------------------------------------------------------------
// SERVICIO DE USUARIO
// ---------------------------------------------------------------

import { fetchUserById } from "../api/usersApi.js";

export async function validateUserService(id) {
    const user = await fetchUserById(id);
    return { ...user, id: String(user.id) };
}