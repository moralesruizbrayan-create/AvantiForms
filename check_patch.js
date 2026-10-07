const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

console.log("Color Terminal exists?", html.includes("Color Terminal"));
console.log("Tope de Consumo exists?", html.includes("Tope de Consumo"));
console.log("Res. Nativa exists?", html.includes("Res. Nativa"));
console.log("negligente exists?", html.includes("negligente"));
console.log("Old text exists?", html.includes("Las líneas móviles y planes asignados son de propiedad"));
console.log("New text exists?", html.includes("El responsable se hace cargo del equipo y asume el costo en caso de pérdida"));
