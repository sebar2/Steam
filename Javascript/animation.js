// =================================================================================
// LÓGICA PARA LA PÁGINA PRINCIPAL (INDEX.HTML)
// Este script controla la animación decorativa de la cerradura.
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Control de luces de estado de la cerradura
    const lockBody = document.querySelector('.lock-body-demo');
    const statusLight = document.querySelector('.lock-status-light');

    // Si los elementos no existen en la página, no continuamos para evitar errores.
    if (!lockBody || !statusLight) {
        console.log("Elementos de animación no encontrados en esta página.");
        return;
    }

    // Simular ciclo de funcionamiento de la cerradura
    function simulateLockCycle() {
        // Estado inicial (esperando)
        setTimeout(() => {
            statusLight.classList.remove('success', 'blocked');
        }, 0);
        
        // Primera tarjeta - éxito (luz verde)
        setTimeout(() => {
            lockBody.classList.add('success');
            statusLight.classList.add('success');
        }, 2000);
        
        // Reset
        setTimeout(() => {
            lockBody.classList.remove('success');
            statusLight.classList.remove('success');
        }, 4000);
        
        // Segunda tarjeta - bloqueo (luz roja)
        setTimeout(() => {
            lockBody.classList.add('blocked');
            statusLight.classList.add('blocked');
        }, 6000);
        
        // Reset para el siguiente ciclo
        setTimeout(() => {
            lockBody.classList.remove('blocked');
            statusLight.classList.remove('blocked');
        }, 8000);
    }
    
    // Iniciar el ciclo de animación y repetirlo.
    simulateLockCycle();
    setInterval(simulateLockCycle, 8000);
});


