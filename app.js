document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. GESTIÓN DEL TEMA (Oscuro/Claro)
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const storedTheme = localStorage.getItem('theme');

    // Aplicar tema guardado (Por defecto es oscuro si no hay nada guardado)
    if (storedTheme === 'light') {
        body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.textContent = '🌙 Oscuro';
    } else {
        body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Claro';
    }

    // Evento para alternar el tema si el botón existe en la página actual
    if (themeToggle) {
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
    }

    // ==========================================
    // 2. PROTECCIÓN GLOBAL DE RUTAS Y SESIÓN
    // ==========================================
    const currentPage = window.location.pathname;
    const sessionData = localStorage.getItem('session');

    // Detectar si la página actual es el login (index.html o la raíz '/')
    const isLoginPage = currentPage.includes('index.html') || currentPage === '/';
    
    // Si el usuario NO está en el login y NO tiene sesión activa, lo expulsamos
    if (!isLoginPage && !sessionData) {
        window.location.replace('index.html');
        return; // Detener la ejecución del resto del script
    }

    // ==========================================
    // 3. CONFIGURACIÓN DE LA INTERFAZ (Dashboard)
    // ==========================================
    // Solo se ejecuta si hay sesión y estamos en el dashboard
    if (sessionData && currentPage.includes('dashboard.html')) {
        const session = JSON.parse(sessionData);
        const userBadge = document.querySelector('.user-badge');

        if (userBadge) {
            // Mostrar nombre real (en mayúsculas) o la etiqueta especial de invitado
            userBadge.textContent = session.name === 'Invitado' 
                ? '👁️ INVITADO' 
                : `HOLA, ${session.name.toUpperCase()}`;
        }
    }
});

// ==========================================
// 4. FUNCIÓN GLOBAL PARA CERRAR SESIÓN
// ==========================================
// Esta función puede ser llamada desde cualquier botón del HTML con onclick="cerrarSesion()"
function cerrarSesion() {
    // Eliminar los datos de sesión de la memoria del navegador
    localStorage.removeItem('session');
    
    // Redirigir usando replace para que no puedan usar el botón "Atrás" del navegador
    window.location.replace('index.html');
}
