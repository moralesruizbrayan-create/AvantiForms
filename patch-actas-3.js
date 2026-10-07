const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const nuevoCompromiso = "El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.";

// Replace everything inside <div class="compromiso-box">...</div>
html = html.replace(/<div class="compromiso-box">[\s\S]*?<\/div>/g, `<div class="compromiso-box">\n          ${nuevoCompromiso}\n        </div>`);

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("gestion-actas.html updated compromisos exactly");
