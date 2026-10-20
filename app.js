// ==========================================================================
// AVANTI FORMS - SISTEMA CENTRAL DE TEMAS, SESIÓN Y ACCESIBILIDAD (FLUENT UI)
// ==========================================================================

const SUN_ICON = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
const MOON_ICON = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;

/**
 * Aplica el tema de forma integral en documentElement y body
 * @param {'dark'|'light'} theme 
 */
function applyTheme(theme) {
    const isDark = theme !== 'light';
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
        root.classList.add('dark-theme', 'dark-mode');
        if (body) body.classList.add('dark-theme', 'dark-mode');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.remove('dark-theme', 'dark-mode');
        if (body) body.classList.remove('dark-theme', 'dark-mode');
        root.style.colorScheme = 'light';
    }

    // Actualizar todos los botones de tema en la interfaz
    const toggles = document.querySelectorAll('#themeToggle, .theme-toggle-btn, [data-theme-toggle]');
    toggles.forEach(btn => {
        const textSpan = btn.querySelector('span');
        btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

        if (textSpan) {
            btn.innerHTML = `${isDark ? SUN_ICON : MOON_ICON} <span>${isDark ? 'Claro' : 'Oscuro'}</span>`;
        } else {
            btn.innerHTML = isDark ? SUN_ICON : MOON_ICON;
        }
    });

    // Disparar evento para componentes que requieran repintado
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: isDark ? 'dark' : 'light' } }));
}

/**
 * Alterna entre modo claro y oscuro persistiendo en localStorage
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
}

// Inicialización inmediata para evitar parpadeos visuales (FOUC)
(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
})();

// Sincronizar en tiempo real cambios de tema entre diferentes pestañas abiertas
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        applyTheme(e.newValue || 'dark');
    }
});

// ==========================================================================
// GENERADOR DE SKELETONS (FLUENT UI)
// ==========================================================================
/**
 * Crea una estructura de skeleton fluida para simular tablas de datos en carga
 * @param {number} rows Cantidad de filas a simular
 * @param {number} cols Cantidad de columnas
 * @returns {string} HTML del skeleton
 */
function createTableSkeleton(rows = 6, cols = 5) {
    let rowsHtml = '';
    for (let r = 0; r < rows; r++) {
        let cellsHtml = '';
        for (let c = 0; c < cols; c++) {
            const width = c === 0 ? '40px' : c === 1 ? '180px' : c === 2 ? '120px' : '90px';
            cellsHtml += `<div style="flex: 1; padding: 12px 14px;"><div class="fluent-skeleton fluent-skeleton-text" style="width: ${width}; height: 14px; margin: 0;"></div></div>`;
        }
        rowsHtml += `<div class="fluent-skeleton-table-row" style="display: flex; align-items: center; border-bottom: 1px solid var(--border-color); background: var(--card-bg);">${cellsHtml}</div>`;
    }

    return `
    <div class="fluent-table-skeleton" role="status" aria-busy="true" aria-label="Cargando registros..." style="width: 100%; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-color);">
        <div style="display: flex; background: var(--surface-subtle); padding: 10px 14px; border-bottom: 1px solid var(--border-color); gap: 14px;">
            <div class="fluent-skeleton" style="width: 60px; height: 12px;"></div>
            <div class="fluent-skeleton" style="width: 140px; height: 12px;"></div>
            <div class="fluent-skeleton" style="width: 100px; height: 12px;"></div>
            <div class="fluent-skeleton" style="width: 100px; height: 12px;"></div>
            <div class="fluent-skeleton" style="width: 80px; height: 12px; margin-left: auto;"></div>
        </div>
        ${rowsHtml}
    </div>`;
}

// Exponer utilidades globales
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
window.createTableSkeleton = createTableSkeleton;

// ==========================================================================
// CICLO DE VIDA AL CARGAR EL DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar listener a botones de tema existentes
    const toggles = document.querySelectorAll('#themeToggle, .theme-toggle-btn, [data-theme-toggle]');
    toggles.forEach(btn => {
        btn.removeEventListener('click', toggleTheme);
        btn.addEventListener('click', toggleTheme);
    });

    // 2. Aplicar tema actual en elementos que acaban de cargarse
    applyTheme(localStorage.getItem('theme') || 'dark');

    // 3. Protección de rutas y verificación de sesión
    const currentPage = window.location.pathname;
    const sessionData = localStorage.getItem('session');
    const isLoginPage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/login.html');

    if (!isLoginPage && !sessionData) {
        window.location.replace('index.html');
        return;
    }

    // 4. Configuración del perfil de usuario en Dashboard
    if (sessionData && currentPage.includes('dashboard.html')) {
        try {
            const session = JSON.parse(sessionData);
            const userRole = document.querySelector('.user-role');
            const userStatus = document.querySelector('.user-status');
            if (userRole) {
                userRole.textContent = session.name === 'Invitado' ? 'Invitado (Solo Lectura)' : session.name;
            }
            if (userStatus) {
                userStatus.textContent = session.name === 'Invitado' ? 'Modo Consulta' : 'En línea';
            }
        } catch (e) {
            console.error('Error parseando sesión:', e);
        }
    }
});

/**
 * Cierre de sesión seguro y redirección
 */
function cerrarSesion() {
    localStorage.removeItem('session');
    window.location.replace('index.html');
}
window.cerrarSesion = cerrarSesion;
