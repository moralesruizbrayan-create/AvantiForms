const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove references to non-existent elements
html = html.replace(/const registerForm = document\.getElementById\('registerForm'\);\s*/, '');
html = html.replace(/const showRegister = document\.getElementById\('showRegister'\);\s*/, '');
html = html.replace(/const showLogin = document\.getElementById\('showLogin'\);\s*/, '');

// Remove the event listeners for toggling
html = html.replace(/\/\/\s*Alternar entre Login y Registro[\s\S]*?formTitle\.textContent = 'Iniciar Sesión';\s*\}\);/, '');

// Remove the logic for registration entirely
html = html.replace(/\/\/\s*==========================================\s*\/\/\s*3\. LÓGICA DE REGISTRO[\s\S]*?\}\);\s*/, '');
// Handle different encoding of "LÓGICA" in case it was modified
html = html.replace(/\/\/\s*==========================================\s*\/\/\s*3\. L[\s\S]*?GICA DE REGISTRO[\s\S]*?\}\);\s*<\/script>/, '</script>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Cleaned up obsolete JS from index.html');

