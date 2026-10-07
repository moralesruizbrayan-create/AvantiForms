const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');
html = html.replace("setVal('tipo_equipo', eq.tipo_equipo);", "setVal('codigo_activo', eq.codigo_activo);\n        setVal('tipo_equipo', eq.tipo_equipo);");
fs.writeFileSync('gestion-actas.html', html, 'utf8');
