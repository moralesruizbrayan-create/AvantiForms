document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // 1. Restaurar preferencia de tema
    const storedTheme = localStorage.getItem('theme');
    
    // Si hay preferencia guardada como 'light', quitar el dark-theme
    if (storedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙 Modo Oscuro';
    } else {
        // Por defecto o si es 'dark', asegurar que esté puesto
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Modo Claro';
    }

    // 2. Evento para cambiar de tema
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️ Modo Claro';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙 Modo Oscuro';
        }
    });
});

// 3. CORRECCIÓN: Función segura para cerrar sesión
function cerrarSesion() {
    // Eliminar token/estado de autenticación
    localStorage.removeItem('isAuthenticated');
    
    // Usar replace para evitar que puedan regresar con el botón "Atrás"
    window.location.replace('index.html');
}
