document.addEventListener('DOMContentLoaded', () => {
    // --- Selección de Elementos ---
    const approveButton = document.getElementById('approveBtn');
    const denyButton = document.getElementById('denyBtn');
    const animationContainer = document.getElementById('lock-animation-container');
    const imageModal = document.getElementById('imageModal');

    // Si los elementos no existen, no continuamos para evitar errores.
    if (!approveButton && !denyButton && !animationContainer && !imageModal) {
        console.error("No se encontraron los elementos necesarios para la animación en avanze.html.");
        return;
    }

    // --- Lógica de Animación de la Cerradura ---
    const successSound = new Audio('../Audio/acceso.mp3');
    const failSound = new Audio('../Audio/error.mp3');

    let isAnimating = false; // Evita que las animaciones se superpongan

    /**
     * Activa la animación de acceso.
     * @param {('granted'|'denied')} type - El tipo de acceso a simular.
     */
    const triggerAnimation = (type) => {
        if (isAnimating) return; // No hacer nada si ya está en animación

        isAnimating = true;
        const sound = type === 'granted' ? successSound : failSound;
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
    if (approveButton) approveButton.addEventListener('click', () => triggerAnimation('granted'));
    if (denyButton) denyButton.addEventListener('click', () => triggerAnimation('denied'));

    // --- Lógica del Modal de Imágenes ---
    if (imageModal) {
        const modalImage = document.getElementById('modalImage');
        
        imageModal.addEventListener('show.bs.modal', function (event) {
            // Botón o imagen que activó el modal
            const triggerElement = event.relatedTarget;
            
            // Extraer la URL de la imagen del atributo src
            const imageSrc = triggerElement.getAttribute('src');
            
            // Actualizar el src de la imagen dentro del modal
            modalImage.setAttribute('src', imageSrc);
        });
    }
});
