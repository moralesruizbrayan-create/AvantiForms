const fs = require('fs');
const html = fs.readFileSync('gestion-actas.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Cód. Patrimonial:') || l.includes('Res. Nativa:') || l.includes('Lúmenes/Brillo:') || l.includes('daño negligente (como') || l.includes('Las líneas móviles y planes asignados son de propiedad')) {
    console.log(`Line ${i + 1}: ${l.trim()}`);
  }
});
