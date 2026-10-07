const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// 1. Remove the dark box from the header
html = html.replace(/\.header-titles\s*\{\s*vertical-align:\s*middle;\s*padding:\s*12px\s*20px;\s*text-align:\s*center;\s*background-color:\s*#1e293b;\s*\}/g,
    ".header-titles { vertical-align: middle; padding: 12px 20px; text-align: center; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }");
html = html.replace(/\.header-titles h1\s*\{\s*font-size:\s*16px;\s*color:\s*#ffffff\s*!important;\s*margin:\s*0;\s*font-weight:\s*800;\s*text-transform:\s*uppercase;\s*letter-spacing:\s*0\.5px;\s*line-height:\s*1\.3;\s*\}/g,
    ".header-titles h1 { font-size: 16px; color: #16a34a !important; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3; }");

// 2. Remove 'Fecha:' from ALL signature details
html = html.replace(/<tr><td>Fecha:<\/td><td><input type="date" data-field="fecha_firma[^"]*"><\/td><\/tr>/g, '');
html = html.replace(/<tr><td>Fecha:<\/td><td><input type="text" data-field="fecha_firma[^"]*"><\/td><\/tr>/g, '');

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("Updated gestion-actas.html header and removed fecha from signatures");
