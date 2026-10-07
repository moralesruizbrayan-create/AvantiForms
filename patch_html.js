const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// Insert a hidden input inside the form views
html = html.replace(/<div class="form-view"/g, '<div class="form-view">\n      <input type="hidden" data-spec="codigo_activo">');

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log('Hidden inputs added.');
