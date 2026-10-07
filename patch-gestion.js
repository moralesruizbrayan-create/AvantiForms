const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'gestion-actas.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove the entire @media print from gestion-actas.html
html = html.replace(/@media print\s*\{[\s\S]*?(?=\s*<\/style>)/, '');

// 2. Remove "Color Terminal:" and "Cód. Patrimonial:" from Smartphones.
// Let's do a more robust replace by finding the row containing these words.
html = html.replace(/<tr>[\s\S]*?Color Terminal:[\s\S]*?Cód\. Patrimonial:[\s\S]*?<\/tr>/i, '');
// If they are on separate rows or the HTML is slightly different, let's just do a generic replace.
html = html.replace(/<td[^>]*>Color Terminal:<\/td>\s*<td[^>]*><input[^>]*data-spec="color_terminal"[^>]*><\/td>/i, '');
html = html.replace(/<td[^>]*>Cód\. Patrimonial:<\/td>\s*<td[^>]*><input[^>]*data-spec="(?:codigo_patrimonial|codigo_activo)"[^>]*><\/td>/i, '');

// 3. Remove "Tope de Consumo:" and "PIN \/ PUK:" from Líneas Móviles.
html = html.replace(/<tr>[\s\S]*?Tope de Consumo:[\s\S]*?PIN \/ PUK:[\s\S]*?<\/tr>/gi, '');
html = html.replace(/<td[^>]*>Tope de Consumo:<\/td>[\s\S]*?<\/td>/i, '');
html = html.replace(/<td[^>]*>PIN \/ PUK:<\/td>[\s\S]*?<\/td>/i, '');

// 4. In "ACTA DE ENTREGA Y DEVOLUCIÓN DE EQUIPOS VISUALES Y PERIFÉRICOS", remove "Cód. Patrimonial:", "Res. Nativa:", "Lúmenes/Brillo:"
// We can just strip them if they exist.
html = html.replace(/<tr>[\s\S]*?Res\. Nativa:[\s\S]*?Lúmenes\/Brillo:[\s\S]*?<\/tr>/i, '');
html = html.replace(/<td[^>]*>Res\. Nativa:<\/td>[\s\S]*?<\/td>/i, '');
html = html.replace(/<td[^>]*>Lúmenes\/Brillo:<\/td>[\s\S]*?<\/td>/i, '');

// 5. Remove "negligente"
html = html.replace(/negligente/gi, '');

// 6. Update Compromiso de Responsabilidad for SIM Cards (Líneas Móviles)
// The text in "ACTA DE ENTREGA Y DEVOLUCIÓN DE LÍNEAS MÓVILES" says:
// "Las líneas móviles y planes asignados son de propiedad exclusiva de la empresa..."
const oldCompromiso = /Las líneas móviles y planes asignados son de propiedad exclusiva de la empresa y quedan bajo la estricta responsabilidad del receptor, quedando prohibido su uso en dispositivos personales o ajenos a la operación\. En caso de pérdida, daño total o robo, notificar inmediatamente al área de TI\./g;
const newCompromiso = "El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.";
html = html.replace(oldCompromiso, newCompromiso);

// 7. Remove 'dd/mm/aaaa' on empty dates. (This is a browser default for input type="date", we can handle it via CSS which was removed above, let's put it in styles.css)
// We already handled this by deleting the local @media print, wait, I need to put the date fix into styles.css.

// 8. Title Format: "Formato de Cédula Oficial con bloque institucional: Logo alineado a la izquierda. Título en caja centralizada en negro/gris oscuro formal: ACTA DE ENTREGA Y RECEPCIÓN DE EQUIPO INFORMÁTICO."
// The title might be set by javascript:
// document.getElementById('main_title').innerText = tituloBase;
// In gestion-actas.html we have: <td class="header-titles"><h1 id="main_title">ACTA DE ENTREGA...</h1></td>
// Let's modify the header titles format for better display.
html = html.replace(/<h1([^>]*)>([^<]*)<\/h1>/gi, '<h1$1 style="color: #333333; font-weight: 800; font-size: 16px;">$2</h1>');

fs.writeFileSync(filePath, html);
console.log('gestion-actas.html processed.');
