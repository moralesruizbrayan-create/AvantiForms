const fs = require('fs');

// STYLES.CSS
let css = fs.readFileSync('styles.css', 'utf8');

// Update input styling
css = css.replace(/border: 2px solid transparent;/, 'border: 1px solid #334155; transition: all 0.3s ease;');
css = css.replace(/border-color: var\(--avanti-green\)/g, 'border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2)');

const newStyles = `
/* =========================================
   9. FUERZA DE CONTRASEÑA Y VALIDACIÓN
   ========================================= */
.password-strength-container {
    margin-top: 10px;
    width: 100%;
}
.strength-bar-bg {
    width: 100%;
    height: 5px;
    background-color: #334155;
    border-radius: 4px;
    overflow: hidden;
}
.strength-bar-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s ease, background-color 0.3s ease;
}
.strength-text {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
}
.match-warning, .match-success {
    font-size: 0.8rem;
    margin-top: 6px;
    display: none;
    align-items: center;
    gap: 4px;
}
.match-warning { color: #ef4444; }
.match-success { color: #10b981; }
.match-warning.visible, .match-success.visible {
    display: flex;
}
`;
if (!css.includes('.password-strength-container')) {
    css += '\n' + newStyles;
}
fs.writeFileSync('styles.css', css);


// INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/\r\n/g, '\n'); // Normalize

// 1. Add placeholders to register fields and update structure
html = html.replace('<input type="text" id="regName" required>', '<input type="text" id="regName" placeholder="Ej. Brayan Morales Ruiz" required>');
html = html.replace('<input type="email" id="regEmail" required>', '<input type="email" id="regEmail" placeholder="nombre.apellido@agricolaavanti.pe" required>');

const oldRegPwdBlock = `<div class="password-wrapper">
                        <input type="password" id="regPassword" required>
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('regPassword', this)">
                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <div id="capsWarningReg" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                </div>`;
const newRegPwdBlock = `<div class="password-wrapper">
                        <input type="password" id="regPassword" placeholder="Crea una contraseña segura" required>
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('regPassword', this)">
                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <div id="capsWarningReg" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                    
                    <!-- Fuerza de contraseña -->
                    <div class="password-strength-container">
                        <div class="strength-bar-bg">
                            <div id="strengthFill" class="strength-bar-fill"></div>
                        </div>
                        <div class="strength-text">
                            <span>Nivel de seguridad</span>
                            <span id="strengthLabel">Mínimo 6 caracteres</span>
                        </div>
                    </div>
                </div>

                <!-- Confirmar Contraseña -->
                <div class="input-group-mate password-group">
                    <label for="regPasswordConfirm">Confirmar Contraseña</label>
                    <div class="password-wrapper">
                        <input type="password" id="regPasswordConfirm" placeholder="Repite tu contraseña" required>
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('regPasswordConfirm', this)">
                            <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <div id="capsWarningRegConfirm" class="caps-warning hidden">⚠️ Bloqueo de mayúsculas activado</div>
                    <div id="matchWarning" class="match-warning">⚠️ Las contraseñas no coinciden</div>
                    <div id="matchSuccess" class="match-success">✓ Las contraseñas coinciden</div>
                </div>`;
html = html.replace(oldRegPwdBlock, newRegPwdBlock);

// Update JS for validation and strength logic
const regLogicStr = `            const password = document.getElementById('regPassword').value;`;
const regValidationChecks = `            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;
            
            if (password.length < 6) {
                showToast('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            if (password !== passwordConfirm) {
                showToast('Las contraseñas no coinciden.');
                return;
            }`;
html = html.replace(regLogicStr, regValidationChecks);

// Inject real-time strength JS
const jsStrengthLogic = `
        // Validacion de contraseña en tiempo real
        window.addEventListener('DOMContentLoaded', () => {
            const regPwd = document.getElementById('regPassword');
            const regPwdConfirm = document.getElementById('regPasswordConfirm');
            const strengthFill = document.getElementById('strengthFill');
            const strengthLabel = document.getElementById('strengthLabel');
            const matchWarning = document.getElementById('matchWarning');
            const matchSuccess = document.getElementById('matchSuccess');

            function checkMatch() {
                if(!regPwd || !regPwdConfirm) return;
                const p1 = regPwd.value;
                const p2 = regPwdConfirm.value;
                if (p2.length === 0) {
                    matchWarning.classList.remove('visible');
                    matchSuccess.classList.remove('visible');
                    return;
                }
                if (p1 !== p2) {
                    matchWarning.classList.add('visible');
                    matchSuccess.classList.remove('visible');
                } else {
                    matchWarning.classList.remove('visible');
                    matchSuccess.classList.add('visible');
                }
            }

            if (regPwd) {
                regPwd.addEventListener('input', () => {
                    const val = regPwd.value;
                    let strength = 0;
                    
                    if (val.length >= 6) strength += 1;
                    if (val.length >= 8) strength += 1;
                    if (/[A-Z]/.test(val)) strength += 1;
                    if (/[0-9]/.test(val)) strength += 1;
                    if (/[^A-Za-z0-9]/.test(val)) strength += 1;

                    if (val.length === 0) {
                        strengthFill.style.width = '0%';
                        strengthLabel.textContent = 'Mínimo 6 caracteres';
                        strengthLabel.style.color = '#94a3b8';
                    } else if (val.length < 6) {
                        strengthFill.style.width = '20%';
                        strengthFill.style.backgroundColor = '#ef4444'; 
                        strengthLabel.textContent = 'Muy corta';
                        strengthLabel.style.color = '#ef4444';
                    } else if (strength <= 2) {
                        strengthFill.style.width = '40%';
                        strengthFill.style.backgroundColor = '#facc15'; 
                        strengthLabel.textContent = 'Débil';
                        strengthLabel.style.color = '#facc15';
                    } else if (strength <= 3) {
                        strengthFill.style.width = '70%';
                        strengthFill.style.backgroundColor = '#3b82f6'; 
                        strengthLabel.textContent = 'Aceptable';
                        strengthLabel.style.color = '#3b82f6';
                    } else {
                        strengthFill.style.width = '100%';
                        strengthFill.style.backgroundColor = '#10b981'; 
                        strengthLabel.textContent = 'Segura';
                        strengthLabel.style.color = '#10b981';
                    }
                    checkMatch();
                });
            }
            if (regPwdConfirm) {
                regPwdConfirm.addEventListener('input', checkMatch);
                regPwdConfirm.addEventListener('keyup', (e) => checkCapsLock(e, 'capsWarningRegConfirm'));
            }
        });
        
        // Referencias al DOM`;
html = html.replace('// Referencias al DOM', jsStrengthLogic);

fs.writeFileSync('index.html', html);
console.log('Update 3 successful');

