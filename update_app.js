const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldCode = `        const userBadge = document.querySelector('.user-badge');

        if (userBadge) {
            // Mostrar nombre real (en mayúsculas) o la etiqueta especial de invitado
            userBadge.textContent = session.name === 'Invitado' 
                ? '👁️ INVITADO' 
                : \`HOLA, \${session.name.toUpperCase()}\`;
        }`;

const newCode = `        const userBadge = document.querySelector('.user-badge');
        const userRole = document.querySelector('.user-role');

        if (userBadge) {
            userBadge.textContent = session.name === 'Invitado' 
                ? '👁️ INVITADO' 
                : \`HOLA, \${session.name.toUpperCase()}\`;
        } else if (userRole) {
            userRole.textContent = session.name === 'Invitado' 
                ? 'Invitado (Solo Lectura)' 
                : session.name;
        }`;

app = app.replace(oldCode, newCode);
fs.writeFileSync('app.js', app, 'utf8');
