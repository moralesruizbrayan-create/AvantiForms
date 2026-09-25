const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// Fix script block: Find where </script> is right before // PRE-LLENAR and move it
html = html.replace(/<\/script>\s*\/\/\s*PRE-LLENAR DATOS DESDE URL[\s\S]*?\}\);\s*/, (match) => {
    let codeOnly = match.replace(/<\/script>\s*/, '');
    return codeOnly + "\n    </script>\n";
});

// Fix corrupted Emojis
const signatureIds = ['f1_m1', 'f2_m1', 'f3_m1', 'f4_m1', 
                      'f1_m2', 'f2_m2', 'f3_m2', 'f4_m2', 
                      'f1_m3', 'f2_m3', 'f3_m3', 'f4_m3', 
                      'f1_m4', 'f2_m4', 'f3_m4', 'f4_m4'];

signatureIds.forEach(id => {
    let search = new RegExp(`<span id="lbl_${id}">[^<]*Firmar (Encargado TI \\(Retorno\\)|Encargado TI|Empleado Receptor|Empleado \\(Devoluci[^<]*\\)|Empleado)</span>`);
    html = html.replace(search, (match, p1) => {
        if(p1.includes('Devoluci')) p1 = 'Empleado (Devolución)';
        return `<span id="lbl_${id}">✍️ Firmar ${p1}</span>`;
    });
});

html = html.replace(/Y" Evidencia Fotogrǭfica/g, '📷 Evidencia Fotográfica');
html = html.replace(/Y"/g, '📷');
html = html.replace(/Y"\?/g, '🔍');
html = html.replace(/o-/g, '✖');

html = html.replace(/PERIF%RICOS/g, 'PERIFÉRICOS');
html = html.replace(/DEVOLUCI"N/g, 'DEVOLUCIÓN');
html = html.replace(/Operacin/g, 'Operación');
html = html.replace(/Devolucin/g, 'Devolución');
html = html.replace(/Tamao/g, 'Tamaño');
html = html.replace(/PerifǸrico/g, 'Periférico');
html = html.replace(/Proteccin/g, 'Protección');
html = html.replace(/Lǭmina/g, 'Lámina');
html = html.replace(/Cdigo/g, 'Código');
html = html.replace(/Lnea/g, 'Línea');
html = html.replace(/Mvil/g, 'Móvil');
html = html.replace(/\?rea/g, 'Área');
html = html.replace(/pǸrdida/g, 'pérdida');
html = html.replace(/as/g, 'así');
html = html.replace(/tambiǸn/g, 'también');
html = html.replace(/tǸcnico/g, 'técnico');
html = html.replace(/manipulacin/g, 'manipulación');
html = html.replace(/dao/g, 'daño');
html = html.replace(/Fotogrǭfica/g, 'Fotográfica');
html = html.replace(/Reasignacin/g, 'Reasignación');
html = html.replace(/Reposicin/g, 'Reposición');
html = html.replace(/TelǸfono/g, 'Teléfono');
html = html.replace(/N /g, 'Nº ');

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log('Fixed script and mojibake with specific characters');

