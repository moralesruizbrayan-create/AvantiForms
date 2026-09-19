const fs = require('fs');

// STYLES.CSS
let css = fs.readFileSync('styles.css', 'utf8');

const newStyles = `

/* =========================================
   8. NUEVOS COMPONENTES (CAPS, CHECKBOX, TOOLTIP, TOAST)
   ========================================= */

.caps-warning {
    color: #facc15;
    font-size: 0.75rem;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.remember-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    margin-top: 5px;
}
.remember-group input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #333338;
    border-radius: 4px;
    background-color: #222227;
    cursor: pointer;
    position: relative;
    transition: 0.2s;
    outline: none;
}
.remember-group input[type="checkbox"]:checked {
    background-color: var(--avanti-green);
    border-color: var(--avanti-green);
}
.remember-group input[type="checkbox"]:checked::after {
    content: "✓";
    position: absolute;
    color: white;
    font-size: 14px;
    left: 2px;
    top: -1px;
}
.remember-group label {
    font-size: 0.85rem;
    color: #a1a1aa;
    cursor: pointer;
}

.tooltip-container {
    position: relative;
    display: inline-block;
    width: 100%;
}
.tooltip-container .tooltip-text {
    visibility: hidden;
    width: 280px;
    background-color: #1e293b;
    color: #e2e8f0;
    text-align: center;
    border-radius: 8px;
    padding: 10px;
    position: absolute;
    z-index: 10;
    bottom: 120%;
    left: 50%;
    margin-left: -140px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.8rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    border: 1px solid #334155;
    pointer-events: none;
}
.tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}
.tooltip-container .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #334155 transparent transparent transparent;
}

.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #1e293b;
    border-left: 4px solid #ef4444;
    color: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 9999;
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toast-notification.show {
    transform: translateX(0);
}
.toast-notification .toast-icon {
    font-size: 1.2rem;
}
`;

if (!css.includes('.caps-warning')) {
    fs.writeFileSync('styles.css', css + newStyles);
}

// INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');

// Toast HTML
if (!html.includes('id="toastNotification"')) {
    html = html.replace('</body>', `
    <!-- TOAST NOTIFICATION -->
    <div id="toastNotification" class="toast-notification hidden">
        <span class="toast-icon">⚠️</span>
        <span id="toastMessage">Error message</span>
    </div>
</body>`);
}

// Caps Lock Alert (Login)
if (!html.includes('capsWarningLogin')) {
    const pwdLoginTarget = '</button>\n                    </div>';
    html = html.replace(pwdLoginTarget, pwdLoginTarget + '\n                    <div id="capsWarningLogin" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>');
}

// Caps Lock Alert (Register)
if (!html.includes('capsWarningReg')) {
    const pwdRegTarget = 'onclick="togglePasswordVisibility(\'regPassword\', this)">\n                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>\n                        </button>\n                    </div>';
    html = html.replace(pwdRegTarget, pwdRegTarget + '\n                    <div id="capsWarningReg" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>');
}

// Remember Me Checkbox
if (!html.includes('rememberUser')) {
    const capsLoginTarget = '<div id="capsWarningLogin" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>\n                </div>';
    html = html.replace(capsLoginTarget, capsLoginTarget + '\n                <div class="remember-group">\n                    <input type="checkbox" id="rememberUser">\n                    <label for="rememberUser">Recordar usuario en este dispositivo</label>\n                </div>');
}

// Update Guest Button and Tooltip
if (!html.includes('tooltip-container')) {
    const guestBtnOld = '<button type="button" id="btnGuest" class="btn-outline-mate w-100">👁️ Ingresar como Invitado</button>';
    const guestBtnNew = '<div class="tooltip-container">\n                    <button type="button" id="btnGuest" class="btn-outline-mate w-100">👁️ Acceso Modo Consulta (Solo Lectura)</button>\n                    <div class="tooltip-text">Permite explorar el inventario sin permisos para generar ni firmar actas.</div>\n                </div>';
    html = html.replace(guestBtnOld, guestBtnNew);
}

// Add Toast JS logic
const toastLogic = `
        function showToast(message) {
            const toast = document.getElementById('toastNotification');
            const toastMsg = document.getElementById('toastMessage');
            toastMsg.textContent = message;
            toast.classList.remove('hidden');
            // Reflow
            void toast.offsetWidth;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 4000);
        }
`;

if (!html.includes('showToast(message)')) {
    html = html.replace('// Referencias al DOM', toastLogic + '\n        // Referencias al DOM');
}

// Caps Lock JS logic
const capsLogic = `
        function checkCapsLock(e, warningElementId) {
            const warningEl = document.getElementById(warningElementId);
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                warningEl.classList.remove('hidden');
            } else {
                warningEl.classList.add('hidden');
            }
        }
        document.getElementById('loginPassword').addEventListener('keyup', (e) => checkCapsLock(e, 'capsWarningLogin'));
        document.getElementById('regPassword').addEventListener('keyup', (e) => checkCapsLock(e, 'capsWarningReg'));

        // Load saved email if any
        window.addEventListener('DOMContentLoaded', () => {
            const savedEmail = localStorage.getItem('savedEmail');
            if (savedEmail) {
                document.getElementById('loginEmail').value = savedEmail;
                document.getElementById('rememberUser').checked = true;
            }
        });
`;

if (!html.includes('checkCapsLock')) {
    html = html.replace('// ==========================================\n        // 1. LÓGICA DE LOGIN (Conectada a Neon DB)', capsLogic + '\n\n        // ==========================================\n        // 1. LÓGICA DE LOGIN (Conectada a Neon DB)');
}

// Remember Me save logic on success
if (!html.includes("localStorage.setItem('savedEmail', email)")) {
    const successLogic = `if (document.getElementById('rememberUser').checked) {
                        localStorage.setItem('savedEmail', email);
                    } else {
                        localStorage.removeItem('savedEmail');
                    }
                    localStorage.setItem('session', JSON.stringify(session));`;
    html = html.replace("localStorage.setItem('session', JSON.stringify(session));", successLogic);
}

// Replace alerts with showToast
html = html.replace(/alert\((.*?)\);/g, 'showToast($1);');

// Fix Guest login role
html = html.replace("role: 'admin', // <-- CAMBIADO: Ahora tiene permisos completos de administrador", "role: 'viewer', // Acceso de solo lectura");

fs.writeFileSync('index.html', html);

