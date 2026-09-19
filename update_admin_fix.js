const fs = require('fs');
let html = fs.readFileSync('admin-empleados.html', 'utf8');

const target = `      const payload = {
        id_empleado: editEmpleadoId, // Será NULL si es creación, y tendrá un ID si es edición
        dni: document.getElementById('emp-dni').value,
        nombre_completo: document.getElementById('emp-nombre').value.toUpperCase(),
        area: document.getElementById('emp-area').value.toUpperCase(),
        cargo: document.getElementById('emp-cargo').value.toUpperCase(),
        correo_corp: document.getElementById('emp-correo').value.toLowerCase(),
        centro_costo: document.getElementById('emp-cc').value.toUpperCase()
      };`;

const replacement = `      const dni = document.getElementById('emp-dni').value.replace(/\\s+/g, '').trim();
      const cc = document.getElementById('emp-cc').value.replace(/\\s+/g, ' ').trim().toUpperCase();
      const nombre = toCapitalize(document.getElementById('emp-nombre').value.replace(/\\s+/g, ' ').trim());
      const area = toCapitalize(document.getElementById('emp-area').value.replace(/\\s+/g, ' ').trim());
      const cargo = toCapitalize(document.getElementById('emp-cargo').value.replace(/\\s+/g, ' ').trim());
      const correo = document.getElementById('emp-correo').value.replace(/\\s+/g, '').trim().toLowerCase();

      const payload = {
        id_empleado: editEmpleadoId,
        dni: dni,
        nombre_completo: nombre,
        area: area,
        cargo: cargo,
        correo_corp: correo,
        centro_costo: cc
      };`;

// Note: replace using regex ignoring exact whitespace
const targetRegex = /const payload = \{\s*id_empleado: editEmpleadoId,[^}]+\};/g;

html = html.replace(targetRegex, replacement);

fs.writeFileSync('admin-empleados.html', html);
console.log('payload fixed!');

