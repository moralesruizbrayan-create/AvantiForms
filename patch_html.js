const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// 1. Equipos Móviles: Eliminar "Color Terminal:" y "Cód. Patrimonial:"
// We need to look at the HTML structure for Equipos Móviles table.
// Usually they are in a <tr> with <td class="lbl">Color Terminal:</td> ...
html = html.replace(/<tr>\s*<td class="lbl">Color Terminal:[\s\S]*?<\/tr>/, '');
html = html.replace(/<td class="lbl">Cód\. Patrimonial:<\/td>\s*<td><input type="text" data-spec="codigo_patrimonial"><\/td>/g, '');

// 2. Líneas Móviles: Eliminar "Tope de Consumo:" y "PIN / PUK:"
html = html.replace(/<tr>\s*<td class="lbl">Tope de Consumo:[\s\S]*?<\/tr>/, '');
html = html.replace(/<tr>\s*<td class="lbl">PIN \/ PUK:[\s\S]*?<\/tr>/, '');
// If they are in tds inside a row:
html = html.replace(/<td class="lbl">Tope de Consumo:<\/td>\s*<td>.*?<\/td>/, '');
html = html.replace(/<td class="lbl">PIN \/ PUK:<\/td>\s*<td>.*?<\/td>/, '');

// 3. Periféricos: Eliminar "Cód. Patrimonial:", "Res. Nativa:", "Lúmenes/Brillo:"
// We might need to just match the <tr> or <td> blocks
html = html.replace(/<td class="lbl">Res\. Nativa:<\/td>\s*<td>.*?<\/td>/, '');
html = html.replace(/<td class="lbl">Lúmenes\/Brillo:<\/td>\s*<td>.*?<\/td>/, '');
html = html.replace(/negligente/g, '');

// 4. Líneas Móviles: Change commitment text
const oldText = /Las líneas móviles y planes asignados son de propiedad exclusiva de la empresa y quedan bajo la estricta responsabilidad del receptor, quedando prohibido su uso en dispositivos personales o ajenos a la operación\. En caso de pérdida, daño total o robo, notificar inmediatamente al área de TI\./g;
const newText = "El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.";
html = html.replace(oldText, newText);

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("gestion-actas.html updated successfully");
