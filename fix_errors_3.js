const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// Fix the script block 
html = html.replace(/<\/script>\s*\/\/\s*PRE-LLENAR DATOS DESDE URL[\s\S]*?\}\);\s*/, (match) => {
    let codeOnly = match.replace(/<\/script>\s*/, '');
    return codeOnly + "\n    </script>\n";
});

// Replace exact mojibake phrases that are broken in the signatures
const signatureIds = ['f1_m1', 'f2_m1', 'f3_m1', 'f4_m1', 
                      'f1_m2', 'f2_m2', 'f3_m2', 'f4_m2', 
                      'f1_m3', 'f2_m3', 'f3_m3', 'f4_m3', 
                      'f1_m4', 'f2_m4', 'f3_m4', 'f4_m4'];

signatureIds.forEach(id => {
    const regex = new RegExp(`<span id="lbl_${id}">[^<]*?Firmar\\s+([^<]+)<\\/span>`);
    html = html.replace(regex, (match, p1) => {
        let cleanTitle = p1;
        if (cleanTitle.includes('Devoluci')) cleanTitle = 'Empleado (Devolución)';
        else if (cleanTitle.includes('Receptor')) cleanTitle = 'Empleado Receptor';
        else if (cleanTitle.includes('Retorno')) cleanTitle = 'Encargado TI (Retorno)';
        else if (cleanTitle.includes('Persona que Devuelve')) cleanTitle = 'Persona que Devuelve';
        else if (cleanTitle.includes('Encargado TI')) cleanTitle = 'Encargado TI';
        else cleanTitle = 'Empleado';
        return `<span id="lbl_${id}">✍️ Firmar ${cleanTitle}</span>`;
    });
});

// Safe targeted mojibake fixes
html = html.replace(/Y" Evidencia Fotogr.fica/g, '📷 Evidencia Fotográfica');
html = html.replace(/Y"/g, '📷'); 
html = html.replace(/Y"\?/g, '🔍');
html = html.replace(/o-/g, '✖'); 

// More targeted exact match replacements
html = html.replace(/PERIF%RICOS/g, 'PERIFÉRICOS');
html = html.replace(/DEVOLUCI"N/g, 'DEVOLUCIÓN');
html = html.replace(/Devolucin/g, 'Devolución');
html = html.replace(/Operacin/g, 'Operación');
html = html.replace(/Tamao/g, 'Tamaño');
html = html.replace(/PerifǸrico/g, 'Periférico');
html = html.replace(/Proteccin/g, 'Protección');
html = html.replace(/Lǭmina/g, 'Lámina');
html = html.replace(/Cdigo/g, 'Código');
html = html.replace(/Lnea/g, 'Línea');
html = html.replace(/Mvil/g, 'Móvil');
html = html.replace(/pǸrdida/g, 'pérdida');
html = html.replace(/tambiǸn/g, 'también');
html = html.replace(/tǸcnico/g, 'técnico');
html = html.replace(/manipulacin/g, 'manipulación');
html = html.replace(/dao/g, 'daño');
html = html.replace(/Fotogrǭfica/g, 'Fotográfica');
html = html.replace(/Reasignacin/g, 'Reasignación');
html = html.replace(/Reposicin/g, 'Reposición');
html = html.replace(/TelǸfono/g, 'Teléfono');
html = html.replace(/N /g, 'Nº ');
html = html.replace(/Y"\?/g, '🔍');
html = html.replace(/Y"/g, '📷');
html = html.replace(/o-/g, '✖');
html = html.replace(/o\?\?/g, '✍️');
html = html.replace(/\?rea/g, 'Área');

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log('Fixed exactly');

