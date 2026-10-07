const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

if(!html.includes('href="styles.css"')) {
    html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="styles.css">\n  <script src="https://cdn.tailwindcss.com"></script>');
    fs.writeFileSync('gestion-actas.html', html, 'utf8');
    console.log('Linked styles.css');
}
