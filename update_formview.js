const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

html = html.replace(/class="form-view"/g, 'class="form-view modo-completo"');

fs.writeFileSync('gestion-actas.html', html);
console.log('Added default modo-completo class');

