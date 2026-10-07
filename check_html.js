const fs = require('fs');
const html = fs.readFileSync('gestion-actas.html', 'utf8');
const lines = html.split('\n');
const results = [];
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('dni') || line.toLowerCase().includes('imei') || line.toLowerCase().includes('nro_serie') || line.toLowerCase().includes('maxlength')) {
        results.push(`Line ${i+1}: ${line.trim()}`);
    }
});
console.log(results.join('\n'));
