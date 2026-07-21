document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return; // Evita error en index.html donde no está este botón
    
    const body = document.body;

    // Restaurar preferencia (por defecto inicia oscuro en el HTML)
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙 Oscuro';
    } else {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Claro';
    }

    // Alternar tema
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️ Claro';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙 Oscuro';
        }
    });
});

// Función de Cerrar Sesión con corrección de historial
function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.replace('index.html');
}
