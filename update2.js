const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Normalize line endings
html = html.replace(/\r\n/g, '\n');

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

fs.writeFileSync('index.html', html);

