const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let css = fs.readFileSync('styles.css', 'utf8');

const newBody = `<body class="dark-theme login-split-body">
    <div class="split-layout">
        <!-- Left Panel: Branding & Welcome (Light Theme for Logo Integration) -->
        <div class="split-left">
            <div class="branding-content">
                <div class="logo-wrapper">
                    <img src="AVANTI LOGO (1).jpeg" alt="Logo Avanti" class="logo-blend">
                </div>
                <h1 class="brand-title">Sistema de Control de Activos y Actas TI</h1>
                <p class="brand-subtitle">Agrícola Avanti S.A.C.</p>
                <div class="badges-container">
                    <span class="badge"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Plataforma Segura</span>
                    <span class="badge"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Versión 2.0</span>
                </div>
            </div>
            <div class="split-footer">
                © 2026 Agrícola Avanti S.A.C. Todos los derechos reservados.
            </div>
        </div>

        <!-- Right Panel: Login -->
        <div class="split-right">
            <div class="login-card-mate">
                <div class="login-header text-center">
                    <h2 id="formTitle" style="margin-bottom: 5px;">Iniciar Sesión</h2>
                    <p id="formSubtitle" style="color: var(--text-secondary); margin-bottom: 25px;">Ingresa tus credenciales corporativas</p>
                </div>
                
                <!-- FORMULARIO DE INICIO DE SESIÓN -->
                <form id="loginForm">
                    <div class="input-group-mate with-icon">
                        <label for="loginEmail">Correo Corporativo</label>
                        <div class="input-icon-wrapper">
                            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                            <input type="email" id="loginEmail" placeholder="usuario@agricolaavanti.pe" required>
                        </div>
                    </div>
                    
                    <div class="input-group-mate password-group with-icon">
                        <label for="loginPassword">Contraseña</label>
                        <div class="input-icon-wrapper">
                            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <input type="password" id="loginPassword" placeholder="Tu contraseña" required>
                            <button type="button" class="toggle-password" onclick="togglePasswordVisibility('loginPassword', this)">
                                <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                        <div id="capsWarningLogin" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                    </div>
                    
                    <div class="remember-group" style="margin-bottom: 25px;">
                        <label class="custom-checkbox-container" style="display:flex; align-items:center; gap: 8px; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
                            <input type="checkbox" id="rememberUser" style="width: 16px; height: 16px; accent-color: #10b981;">
                            Recordar usuario en este dispositivo
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-avanti w-100" id="loginBtn">
                        <span class="btn-text">Ingresar al Portal</span>
                        <svg class="spinner hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </button>
                    
                    <div class="divider">o</div>
                    
                    <!-- Ingreso como Invitado (Con PIN) -->
                    <div class="tooltip-container">
                        <button type="button" id="btnGuest" class="btn-outline-mate w-100">🛡️ Auditoría (Requiere PIN)</button>
                        <div class="tooltip-text">Acceso de lectura para auditores autorizados.</div>
                    </div>
                    
                    <div class="login-footer-links">
                        <p class="security-note">🔒 Acceso restringido al personal autorizado.<br>Contactar a Soporte TI para altas.</p>
                        <a href="mailto:soporte@agricolaavanti.pe" class="support-link">¿Problemas para ingresar? Solicitar asistencia a TI</a>
                    </div>
                </form>
            </div>
            
            <div class="mobile-footer">
                © 2026 Agrícola Avanti S.A.C.
            </div>
        </div>
    </div>`;

html = html.replace(/<body class="dark-theme login-body">[\s\S]*?<!-- LÓGICA DE INTERFAZ Y AUTENTICACIÓN -->/, newBody + "\n\n    <!-- LÓGICA DE INTERFAZ Y AUTENTICACIÓN -->");

html = html.replace(/btnGuest\.addEventListener\('click', \(\) => {[\s\S]*?}\);/, `btnGuest.addEventListener('click', () => {
            const pin = prompt("Por favor, ingrese el PIN de auditoría (0000):");
            if (pin === "0000") {
                const session = { 
                    name: 'Auditor', 
                    role: 'viewer',
                    token: 'guest-000' 
                };
                localStorage.setItem('session', JSON.stringify(session));
                window.location.replace('dashboard.html');
            } else if (pin !== null) {
                showToast("PIN incorrecto. Acceso denegado.");
            }
        });`);

fs.writeFileSync('index.html', html, 'utf8');

const newCSS = `
/* ==========================================
   SPLIT SCREEN LOGIN LAYOUT
   ========================================== */
.login-split-body {
    margin: 0; padding: 0;
    height: 100vh;
    background: #0f172a;
    overflow: hidden;
    font-family: 'Inter', system-ui, sans-serif;
}

.split-layout {
    display: flex;
    width: 100%;
    height: 100%;
}

.split-left {
    flex: 1;
    background: #f8fafc; /* Light theme for logo */
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 4rem;
    color: #0f172a;
    overflow: hidden;
}

/* Subtle pattern overlay */
.split-left::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.4;
    pointer-events: none;
}

.branding-content {
    position: relative;
    z-index: 10;
    max-width: 500px;
}

/* Seamless Logo Integration */
.logo-wrapper {
    margin-bottom: 2rem;
    display: inline-block;
}

.logo-blend {
    height: 75px;
    mix-blend-mode: multiply; /* Removes white background seamlessly */
}

.brand-title {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    color: #0f172a;
}

.brand-subtitle {
    font-size: 1.2rem;
    color: #059669;
    margin-bottom: 2rem;
    font-weight: 600;
}

.badges-container {
    display: flex;
    gap: 1rem;
}

.badge {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.split-footer {
    position: absolute;
    bottom: 2rem;
    left: 4rem;
    font-size: 0.85rem;
    color: #64748b;
}

.split-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0f172a; /* Dark right side */
    padding: 2rem;
    position: relative;
    box-shadow: -10px 0 30px rgba(0,0,0,0.3);
    z-index: 20;
}

.mobile-footer {
    display: none;
    position: absolute;
    bottom: 1.5rem;
    font-size: 0.75rem;
    color: #64748b;
}

/* Updated login card */
.split-right .login-card-mate {
    width: 100%;
    max-width: 400px;
    background: transparent;
    border: none;
    box-shadow: none;
    margin: 0;
}

/* Inputs with Icons */
.input-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 14px;
    width: 20px;
    height: 20px;
    color: #64748b;
    pointer-events: none;
}

.input-group-mate.with-icon input {
    padding-left: 42px;
}

/* Security Note & Support Link */
.login-footer-links {
    margin-top: 2rem;
    text-align: center;
}

.security-note {
    font-size: 0.8rem;
    color: #94a3b8;
    line-height: 1.5;
    margin-bottom: 1rem;
    background: rgba(30, 41, 59, 0.5);
    padding: 10px;
    border-radius: 8px;
    border: 1px dashed #334155;
}

.support-link {
    font-size: 0.85rem;
    color: #10b981;
    text-decoration: none;
    transition: color 0.2s;
}

.support-link:hover {
    color: #34d399;
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
    .split-layout {
        flex-direction: column;
    }
    .split-left {
        flex: 0.4;
        padding: 2rem;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .badges-container {
        justify-content: center;
    }
    .split-footer {
        display: none;
    }
    .mobile-footer {
        display: block;
    }
    .brand-title {
        font-size: 1.8rem;
    }
}
`;

fs.appendFileSync('styles.css', newCSS);
console.log('index.html and styles.css updated for Light/Dark split');

