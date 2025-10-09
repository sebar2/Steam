// =================================================================================
// 1. IMPORTACIONES DE FIREBASE
// Importamos solo las funciones que necesitamos de los SDK de Firebase.
// La configuración ya está en 'firebase-config.js', por lo que solo importamos
// las variables 'auth' y 'db' desde ese archivo.
// =================================================================================
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    get,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db } from './firebase-config.js'; // Importamos las instancias inicializadas

// =================================================================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// Obtenemos todos los elementos HTML con los que vamos a interactuar.
// =================================================================================
const loadingContainer = document.getElementById('loading');
const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authMessage = document.getElementById('auth-message');
const userNameDisplay = document.getElementById('user-name');
const userIdDisplay = document.getElementById('user-id');
const addUidBtn = document.getElementById('add-uid-btn');
const newUidInput = document.getElementById('new-uid-input');
const uidNameInput = document.getElementById('uid-name-input');
const addUidMessage = document.getElementById('add-uid-message');
const verifyUidBtn = document.getElementById('verify-uid-btn');
const verifyUidInput = document.getElementById('verify-uid-input');
const verifyUidMessage = document.getElementById('verify-uid-message');
const eventList = document.getElementById('event-list');
// --- Elementos de la Animación ---
const animationContainer = document.getElementById('lock-animation-container');
const simulateGrantedBtn = document.getElementById('simulate-granted-btn');
const simulateDeniedBtn = document.getElementById('simulate-denied-btn');


// =================================================================================
// 3. LÓGICA DE AUTENTICACIÓN
// Maneja el estado de la sesión del usuario (si está logueado o no).
// =================================================================================
onAuthStateChanged(auth, user => {
    loadingContainer.classList.add('d-none'); // Ocultar el spinner de carga

    if (user) {
        // Usuario está logueado
        loginForm.classList.add('d-none');
        adminPanel.classList.remove('d-none');
        userNameDisplay.textContent = user.email;
        userIdDisplay.textContent = user.uid;
        loadEvents(); // Cargar los eventos cuando el usuario inicie sesión
    } else {
        // Usuario no está logueado
        loginForm.classList.remove('d-none');
        adminPanel.classList.add('d-none');
        userNameDisplay.textContent = '';
        userIdDisplay.textContent = '';
    }
});

// --- Evento para registrar un nuevo usuario ---
registerBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent = 'Por favor, completa ambos campos.';
        authMessage.style.color = 'var(--neon-red)';
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        authMessage.textContent = '¡Usuario registrado con éxito! Ahora puedes iniciar sesión.';
        authMessage.style.color = 'var(--primary-tech)';
    } catch (error) {
        authMessage.textContent = `Error al registrar: ${error.message}`;
        authMessage.style.color = 'var(--neon-red)';
    }
});

// --- Evento para iniciar sesión ---
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent = 'Por favor, completa ambos campos.';
        authMessage.style.color = 'var(--neon-red)';
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        authMessage.textContent = '';
    } catch (error) {
        authMessage.textContent = `Error al iniciar sesión: ${error.message}`;
        authMessage.style.color = 'var(--neon-red)';
    }
});

// --- Evento para cerrar sesión ---
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});


// =================================================================================
// 4. LÓGICA DE LA BASE DE DATOS (REALTIME DATABASE)
// Funciones para añadir, verificar y mostrar datos de la base de datos.
// =================================================================================

// --- Añadir un nuevo UID a la base de datos ---
addUidBtn.addEventListener('click', async () => {
    const uid = newUidInput.value.trim();
    const name = uidNameInput.value.trim();

    if (!uid || !name) {
        addUidMessage.textContent = 'Ambos campos son obligatorios.';
        addUidMessage.style.color = 'var(--neon-red)';
        return;
    }

    try {
        // La ruta será 'uids_permitidos/{UID_DE_LA_TARJETA}'
        const uidRef = ref(db, `uids_permitidos/${uid}`);
        await set(uidRef, {
            propietario: name,
            agregadoEl: serverTimestamp() // Guarda la fecha y hora del servidor
        });
        addUidMessage.textContent = `UID ${uid} agregado para ${name}.`;
        addUidMessage.style.color = 'var(--primary-tech)';
        newUidInput.value = '';
        uidNameInput.value = '';
    } catch (error) {
        addUidMessage.textContent = `Error al agregar UID: ${error.message}`;
        addUidMessage.style.color = 'var(--neon-red)';
    }
});

// --- Verificar si un UID existe ---
verifyUidBtn.addEventListener('click', async () => {
    const uid = verifyUidInput.value.trim();
    if (!uid) {
        verifyUidMessage.textContent = 'Ingresa un UID para verificar.';
        verifyUidMessage.style.color = 'var(--neon-red)';
        return;
    }

    try {
        const uidRef = ref(db, `uids_permitidos/${uid}`);
        const snapshot = await get(uidRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            verifyUidMessage.textContent = `UID VÁLIDO. Pertenece a: ${data.propietario}.`;
            verifyUidMessage.style.color = 'var(--primary-tech)';
        } else {
            verifyUidMessage.textContent = 'UID NO ENCONTRADO o no autorizado.';
            verifyUidMessage.style.color = 'var(--neon-red)';
        }
    } catch (error) {
        verifyUidMessage.textContent = `Error al verificar: ${error.message}`;
        verifyUidMessage.style.color = 'var(--neon-red)';
    }
});

// --- Cargar y mostrar el registro de eventos ---
function loadEvents() {
    const eventsRef = ref(db, 'registro_eventos');
    onValue(eventsRef, (snapshot) => {
        eventList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos eventos
        if (snapshot.exists()) {
            const events = snapshot.val();
            // Firebase no garantiza el orden, así que lo ordenamos por fecha
            const sortedEventKeys = Object.keys(events).sort((a, b) => {
                return events[b].timestamp - events[a].timestamp;
            });
            
            sortedEventKeys.forEach(key => {
                const eventData = events[key];
                const li = document.createElement('li');
                
                const date = new Date(eventData.timestamp).toLocaleString();
                const icon = eventData.tipo === 'Acceso Concedido' 
                    ? '<i class="bi bi-check-circle-fill text-success"></i>'
                    : '<i class="bi bi-x-octagon-fill text-danger"></i>';

                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            ${icon}
                            <span class="fw-bold">${eventData.tipo}</span>
                            <span>para UID: ${eventData.uid || 'Desconocido'}</span>
                        </div>
                        <small class="text-muted">${date}</small>
                    </div>
                `;
                eventList.appendChild(li);
            });
        } else {
            eventList.innerHTML = '<li>No hay eventos registrados.</li>';
        }
    });
}

// =================================================================================
// 5. LÓGICA DE ANIMACIÓN DEL PANEL
// Controla la simulación de la cerradura en el panel de administración.
// =================================================================================

// --- Elementos de Audio ---
const successSound = new Audio('../Audio/acceso.mp3'); // Sonido de éxito
const errorSound = new Audio('../Audio/error.mp3');     // Sonido de error

let isAnimating = false; // Evita que las animaciones se superpongan

/**
 * Activa la animación de acceso.
 * @param {('granted'|'denied')} type - El tipo de acceso a simular.
 */
const triggerAnimation = (type) => {
    if (isAnimating || !animationContainer) return; // No hacer nada si ya está en animación

    isAnimating = true;
    const sound = type === 'granted' ? successSound : errorSound;
    const animationClass = type === 'granted' ? 'access-granted' : 'access-denied';
    const duration = type === 'granted' ? 4000 : 3000; // Duración de la animación en ms

    // Reproducir sonido
    sound.currentTime = 0;
    sound.play().catch(error => console.log("El usuario debe interactuar con la página para reproducir audio."));

    // Añadir clase para iniciar la animación CSS
    animationContainer.classList.add(animationClass);

    // Limpiar clases y estado después de que la animación termine
    setTimeout(() => {
        animationContainer.classList.remove(animationClass);
        isAnimating = false;
    }, duration);
};

// --- Event Listeners para los botones de simulación ---
if (simulateGrantedBtn) {
    simulateGrantedBtn.addEventListener('click', () => triggerAnimation('granted'));
}

if (simulateDeniedBtn) {
    simulateDeniedBtn.addEventListener('click', () => triggerAnimation('denied'));
}

