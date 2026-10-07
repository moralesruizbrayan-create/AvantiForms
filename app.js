document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. GESTIÓN DEL TEMA (Oscuro/Claro)
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const storedTheme = localStorage.getItem('theme');

    const sunIcon = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Claro`;
    const moonIcon = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg> Oscuro`;

    // Aplicar tema guardado (Por defecto es oscuro si no hay nada guardado)
    if (storedTheme === 'light') {
        body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.innerHTML = moonIcon;
    } else {
        body.classList.add('dark-theme');
        if (themeToggle) themeToggle.innerHTML = sunIcon;
    }

    // Evento para alternar el tema si el botón existe en la página actual
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = sunIcon;
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = moonIcon;
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
        const userRole = document.querySelector('.user-role');

        if (userBadge) {
            // Mostrar nombre real o la etiqueta especial de invitado
            userBadge.textContent = session.name === 'Invitado' 
                ? '👁️ INVITADO' 
                : `HOLA, ${session.name.toUpperCase()}`;
        } else if (userRole) {
            userRole.textContent = session.name === 'Invitado' 
                ? 'Invitado (Solo Lectura)' 
                : session.name;
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
