const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// Wipe out any row that starts with <tr><td>Fecha:</td>
html = html.replace(/<tr>\s*<td>Fecha:<\/td>\s*<td>.*?<\/td>\s*<\/tr>/g, '');

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("Wiped out all signature Fecha rows");
