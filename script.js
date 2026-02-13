/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Objetivo: Aplicar conceptos del DOM para seleccionar elementos,
 * responder a eventos y crear nuevos elementos dinámicamente.
 * 
 * Autor: Jhon Bueno & Dario Herrera
 * Fecha: 11/02/26
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */
const documentoInput = document.getElementById('documento');
// Boton de validacion de usuario
const validateBtn = document.getElementById('validateBtn');

// Formulario principal
const formulario = document.getElementById(`task-section`)
const areaMensajes = document.getElementById(`messages-section`)

const userInfoSection = document.getElementById('userInfo');
const userNameDisplay = document.getElementById('userNameDisplay');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');
const userNameError = document.getElementById('userNameError');
const userMessageError = document.getElementById('userMessageError');

const messagesContainer = document.getElementById('messagesContainer');
const emptyState = document.getElementById('emptyState');
const messageCount = document.getElementById('messageCount');

// ===============
// FORM PRINCIPAL
// ===============
// form total
const taskForm = document.getElementById('taskForm');
// input del titulo
const taskTitleInput = document.getElementById('taskTitle');
// input de la descripcion
const taskDescriptionInput = document.getElementById('taskDescription');
// input del statud
const taskStatusInput = document.getElementById('taskStatus');
// Boton submit del form principal
const btnPrimary = document.getElementById((`btn--primary`))

// sitio si hay un error en el titulo
const taskTitleError = document.getElementById('taskTitleError');
// sitio si hay un error en la descripcion
const taskDescriptionError = document.getElementById('taskDescriptionError');
// sitio si hay un error en el status
const taskStatusError = document.getElementById('taskStatusError');


// =============================
// ESTADO GLOBAL
// =============================

let currentUser = null;
let totalMessages = 0;



// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

/**
 * Valida que un campo no esté vacío ni contenga solo espacios en blanco
 * @param {string} value - El valor a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
function isValidInput(value) {
    return value.trim().length > 0;
}

/**
 * Valida que un campo no esté vacío, no contenga espacios en blanco y contenga solo letras y números
 * @param {string} value - El valor a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
function isValidAlphanumericInput(value) {
    const trimmed = value.trim();
    return trimmed.length > 0 && /^[a-zA-Z0-9]+$/.test(trimmed);
}

/**
 * Muestra un mensaje de error en un elemento específico
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(errorElement, message) {
    errorElement.textContent = message;
}

/**
 * Limpia el mensaje de error de un elemento específico
 * @param {HTMLElement} errorElement - Elemento del que limpiar el error
 */
function clearError(errorElement) {
    errorElement.textContent = '';
}

/**
 * Valida todos los campos del formulario
 * @returns {boolean} - true si todos los campos son válidos, false si alguno no lo es
 */
function validateForm() {
    let isValid = true;

    if (!isValidInput(taskTitleInput.value)) {
        showError(taskTitleError, 'El título no puede estar vacío.');
        isValid = false;
    } else {
        clearError(taskTitleError);
    }

    if (!isValidInput(taskDescriptionInput.value)) {
        showError(taskDescriptionError, 'La descripción no puede estar vacía.');
        isValid = false;
    } else {
        clearError(taskDescriptionError);
    }

    if (!isValidInput(taskStatusInput.value)) {
        showError(taskStatusError, 'Debes seleccionar un estado.');
        isValid = false;
    } else {
        clearError(taskStatusError);
    }

    return isValid;
}

/**
 * Obtiene la fecha y hora actual formateada
 * @returns {string} - Fecha y hora en formato legible
 */
function getCurrentTimestamp() {
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

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales en mayúsculas
 */
function getInitials(name) { // IDK
    // Eliminar espacios en blanco al inicio y al final del nombre
    const trimmedName = name.trim();
    // Separar el nombre en palabras usando expresiones regulares para manejar múltiples espacios
    const words = trimmedName.split(/\s+/);
    // Si hay solo una palabra, retornar las dos primeras letras en mayúsculas
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    } else {
        // Si hay múltiples palabras, tomar la primera letra de cada una, unirlas y convertir a mayúsculas
        return words.map(word => word[0]).join('').toUpperCase();
    }
}

/**
 * Actualiza el contador de mensajes
 */
function updateMessageCount() {
    // Cambia el texto del span con id="messageCount"
    messageCount.textContent = `${totalMessages} mensaje${totalMessages !== 1 ? 's' : ''}`;
}


/**
 * Oculta el estado vacío (mensaje cuando no hay mensajes)
 */
function hideEmptyState() { // Que ya no esta en el showError del spam?
    // TODO: Implementar función para ocultar el estado vacío
    // Pista: Agrega la clase 'hidden' al elemento emptyState
}

/**
 * Muestra el estado vacío (mensaje cuando no hay mensajes)
 */
function showEmptyState() { // Que ya no esta en el showError del spam?
    // TODO: Implementar función para mostrar el estado vacío
    // Pista: Remueve la clase 'hidden' del elemento emptyState
}

/**
 * Valida un usuario consultando la API mediante el ID ingresado.
 * Si el usuario existe, muestra su información y habilita el formulario junto con sus respectiva informacion.
 * Si no existe, muestra un mensaje de error y deshabilita el formulario.
 */
async function validateUser() {
    const id = documentoInput.value.trim();

    // Validación inicial: solo números y no vacío
    if (!id || isNaN(id)) {
        alert("Debe ingresar un ID válido (solo números).");
        documentoInput.value = "";
        documentoInput.focus();

        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);

        if (!response.ok) {
            throw new Error("Usuario no encontrado");
        }

        const user = await response.json();
        currentUser = user;

        // Mostrar info
        userNameDisplay.textContent = user.name;
        userEmailDisplay.textContent = user.email;

        userInfoSection.classList.remove('hidden');
        formulario.classList.remove('hidden');
        areaMensajes.classList.remove('hidden');

        // Confirmacion y saludo para el usuario
        alert(`Hola ${user.name}.`);

        console.log(currentUser)
        // Limpiar input después de enviar la info
        documentoInput.value = "";

    } catch (error) {
        currentUser = null;

        // Ocultar secciones
        userInfoSection.classList.add('hidden');
        formulario.classList.add('hidden');
        areaMensajes.classList.add('hidden');

        alert("Usuario no encontrado.");

        // Limpiar y reenfocar input
        documentoInput.value = "";
        documentoInput.focus();
    }
}





// ============================================
// 3. CREACIÓN DE ELEMENTOS
// ============================================

/**
 * Crea un nuevo elemento de mensaje en el DOM
 * @param {string} userName - Nombre del usuario
 * @param {string} message - Contenido del mensaje
 */
function createMessageElement(tituloForm, descripcionForm, estadoForm) {
    // PASO 1: Crear el contenedor principal del mensaje
    const messageCard = document.createElement('div');
    messageCard.classList.add('message-card');

    // PASO 2: Crear la estructura interna del mensaje
    const timestamp = getCurrentTimestamp();

    messageCard.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">${tituloForm.substring(0,2).toUpperCase()}</div>
                <span class="message-card__username">${tituloForm}</span>
            </div>
            <span class="message-card__timestamp">${timestamp}</span>
        </div>
        <div class="message-card__content">
            <p><strong>Descripción:</strong> ${descripcionForm}</p>
            <p><strong>Estado:</strong> ${estadoForm}</p>
        </div>
    `;

    // PASO 3: Insertar el nuevo elemento en el contenedor de mensajes
    messagesContainer.insertBefore(messageCard, messagesContainer.firstChild);

    // PASO 4: Incrementar el contador de mensajes
    totalMessages++;

    // PASO 5: Actualizar el contador visual
    updateMessageCount();

    // PASO 6: Ocultar el estado vacío si está visible
    hideEmptyState();
}




async function handleTaskSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
        alert("Primero debes validar un usuario.");
        return;
    }

    if (!validateForm()) {
        return;
    }

    const newTask = {
        userId: currentUser.id,
        title: taskTitleInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        status: taskStatusInput.value
    };

    try {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });

        if (!response.ok) throw new Error("Error al registrar la tarea");

        const savedTask = await response.json();
        console.log("✅ Tarea registrada:", savedTask);

        // Aquí puedes crear un elemento en el DOM para mostrar la tarea
        displayTask(savedTask);

        taskForm.reset();
    } catch (error) {
        alert("No se pudo registrar la tarea.");
        console.error(error);
    }
}





// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

/**
 * Maneja el evento de envío del formulario
 * @param {Event} event - Evento del formulario
*/
function handleFormSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
        alert("Primero debes validar un usuario.");
        return;
    }

    if (!validateForm()) {
        return;
    }


    // VALIDAR AQUI LOS DATOS LOS CUALES INGRESE EL USUARIO COMO LO SERIA EL TITULO, DESC Y ESTADO
    const tituloForm = taskTitleInput.value.trim();
    const descripcionForm = taskDescriptionInput.value.trim();
    const estadoForm = taskStatusInput.value.trim();

    // CREA EL MENSAJE CON AGREGANDO LOS 3 PRINCIPALES
    createMessageElement(tituloForm, descripcionForm, estadoForm);

    // Limpia el area de notas
    taskTitleInput.reset();
    taskDescriptionInput.reset();
    taskStatusInput.reset();

    // Re direcciona al titulo de la tarea
    taskTitleInput.focus();
}


/**
 * Limpia los errores cuando el usuario empieza a escribir
*/
function handleInputChange() {
    // TODO: Implementar limpieza de errores al escribir
    // Esta función se ejecuta cuando el usuario escribe en un campo
    // Debe limpiar el error de ese campo específico
}


// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================



// Evento para confirmar si se encuentra al usuario
validateBtn.addEventListener("click", validateUser);



/**
 * Aquí registramos todos los event listeners
*/

// TODO: Registrar el evento 'submit' en el formulario
btnPrimary.addEventListener("click", (e) => {
    e.preventDefault(); // Esto evita que el formulario recargue la página
    validateForm(); // Validamos que ningun campo este vacio. (Retorno: true | false)

});



// TODO: Registrar eventos 'input' en los campos para limpiar errores al escribir
// Pista: userNameInput.addEventListener('input', handleInputChange);
// Pista: userMessageInput.addEventListener('input', handleInputChange);


// ============================================
// 6. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================

/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: 
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: 
 * 
 * 3. ¿Qué nuevo elemento se crea?
 *    R: 
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: 
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: 
 */


// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

/**
 * Esta función se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');

    // Aquí puedes agregar cualquier inicialización adicional
    // Por ejemplo, cargar mensajes guardados del localStorage
});


// ============================================
// 8. FUNCIONALIDADES ADICIONALES (BONUS)
// ============================================

/**
 * RETOS ADICIONALES OPCIONALES:
 * 
 * 1. Agregar un botón para eliminar mensajes individuales
 * 2. Implementar localStorage para persistir los mensajes
 * 3. Agregar un contador de caracteres en el textarea
 * 4. Implementar un botón para limpiar todos los mensajes
 * 5. Agregar diferentes colores de avatar según el nombre del usuario
 * 6. Permitir editar mensajes existentes
 * 7. Agregar emojis o reacciones a los mensajes
 * 8. Implementar búsqueda/filtrado de mensajes
 */
