// ---------------------------------------------------------------
// API DE TAREAS
// ---------------------------------------------------------------

export async function fetchTasks() {
    const res = await fetch(`http://localhost:3000/tasks`);
    if (!res.ok) throw new Error("Error cargando tareas");
    return res.json();
}

export async function createTask(task) {
    const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    if (!res.ok) throw new Error("Error al registrar tarea");
    return res.json();
}