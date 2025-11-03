document.addEventListener('DOMContentLoaded', () => {
    const floatingNav = document.getElementById('floatingNav');
    const floatingNavToggle = document.getElementById('floatingNavToggle');
    const floatingNavMenu = document.getElementById('floatingNavMenu');

    // Si los elementos no existen, no hacemos nada.
    if (!floatingNav || !floatingNavToggle || !floatingNavMenu) {
        return;
    }

    // 1. Mostrar u ocultar el botón flotante al hacer scroll.
    window.addEventListener('scroll', () => {
        // Muestra el botón si el scroll es mayor a la altura de la ventana.
        if (window.scrollY > window.innerHeight) {
            floatingNav.classList.add('visible');
        } else {
            floatingNav.classList.remove('visible');
            floatingNavMenu.classList.remove('open'); // Oculta el menú si se sube
        }
    });

    // 2. Abrir/cerrar el menú al hacer clic en el botón.
    floatingNavToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic se propague al 'document'
        floatingNavMenu.classList.toggle('open');
    });

    // 3. Cerrar el menú si se hace clic en cualquier otro lugar de la página.
    document.addEventListener('click', (event) => {
        if (!floatingNav.contains(event.target)) {
            floatingNavMenu.classList.remove('open');
        }
    });

    // 4. Cerrar el menú después de hacer clic en un enlace del menú.
    floatingNavMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            floatingNavMenu.classList.remove('open');
        }
    });
});
