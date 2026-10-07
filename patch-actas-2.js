const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// 1. Fix header-titles CSS block
html = html.replace(/\.header-titles\s*\{\s*vertical-align:\s*middle;\s*padding:\s*12px\s*20px;\s*text-align:\s*center;\s*background-color:\s*var\(--subhead-bg\);\s*\}/g, 
    ".header-titles { vertical-align: middle; padding: 12px 20px; text-align: center; background-color: #1e293b; }");
html = html.replace(/\.header-titles h1\s*\{\s*font-size:\s*16px;\s*color:\s*var\(--text-color\);\s*margin:\s*0;\s*font-weight:\s*800;\s*text-transform:\s*uppercase;\s*letter-spacing:\s*0\.5px;\s*line-height:\s*1\.3;\s*\}/g,
    ".header-titles h1 { font-size: 16px; color: #ffffff !important; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3; }");

// 2. Remove inline style from h1 tags in header-titles
html = html.replace(/<h1 style="color: #333333; font-weight: 800; font-size: 16px;">/g, "<h1>");

// 3. Update all compromisos text
const compromisoRegex = /<p>El receptor declara haber recibido.*?<\/p>/g;
const nuevoCompromiso = "<p style=\"text-align: justify; line-height: 1.4;\">El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.</p>";
html = html.replace(compromisoRegex, nuevoCompromiso);

// Same for the other variants of the commitment clause
const compromisoRegex2 = /<p style="margin: 0; text-align: justify; color: #1e293b; line-height: 1.5;">El responsable se hace cargo del equipo y asume el costo en caso de p.*?<\/p>/g;
html = html.replace(compromisoRegex2, nuevoCompromiso);

// Also replace the old text that was replaced previously but might have different formatting
const compromisoRegex3 = /<p>El responsable se hace cargo del equipo y asume el costo en caso de pérdida y\/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación\.<\/p>/g;
html = html.replace(compromisoRegex3, nuevoCompromiso);

// Fix the lineas moviles one we replaced earlier, if it lacked the <p> styles
html = html.replace(/<p>El responsable se hace cargo del equipo y asume el costo en caso de pérdida y\/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación\./g, 
    "<p style=\"text-align: justify; line-height: 1.4;\">El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.");

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("gestion-actas.html fixed headers and compromisos");
