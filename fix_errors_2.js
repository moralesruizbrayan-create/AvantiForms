const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// Fix the script block 
html = html.replace(/<\/script>\s*\/\/\s*PRE-LLENAR DATOS DESDE URL[\s\S]*?\}\);\s*/, (match) => {
    let codeOnly = match.replace(/<\/script>\s*/, '');
    return codeOnly + "\n    </script>\n";
});

// Fix Emojis in labels
const signatureIds = ['f1_m1', 'f2_m1', 'f3_m1', 'f4_m1', 
                      'f1_m2', 'f2_m2', 'f3_m2', 'f4_m2', 
                      'f1_m3', 'f2_m3', 'f3_m3', 'f4_m3', 
                      'f1_m4', 'f2_m4', 'f3_m4', 'f4_m4'];

signatureIds.forEach(id => {
    // We capture what follows "Firmar " up to </span>
    const regex = new RegExp(`<span id="lbl_${id}">[^<]*?Firmar\\s+([^<]+)<\\/span>`);
    html = html.replace(regex, (match, p1) => {
        // Fix any mojibake in the title (like Devolucin)
        let cleanTitle = p1;
        if (cleanTitle.includes('Devoluci')) cleanTitle = 'Empleado (Devolución)';
        if (cleanTitle.includes('Receptor')) cleanTitle = 'Empleado Receptor';
        if (cleanTitle.includes('Retorno')) cleanTitle = 'Encargado TI (Retorno)';
        return `<span id="lbl_${id}">✍️ Firmar ${cleanTitle}</span>`;
    });
});

// Fix other specific mojibake
html = html.replace(/Y" Evidencia Fotogr.fica/g, '📷 Evidencia Fotográfica');
html = html.replace(/Y"/g, '📷'); // Scan code button
html = html.replace(/Y"\?/g, '🔍'); // Search button
html = html.replace(/o-/g, '✖'); // Close button / Delete photo
html = html.replace(/✖✖/g, '✖'); // Just in case it duplicates

// Safe string replacements for specific words that got messed up, ONLY if they match exactly the mojibake
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
html = html.replace(/tambiǸn/g, 'también');
html = html.replace(/tǸcnico/g, 'técnico');
html = html.replace(/manipulacin/g, 'manipulación');
html = html.replace(/dao/g, 'daño');
html = html.replace(/Fotogrǭfica/g, 'Fotográfica');
html = html.replace(/Reasignacin/g, 'Reasignación');
html = html.replace(/Reposicin/g, 'Reposición');
html = html.replace(/TelǸfono/g, 'Teléfono');
html = html.replace(/N/g, 'Nº');
html = html.replace(/as /g, 'así '); // only with trailing space

fs.writeFileSync('gestion-actas.html', html, 'utf8');
console.log('Fixed mojibake correctly');

