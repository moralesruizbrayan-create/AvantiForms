const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Logo container (from prev turn)
html = html.replace('<img src="AVANTI LOGO (1).jpeg" alt="Logo Avanti" class="logo-login">', 
`<div class="logo-container-login">
    <img src="AVANTI LOGO (1).jpeg" alt="Logo Avanti" class="logo-login">
</div>`);

// 2. Login password wrapper + Caps warning + Remember Me
const loginPwdTarget = `<div class="input-group-mate">
                    <label for="loginPassword">Contraseña</label>
                    <input type="password" id="loginPassword" required>
                </div>`;
const loginPwdReplacement = `<div class="input-group-mate password-group">
                    <label for="loginPassword">Contraseña</label>
                    <div class="password-wrapper">
                        <input type="password" id="loginPassword" required>
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('loginPassword', this)">
                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <div id="capsWarningLogin" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                </div>
                
                <div class="remember-group">
                    <input type="checkbox" id="rememberUser">
                    <label for="rememberUser">Recordar usuario en este dispositivo</label>
                </div>`;
html = html.replace(loginPwdTarget, loginPwdReplacement);

// 3. Register password wrapper + Caps warning
const regPwdTarget = `<div class="input-group-mate">
                    <label for="regPassword">Contraseña</label>
                    <input type="password" id="regPassword" required>
                </div>`;
const regPwdReplacement = `<div class="input-group-mate password-group">
                    <label for="regPassword">Contraseña</label>
                    <div class="password-wrapper">
                        <input type="password" id="regPassword" required>
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('regPassword', this)">
                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <div id="capsWarningReg" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                </div>`;
html = html.replace(regPwdTarget, regPwdReplacement);

// 4. Spinners in Buttons
html = html.replace('<button type="submit" class="btn-avanti w-100">Ingresar al Portal</button>', 
`<button type="submit" class="btn-avanti w-100" id="loginBtn">
    <span class="btn-text">Ingresar al Portal</span>
    <svg class="spinner hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
</button>`);

html = html.replace('<button type="submit" class="btn-avanti w-100">Crear Cuenta</button>', 
`<button type="submit" class="btn-avanti w-100">
    <span class="btn-text">Crear Cuenta</span>
    <svg class="spinner hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
</button>`);

// 5. Tooltip on Guest Button
const guestBtnTarget = `<button type="button" id="btnGuest" class="btn-outline-mate w-100">👁️ Ingresar como Invitado</button>`;
const guestBtnReplacement = `<div class="tooltip-container">
                    <button type="button" id="btnGuest" class="btn-outline-mate w-100">👁️ Acceso Modo Consulta (Solo Lectura)</button>
                    <div class="tooltip-text">Permite explorar el inventario sin permisos para generar ni firmar actas.</div>
                </div>`;
html = html.replace(guestBtnTarget, guestBtnReplacement);

// 6. Toast UI
html = html.replace('</body>', `
    <!-- TOAST NOTIFICATION -->
    <div id="toastNotification" class="toast-notification hidden">
        <span class="toast-icon">⚠️</span>
        <span id="toastMessage">Error message</span>
    </div>
</body>`);

// 7. JS Functions (Toggle Password, Toast, Caps Lock, Saved Email)
const customScripts = `
        // Funciones auxiliares agregadas
        function togglePasswordVisibility(inputId, btn) {
            const input = document.getElementById(inputId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            if (type === 'text') {
                btn.innerHTML = '<svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>';
            } else {
                btn.innerHTML = '<svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
            }
        }

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

        function checkCapsLock(e, warningElementId) {
            const warningEl = document.getElementById(warningElementId);
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                warningEl.classList.remove('hidden');
            } else {
                warningEl.classList.add('hidden');
            }
        }

        // On load bindings
        window.addEventListener('DOMContentLoaded', () => {
            const loginPwd = document.getElementById('loginPassword');
            if(loginPwd) loginPwd.addEventListener('keyup', (e) => checkCapsLock(e, 'capsWarningLogin'));
            
            const regPwd = document.getElementById('regPassword');
            if(regPwd) regPwd.addEventListener('keyup', (e) => checkCapsLock(e, 'capsWarningReg'));

            const savedEmail = localStorage.getItem('savedEmail');
            if (savedEmail) {
                const emailInput = document.getElementById('loginEmail');
                if(emailInput) emailInput.value = savedEmail;
                const remUser = document.getElementById('rememberUser');
                if(remUser) remUser.checked = true;
            }
        });

        // Referencias al DOM`;
html = html.replace('// Referencias al DOM', customScripts);


// 8. JS Logic edits
const jsLoginLoadingOld = `            // Efecto de carga en el botón
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Verificando...';
            submitBtn.disabled = true;`;
const jsLoginLoadingNew = `            // Efecto de carga en el botón
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner');
            const originalText = btnText.textContent;
            
            btnText.textContent = 'Verificando...';
            spinner.classList.remove('hidden');
            submitBtn.disabled = true;`;
html = html.replace(jsLoginLoadingOld, jsLoginLoadingNew);

const jsLoginRestoreOld = `                // Restaurar el botón independientemente del resultado
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;`;
const jsLoginRestoreNew = `                // Restaurar el botón independientemente del resultado
                btnText.textContent = originalText;
                spinner.classList.add('hidden');
                submitBtn.disabled = false;`;
html = html.replace(jsLoginRestoreOld, jsLoginRestoreNew);

const jsRegLoadingOld = `            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creando cuenta...';
            submitBtn.disabled = true;`;
const jsRegLoadingNew = `            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner');
            const originalText = btnText.textContent;
            
            btnText.textContent = 'Creando cuenta...';
            spinner.classList.remove('hidden');
            submitBtn.disabled = true;`;
html = html.replace(jsRegLoadingOld, jsRegLoadingNew);

const jsRegRestoreOld = `            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }`;
const jsRegRestoreNew = `            } finally {
                btnText.textContent = originalText;
                spinner.classList.add('hidden');
                submitBtn.disabled = false;
            }`;
html = html.replace(jsRegRestoreOld, jsRegRestoreNew);


// 9. Fix Guest role
html = html.replace("role: 'admin', // <-- CAMBIADO: Ahora tiene permisos completos de administrador", "role: 'viewer', // Acceso de solo lectura");


// 10. Saved email on success logic
const jsSaveLogicOld = `localStorage.setItem('session', JSON.stringify(session));`;
const jsSaveLogicNew = `                    if (document.getElementById('rememberUser').checked) {
                        localStorage.setItem('savedEmail', email);
                    } else {
                        localStorage.removeItem('savedEmail');
                    }
                    localStorage.setItem('session', JSON.stringify(session));`;
html = html.replace(jsSaveLogicOld, jsSaveLogicNew);


// 11. Alerts to showToast
html = html.replace(/alert\(/g, 'showToast(');


fs.writeFileSync('index.html', html);
console.log("update complete");

