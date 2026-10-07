const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

html = html.replace('<h3>Equipos Informáticos (PCs)</h3>', '<h3>Equipos Informáticos (PCs)</h3>\\n                <p class="tech-label">Hardware & Endpoints</p>');
html = html.replace('<h3>Periféricos / Monitores</h3>', '<h3>Periféricos / Monitores</h3>\\n                <p class="tech-label">Monitores & Accesorios</p>');
html = html.replace('<h3>Teléfonos Móviles</h3>', '<h3>Teléfonos Móviles</h3>\\n                <p class="tech-label">Dispositivos Corporativos</p>');
html = html.replace('<h3>Chips / Líneas Móviles</h3>', '<h3>Chips / Líneas Móviles</h3>\\n                <p class="tech-label">Gestión de SIM Cards</p>');
html = html.replace('<h3>Directorio de Empleados</h3>', '<h3>Directorio de Empleados</h3>\\n                        <p class="tech-label">Gestión de Personal</p>');
html = html.replace('<h3>Inventario</h3>', '<h3>Inventario</h3>\\n                        <p class="tech-label">Base de Datos General</p>');

fs.writeFileSync('dashboard.html', html.replace(/\\n/g, '\n'), 'utf8');
console.log('Labels added');
