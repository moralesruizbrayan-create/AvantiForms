const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const regex = /<div class="signature-section">\s*<div class="signature-block">\s*<div id="(box_f[13]_m[1-4])" class="signature-trigger-box" onclick="abrirModalFirma\('(f[13]_m[1-4])'\)"><span id="(lbl_f[13]_m[1-4])">([^<]+)<\/span><img id="\2" class="signature-runtime-img" style="display:none;"><\/div>\s*<div class="signature-line"><\/div><strong>([^<]+)<\/strong>\s*<div class="signature-field-group"><span>DNI:<\/span><input type="text" data-field="([^"]+)"><\/div>\s*<\/div>\s*<div class="signature-block">\s*<div id="(box_f[24]_m[1-4])" class="signature-trigger-box" onclick="abrirModalFirma\('(f[24]_m[1-4])'\)"><span id="(lbl_f[24]_m[1-4])">([^<]+)<\/span><img id="\8" class="signature-runtime-img" style="display:none;"><\/div>\s*<div class="signature-line"><\/div><strong>([^<]+)<\/strong>\s*<div class="signature-field-group"><span>DNI:<\/span><input type="text" data-field="([^"]+)"><\/div>\s*<\/div>\s*<\/div>/g;

let count = 0;
html = html.replace(regex, (match, box1, id1, lbl1, text1, title1, dni1, box2, id2, lbl2, text2, title2, dni2) => {
  count++;
  return `<div class="signature-section">
          <table class="sig-formal-table">
            <tr>
              <td class="sig-formal-cell">
                <div class="sig-formal-title">${title1}</div>
                <div class="sig-formal-body">
                  <div class="sig-formal-row">
                    <div class="sig-formal-box-firma">
                      <div id="${box1}" class="signature-trigger-box" onclick="abrirModalFirma('${id1}')"><span id="${lbl1}">${text1}</span><img id="${id1}" class="signature-runtime-img" style="display:none;"></div>
                      <div class="sig-formal-label">Firma</div>
                    </div>
                    <div class="sig-formal-box-huella">
                      <div class="huella-espacio"></div>
                      <div class="sig-formal-label">Huella</div>
                    </div>
                  </div>
                  <table class="sig-formal-details">
                    <tr><td>Nombres:</td><td><input type="text" data-field="nombre_${dni1}"></td></tr>
                    <tr><td>DNI:</td><td><input type="text" data-field="${dni1}"></td></tr>
                    <tr><td>Fecha:</td><td><input type="date" data-field="fecha_${dni1}"></td></tr>
                  </table>
                </div>
              </td>
              <td class="sig-formal-cell">
                <div class="sig-formal-title">${title2}</div>
                <div class="sig-formal-body">
                  <div class="sig-formal-row">
                    <div class="sig-formal-box-firma">
                      <div id="${box2}" class="signature-trigger-box" onclick="abrirModalFirma('${id2}')"><span id="${lbl2}">${text2}</span><img id="${id2}" class="signature-runtime-img" style="display:none;"></div>
                      <div class="sig-formal-label">Firma</div>
                    </div>
                    <div class="sig-formal-box-huella">
                      <div class="huella-espacio"></div>
                      <div class="sig-formal-label">Huella</div>
                    </div>
                  </div>
                  <table class="sig-formal-details">
                    <tr><td>Nombres:</td><td><input type="text" data-field="nombre_${dni2}"></td></tr>
                    <tr><td>DNI:</td><td><input type="text" data-field="${dni2}"></td></tr>
                    <tr><td>Fecha:</td><td><input type="date" data-field="fecha_${dni2}"></td></tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </div>`;
});

console.log("Matched and replaced signatures: ", count);

// Header CSS replacements
html = html.replace(/\.header-table \{ width: 100%; border-collapse: collapse; margin-bottom: 24px; border-bottom: 3px solid #16A34A; \}/,
  ".header-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); border-radius: 8px; overflow: hidden; }");

html = html.replace(/\.header-logo \{ width: 85px; padding-bottom: 12px; vertical-align: middle; text-align: left; \}/,
  ".header-logo { width: 140px; padding: 12px; border-right: 1px solid var(--border-color); vertical-align: middle; text-align: center; background: #fff; }");

html = html.replace(/\.header-logo img \{ width: 100%; max-height: 65px; object-fit: contain; mix-blend-multiply; \}/,
  ".header-logo img { width: 100px; max-height: 50px; object-fit: contain; mix-blend-multiply; margin: 0 auto; display: block; }");

html = html.replace(/\.header-titles \{ vertical-align: middle; padding-bottom: 12px; padding-left: 10px; text-align: left; \}/,
  ".header-titles { vertical-align: middle; padding: 12px 20px; text-align: center; background-color: var(--subhead-bg); }");

html = html.replace(/\.header-titles h1 \{ font-size: 20px; color: #16A34A; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: -0\.5px; line-height: 1\.2; \}/,
  ".header-titles h1 { font-size: 16px; color: var(--text-color); margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3; }");


// Print Header Replacements
html = html.replace(/\.header-table \{ margin-bottom: 12px !important; border-bottom: 2px solid #16A34A !important; padding-bottom: 4px !important; \}/,
  ".header-table { border: 2px solid #000 !important; margin-bottom: 15px !important; border-radius: 0 !important; box-shadow: none !important; }");

html = html.replace(/\.header-logo \{ width: 70px !important; padding-bottom: 8px !important; \}/,
  ".header-logo { width: 120px !important; border-right: 2px solid #000 !important; padding: 5px !important; background: transparent !important; }");

html = html.replace(/\.header-logo img \{ width: 60px !important; height: auto !important; max-height: 60px !important; \}/,
  ".header-logo img { width: 90px !important; max-height: 45px !important; }");

html = html.replace(/\.header-titles \{ padding-bottom: 8px !important; \}/,
  ".header-titles { padding: 8px !important; background-color: #F1F5F9 !important; text-align: center !important; }");

html = html.replace(/\.header-titles h1 \{ font-size: 15px !important; color: #16A34A !important; margin:0 !important; padding:0 !important; letter-spacing: 0 !important; \}/,
  ".header-titles h1 { font-size: 13px !important; color: #000 !important; font-weight: 800 !important; margin: 0 !important; letter-spacing: 0 !important; }");

// Add body::before { display: none !important; } to print CSS
html = html.replace(/body \{ background: #FFFFFF !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; \}/,
  "body { background: #FFFFFF !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n      body::before { display: none !important; }");

// Fix the Scale 
html = html.replace(/zoom: 0\.92 !important;/g, "zoom: 1 !important;");
html = html.replace(/transform: scale\(0\.92\) !important;/g, "transform: scale(1) !important;");

const newCSS = `
    /* FIRMAS FORMALES */
    .sig-formal-table { width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed; }
    .sig-formal-cell { border: 1px solid var(--border-color); width: 50%; vertical-align: top; }
    .sig-formal-cell:first-child { border-right: none; }
    .sig-formal-title { background: var(--subhead-bg); color: var(--text-color); font-weight: 700; font-size: 11px; text-transform: uppercase; padding: 6px 10px; border-bottom: 1px solid var(--border-color); text-align: center; letter-spacing: 0.5px; }
    .sig-formal-body { padding: 12px; }
    .sig-formal-row { display: flex; gap: 15px; margin-bottom: 12px; }
    .sig-formal-box-firma { flex-grow: 1; border: 1px dashed var(--input-border); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 6px; position: relative; min-height: 80px; }
    .sig-formal-box-huella { width: 65px; height: 80px; border: 1px solid var(--input-border); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 6px; }
    .sig-formal-label { font-size: 9px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; margin-top: 4px; border-top: 1px solid var(--border-color); width: 80%; text-align: center; padding-top: 4px; }
    .huella-espacio { flex-grow: 1; }
    .sig-formal-details { width: 100%; border-collapse: collapse; font-size: 11px; }
    .sig-formal-details td { padding: 4px 0; vertical-align: bottom; }
    .sig-formal-details td:first-child { width: 60px; font-weight: 600; color: var(--text-secondary); }
    .sig-formal-details input { width: 100% !important; border: none !important; border-bottom: 1px dashed var(--input-border) !important; background: transparent !important; border-radius: 0 !important; padding: 2px 4px !important; color: var(--text-color) !important; font-size: 11px !important; }
    .sig-formal-details input:focus { border-bottom: 1px dashed #16A34A !important; box-shadow: none !important; }
`;

const newPrintCSS = `
      .sig-formal-table { margin-top: 15px !important; border: 2px solid #000 !important; }
      .sig-formal-cell { border: 1px solid #000 !important; }
      .sig-formal-cell:first-child { border-right: 1px solid #000 !important; }
      .sig-formal-title { background: #F1F5F9 !important; color: #000 !important; border-bottom: 1px solid #000 !important; font-size: 10px !important; padding: 4px !important; }
      .sig-formal-body { padding: 8px !important; }
      .sig-formal-box-firma, .sig-formal-box-huella { border: 1px solid #000 !important; border-radius: 0 !important; min-height: 60px !important; }
      .sig-formal-box-huella { width: 50px !important; height: 60px !important; }
      .sig-formal-label { color: #000 !important; border-top: 1px solid #000 !important; font-size: 7.5px !important; padding-top: 2px !important; margin-top: 2px !important; border-style: dotted !important; }
      .sig-formal-details { font-size: 9px !important; }
      .sig-formal-details td:first-child { color: #000 !important; width: 45px !important; }
      .sig-formal-details input { font-size: 9px !important; color: #000 !important; border-bottom: 1px dotted #000 !important; }
      .signature-trigger-box { border: none !important; background: transparent !important; height: 100% !important; min-height: 40px !important; margin: 0 !important; position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; }
      .signature-runtime-img { max-height: 40px !important; object-fit: contain !important; }
      .signature-trigger-box span { display: none !important; }
`;

// Insert the new CSS classes
html = html.replace(/(\.custom-toast\.show \{ top: 24px; \})/, `$1\n${newCSS}`);
html = html.replace(/(\.signature-field-group input\[type="text"\] \{ font-size: 9px !important; border-bottom: 1px dotted #000 !important; color: #000 !important; text-align: center !important; \})/, `$1\n${newPrintCSS}`);

// Replace the compromiso-box print CSS
html = html.replace(/\.compromiso-box \{ font-size: 8\.5px !important; padding: 6px 10px !important; border: 1px solid #CBD5E1 !important; border-left: 3px solid #16A34A !important; margin-top: 4px !important; page-break-inside: avoid; line-height: 1\.2 !important; background: transparent !important; color: #000 !important;\}/,
  ".compromiso-box { font-size: 8.5px !important; padding: 8px 12px !important; border: 1px solid #000 !important; border-left: 4px solid #000 !important; margin-top: 5px !important; margin-bottom: 5px !important; page-break-inside: avoid; line-height: 1.4 !important; background: transparent !important; color: #000 !important; white-space: normal !important; text-align: justify !important; }");

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log('Modified HTML structure successfully.');
