// ---------------------------------------------------------------
// API DE USUARIOS
// ---------------------------------------------------------------

export async function fetchUserById(id) {
    const response = await fetch(`http://localhost:3000/users/${id}`);
    if (!response.ok) {
        return null
    } else {
        return response.json();
    }
}