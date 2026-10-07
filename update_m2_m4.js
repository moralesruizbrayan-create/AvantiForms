const fs = require('fs');

const file = 'gestion-actas.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Replace M2 fields
const m2Old = `        <tr>
          <td class="lbl">Marca / Modelo:</td><td><textarea rows="1" data-spec="marca_modelo"></textarea></td>
          <td class="lbl">Cód. Patrimonial:</td>
          <td>
            <div class="input-wrapper">
              <textarea rows="1" id="m2_cod_patrimonial" data-spec="codigo_patrimonial" onchange="buscarEquipo(this.value)"></textarea>
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m2_cod_patrimonial').value)" title="Buscar">🔍</button>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="lbl">Tamaño/Pulgadas:</td><td><input type="text" data-spec="pulgadas_tamano" ></td>
          <td class="lbl">Res. Nativa:</td><td><input type="text" data-spec="resolucion_nativa" ></td>
        </tr>
        <tr>
          <td class="lbl">Lúmenes/Brillo:</td><td colspan="3"><input type="text" data-spec="brillo_lumenes" ></td>
        </tr>`;

const m2New = `        <tr>
          <td class="lbl">Marca / Modelo:</td><td><textarea rows="1" data-spec="marca_modelo"></textarea></td>
          <td class="lbl">Tamaño/Pulgadas:</td><td><input type="text" data-spec="pulgadas_tamano" ></td>
        </tr>`;

html = html.replace(m2Old, m2New);

// 2. Replace "negligente"
html = html.replace('daño negligente (como', 'daño (como');

// 3. Replace M4 text
const m4Old = 'Las líneas móviles y planes asignados son de propiedad exclusiva de la empresa y quedan bajo la estricta responsabilidad del receptor, quedando prohibido su uso en dispositivos personales o ajenos a la operación. En caso de pérdida, daño total o robo, notificar inmediatamente al área de TI.';
const m4New = 'El responsable se hace cargo del equipo y asume el costo en caso de pérdida y/o robo fuera de las instalaciones de la empresa, así como también del servicio técnico en caso de desperfecto por mala manipulación.';

html = html.replace(m4Old, m4New);

fs.writeFileSync(file, html, 'utf8');
console.log('gestion-actas.html updated successfully.');
