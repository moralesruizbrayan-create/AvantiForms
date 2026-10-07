const fs = require('fs');

let html = fs.readFileSync('gestion-actas.html', 'utf8');

// The section we want to replace starts after <h3>2. Detalle del Equipo Móvil (Smartphone):</h3>
// And ends right before <div class="sec-entrega">

function extractBlock(html, startToken, endToken) {
    let startIndex = html.indexOf(startToken);
    if (startIndex === -1) return null;
    let endIndex = html.indexOf(endToken, startIndex);
    if (endIndex === -1) return null;
    return html.substring(startIndex, endIndex);
}

const startToken = '<h3>2. Detalle del Equipo M\u00F3vil (Smartphone):</h3>'; // It might be encoded differently, let's use a regex or just find '2. Detalle' inside view_telefonos

// Since powershell encoding corrupted the text when reading, let's find the exact block using string manipulation
let viewIndex = html.indexOf('<div id="view_telefonos"');
let sectionStart = html.indexOf('<h3>2.', viewIndex);
let sectionEnd = html.indexOf('<div class="sec-entrega">', sectionStart);

if (sectionStart !== -1 && sectionEnd !== -1) {
    const oldTable = html.substring(sectionStart, sectionEnd);

    const newTable = `<h3>2. Detalle del Equipo Móvil (Smartphone):</h3>
      <table class="form-table">
        <tr>
          <td class="lbl">Marca / Modelo:</td><td style="width:32%;"><textarea rows="1" data-spec="marca_modelo"></textarea></td>
          <td class="lbl">Nº de Serie:</td>
          <td>
            <div class="input-wrapper">
              <input type="text" id="m3_nro_serie" data-spec="nro_serie" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m3_nro_serie').value)" title="Buscar en Base de Datos">🔍</button>
                <button type="button" class="btn-scan" onclick="abrirEscaner('m3_nro_serie')" title="Escanear Código">📷</button>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="lbl">IMEI 1:</td>
          <td>
            <div class="input-wrapper">
              <input type="text" id="m3_imei1" data-spec="imei_1" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m3_imei1').value)" title="Buscar en Base de Datos">🔍</button>
                <button type="button" class="btn-scan" onclick="abrirEscaner('m3_imei1')" title="Escanear Código">📷</button>
              </div>
            </div>
          </td>
          <td class="lbl">IMEI 2:</td>
          <td>
            <div class="input-wrapper">
              <input type="text" id="m3_imei2" data-spec="imei_2" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m3_imei2').value)" title="Buscar en Base de Datos">🔍</button>
                <button type="button" class="btn-scan" onclick="abrirEscaner('m3_imei2')" title="Escanear Código">📷</button>
              </div>
            </div>
          </td>
        </tr>
        
        <tr><td colspan="4" class="subhead">Especificaciones Técnicas e Identificadores</td></tr>
        <tr>
          <td class="lbl">Color Terminal:</td><td><input type="text" data-spec="color_terminal"></td>
          <td class="lbl">Capacidad (ROM):</td><td><input type="text" data-spec="capacidad" placeholder="Ej. 128 GB"></td>
        </tr>
        <tr>
          <td class="lbl">Memoria RAM:</td><td><input type="text" data-spec="ram_movil" placeholder="Ej. 4 GB"></td>
          <td class="lbl">Cód. Patrimonial:</td><td><textarea rows="1" data-spec="codigo_patrimonial" onchange="buscarEquipo(this.value)"></textarea></td>
        </tr>

        <tr><td colspan="4" class="subhead">Estado de Componentes y Operatividad</td></tr>
        <tr>
          <td class="lbl">Estado Pantalla:</td>
          <td>
            <div style="display: flex; align-items: center; gap: 12px; white-space: nowrap;">
              <label style="display: flex; align-items: center; cursor: pointer; margin: 0;"><input type="checkbox" data-spec="pant_intacta" class="excl-check" data-group="pantalla_m3" style="margin-right: 4px;" value="Intacta"> Intacta</label>
              <label style="display: flex; align-items: center; cursor: pointer; margin: 0;"><input type="checkbox" data-spec="pant_fisurada" class="excl-check" data-group="pantalla_m3" style="margin-right: 4px;" value="Fisurada"> Fisurada</label>
            </div>
          </td>
          <td class="lbl">Sistema Operativo:</td>
          <td>
            <div style="display: flex; align-items: center; gap: 12px; white-space: nowrap;">
              <label style="display: flex; align-items: center; cursor: pointer; margin: 0;"><input type="checkbox" data-spec="so_android" class="excl-check" data-group="so_m3" style="margin-right: 4px;" value="Android"> Android</label>
              <label style="display: flex; align-items: center; cursor: pointer; margin: 0;"><input type="checkbox" data-spec="so_ios" class="excl-check" data-group="so_m3" style="margin-right: 4px;" value="iOS"> iOS</label>
            </div>
          </td>
        </tr>

        <tr><td colspan="4" class="subhead">Accesorios e Implementos de Protección</td></tr>
        <tr>
          <td colspan="4" style="padding: 12px 14px !important;">
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <label class="inline-flex"><input type="checkbox" data-spec="acc_cargador" value="Cargador de Pared"> Cargador (Cubo)</label>
                <label class="inline-flex"><input type="checkbox" data-spec="acc_cable" value="Cable USB"> Cable USB</label>
                <label class="inline-flex"><input type="checkbox" data-spec="acc_case" value="Funda Protectora"> Case / Funda Protectora</label>
                <label class="inline-flex"><input type="checkbox" data-spec="acc_lamina" value="Lámina de Vidrio"> Mica / Lámina de Vidrio</label>
                <label class="inline-flex"><input type="checkbox" data-spec="acc_auriculares" value="Auriculares"> Auriculares</label>
            </div>
            <div style="margin-top:8px; display:flex; align-items:center;">
                <span style="font-weight:bold; margin-right:8px; color: var(--text-secondary);">Otros:</span>
                <textarea rows="1" data-spec="acc_otros_movil" style="flex-grow:1;"></textarea>
            </div>
          </td>
        </tr>
      </table>

      `;

    html = html.replace(oldTable, newTable);
    fs.writeFileSync('gestion-actas.html', html, 'utf8');
    console.log("Successfully upgraded the mobile form structure.");
} else {
    console.log("Could not find the section. sectionStart:", sectionStart, "sectionEnd:", sectionEnd);
}

