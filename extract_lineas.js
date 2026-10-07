const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const startIdx = html.indexOf('<div id="view_lineas"');
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
    fs.writeFileSync('lineas_form.html', html.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted lineas form.");
}

