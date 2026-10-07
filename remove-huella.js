const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'gestion-actas.html');
let html = fs.readFileSync(filePath, 'utf8');

// Remove all instances of sig-formal-box-huella
html = html.replace(/<div class="sig-formal-box-huella">[\s\S]*?<\/div>\s*<\/div>/g, '</div>');

// The replacement above matches the <div class="sig-formal-box-huella"> and its inner contents up to the closing </div>
// Wait, the regex above: `[\s\S]*?<\/div>\s*<\/div>` might match too much or break the closing tags.
// Let's do it safer:
const huellaRegex = /<div class="sig-formal-box-huella">\s*<div class="huella-espacio"><\/div>\s*<div class="sig-formal-label">Huella<\/div>\s*<\/div>/g;
html = html.replace(huellaRegex, '');


// Remove the "Fecha:" row for TI (entrega and devolucion)
const fechaTiEntRegex = /<tr><td>Fecha:<\/td><td><input type="date" data-field="fecha_dni_firma_ti_ent"><\/td><\/tr>/g;
const fechaTiDevRegex = /<tr><td>Fecha:<\/td><td><input type="date" data-field="fecha_dni_firma_ti_dev"><\/td><\/tr>/g;

html = html.replace(fechaTiEntRegex, '');
html = html.replace(fechaTiDevRegex, '');


fs.writeFileSync(filePath, html);
console.log('Huellas y fechas TI removidas.');
