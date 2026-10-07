const fs = require('fs');

let html = fs.readFileSync('gestion-actas.html', 'utf8');

// 1. Remove placeholders
html = html.replace(/placeholder="Ej\. 128 GB"/g, '');
html = html.replace(/placeholder="Ej\. 4 GB"/g, '');

// 2. Fix the typo globally
// The original typo was introduced likely via encoding corruption: DEVOLUCIÓNº or DEVOLUCI"N
// I will just use regex to match ACTA DE DEVOLUCION (in various corrupted forms) and replace it with proper text.
html = html.replace(/ACTA DE ENTREGA Y DEVOLUCI.N.\s*DE/g, 'ACTA DE ENTREGA Y DEVOLUCIÓN DE');
html = html.replace(/ACTA DE DEVOLUCI.N.\s*DE/g, 'ACTA DE DEVOLUCIÓN DE');
html = html.replace(/ACTA DE ENTREGA DE/g, 'ACTA DE ENTREGA DE'); // just in case

// Wait, the javascript string concatenation:
// titleH1.innerText = "ACTA DE DEVOLUCI"N DE " + baseTitle;
// titleH1.innerText = "ACTA DE ENTREGA Y DEVOLUCI"N DE " + baseTitle;
html = html.replace(/titleH1\.innerText = "ACTA DE DEVOLUCI[^"]*" \+ baseTitle;/g, 'titleH1.innerText = "ACTA DE DEVOLUCIÓN DE " + baseTitle;');
html = html.replace(/titleH1\.innerText = "ACTA DE ENTREGA Y DEVOLUCI[^"]*" \+ baseTitle;/g, 'titleH1.innerText = "ACTA DE ENTREGA Y DEVOLUCIÓN DE " + baseTitle;');

// Replace headers inside HTML tags
html = html.replace(/<h1>ACTA DE ENTREGA Y DEVOLUCI[^<]*<\/h1>/g, (match) => {
    if (match.includes('PCs')) return '<h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE PCs</h1>';
    if (match.includes('PERIF')) return '<h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE EQUIPOS VISUALES Y PERIFÉRICOS</h1>';
    if (match.includes('M')) {
        if (match.includes('L')) {
            if (match.includes('NEAS')) return '<h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE LÍNEAS MÓVILES</h1>';
            return '<h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE EQUIPOS MÓVILES</h1>';
        }
    }
    return match;
});

// Also fix FIRMA EMPLEADO (DEVOLUCIÓN)
html = html.replace(/FIRMA EMPLEADO \(DEVOLUCI.N\)/g, 'FIRMA EMPLEADO (DEVOLUCIÓN)');
html = html.replace(/Firmar Empleado \(Devoluci.n\)/g, 'Firmar Empleado (Devolución)');

// 3. Upgrade lineas form
const startIdx = html.indexOf('<div id="view_lineas"');
let openCount = 0;
let i = startIdx;
let endIdx = -1;

while (i < html.length) {
    if (html.startsWith('<div', i)) {
        openCount++;
    } else if (html.startsWith('</div', i)) {
        openCount--;
        if (openCount === 0) {
            endIdx = i + 6;
            break;
        }
    }
    i++;
}

if (endIdx !== -1) {
    let lineasHtml = html.substring(startIdx, endIdx);
    
    // find the detail section
    const detailStart = lineasHtml.indexOf('<h3>2. Detalle de la L');
    const detailEnd = lineasHtml.indexOf('<div class="sec-entrega">');
    
    const oldDetail = lineasHtml.substring(detailStart, detailEnd);
    
    const newDetail = `<h3>2. Detalle de la Línea Móvil (SIM Card):</h3>
      <table class="form-table">
        <tr>
          <td class="lbl">Nº de Teléfono:</td>
          <td style="width:32%;">
            <div class="input-wrapper">
              <input type="text" id="m4_nro_telefono" data-spec="nro_telefono" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m4_nro_telefono').value)" title="Buscar en Base de Datos">🔍</button>
              </div>
            </div>
          </td>
          <td class="lbl">Operador:</td>
          <td><input type="text" data-spec="operador"></td>
        </tr>
        <tr>
          <td class="lbl">Serie SIM (ICCID):</td>
          <td colspan="3">
            <div class="input-wrapper">
              <input type="text" id="m4_serie_sim" data-spec="serie_sim" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m4_serie_sim').value)" title="Buscar en Base de Datos">🔍</button>
                <button type="button" class="btn-scan" onclick="abrirEscaner('m4_serie_sim')" title="Escanear Código">📷</button>
              </div>
            </div>
          </td>
        </tr>
        <tr><td colspan="4" class="subhead">Especificaciones del Plan Corporativo</td></tr>
        <tr>
          <td class="lbl">Tipo de SIM:</td>
          <td>
             <div style="display: flex; gap: 10px;">
                <label><input type="radio" name="tipo_sim_m4" data-spec="sim_fisica" value="Física"> SIM Física</label>
                <label><input type="radio" name="tipo_sim_m4" data-spec="sim_esim" value="eSIM"> eSIM</label>
             </div>
          </td>
          <td class="lbl">Tope de Consumo:</td>
          <td>
             <div style="display: flex; gap: 10px;">
                <label><input type="radio" name="tope_m4" data-spec="tope_abierto" value="Abierto"> Abierto</label>
                <label><input type="radio" name="tope_m4" data-spec="tope_cerrado" value="Cerrado"> Cerrado</label>
             </div>
          </td>
        </tr>
        <tr>
          <td class="lbl">Plan de Datos:</td>
          <td><input type="text" data-spec="plan_datos"></td>
          <td class="lbl">PIN / PUK:</td>
          <td><input type="text" data-spec="pin_puk"></td>
        </tr>
      </table>

      `;
      
    lineasHtml = lineasHtml.replace(oldDetail, newDetail);
    
    // We should also replace the start tags and headers inside lineasHtml just to be absolutely sure
    lineasHtml = lineasHtml.replace(/data-titulo-base="[^"]*"/, 'data-titulo-base="LÍNEAS MÓVILES"');
    lineasHtml = lineasHtml.replace(/<h1>.*<\/h1>/, '<h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE LÍNEAS MÓVILES</h1>');
    
    html = html.substring(0, startIdx) + lineasHtml + html.substring(endIdx);
    
}

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log("Tasks completed");

