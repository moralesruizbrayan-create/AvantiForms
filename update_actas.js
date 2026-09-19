const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const script = `
  // PRE-LLENAR DATOS DESDE URL (INTEGRACIÓN CON DIRECTORIO)
  window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      if(params.has('dni')) {
          const dni = params.get('dni');
          const nombre = params.get('nombre');
          const area = params.get('area');
          const cargo = params.get('cargo');
          
          document.querySelectorAll('[data-field="dni_empleado"]').forEach(el => el.value = dni || '');
          document.querySelectorAll('[data-field="nombre_empleado"]').forEach(el => el.value = nombre || '');
          document.querySelectorAll('[data-field="area_empleado"]').forEach(el => el.value = area || '');
          document.querySelectorAll('[data-field="cargo_empleado"]').forEach(el => el.value = cargo || '');
      }
  });
</body>
</html>`;

html = html.replace(/<\/body>\s*<\/html>/i, script);
fs.writeFileSync('gestion-actas.html', html);
console.log('done!');

