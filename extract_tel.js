const fs = require('fs');

const html = fs.readFileSync('gestion-actas.html', 'utf8');

const startIdx = html.indexOf('<div id="view_telefonos"');
let openCount = 0;
let i = startIdx;
let endIdx = -1;

while (i < html.length) {
    if (html.startsWith('<div', i)) {
        openCount++;
    } else if (html.startsWith('</div', i)) {
        openCount--;
        if (openCount === 0) {
            endIdx = i + 6;
            break;
        }
    }
    i++;
}

if (endIdx !== -1) {
    fs.writeFileSync('telefonos_form.html', html.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted telefonos form.");
}

