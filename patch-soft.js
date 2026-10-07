const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// Soften body and input text colors in print mode
css = css.replace(/color:\s*#000000\s*!important;/g, 'color: #334155 !important;');
css = css.replace(/color:\s*#000\s*!important;/g, 'color: #334155 !important;'); // this will catch most inputs and sig-formal texts

// Fix the signature tables and inputs inside the print block
// .sig-formal-table { margin-top: 15px !important; border: 2px solid #000 !important; }
css = css.replace(/\.sig-formal-table\s*\{\s*margin-top:\s*([^\}]+?)\s*border:\s*2px\s*solid\s*#000\s*!important;\s*\}/g, '.sig-formal-table { margin-top: $1 border: 1px solid #cbd5e1 !important; }');

// .sig-formal-cell { border: 1px solid #000 !important; }
css = css.replace(/\.sig-formal-cell\s*\{\s*border:\s*1px\s*solid\s*#000\s*!important;\s*\}/g, '.sig-formal-cell { border: 1px solid #cbd5e1 !important; }');
css = css.replace(/\.sig-formal-cell:first-child\s*\{\s*border-right:\s*1px\s*solid\s*#000\s*!important;\s*\}/g, '.sig-formal-cell:first-child { border-right: 1px solid #cbd5e1 !important; }');

// .sig-formal-title
css = css.replace(/\.sig-formal-title\s*\{\s*background:\s*#F1F5F9\s*!important;\s*color:\s*#334155\s*!important;\s*border-bottom:\s*1px\s*solid\s*#000\s*!important;/g, 
    '.sig-formal-title { background: #f8fafc !important; color: #16a34a !important; border-bottom: 1px solid #cbd5e1 !important;');
// also catch if it was replaced as #000
css = css.replace(/\.sig-formal-title\s*\{\s*background:\s*#F1F5F9\s*!important;\s*color:\s*#000\s*!important;\s*border-bottom:\s*1px\s*solid\s*#000\s*!important;/g, 
    '.sig-formal-title { background: #f8fafc !important; color: #16a34a !important; border-bottom: 1px solid #cbd5e1 !important;');
// just generic replace for .sig-formal-title
css = css.replace(/\.sig-formal-title\s*\{[^\}]*\}/g, (match) => {
    return match.replace(/background:\s*#[0-9a-fA-F]+/i, 'background: #f8fafc').replace(/color:\s*#[0-9a-fA-F]+/i, 'color: #16a34a').replace(/border-bottom:\s*1px\s*solid\s*#[0-9a-fA-F]+/i, 'border-bottom: 1px solid #cbd5e1');
});

// .sig-formal-box-firma { border: none !important; border-bottom: 1px solid #000 !important;
css = css.replace(/\.sig-formal-box-firma\s*\{[^\}]*\}/g, (match) => {
    return match.replace(/border-bottom:\s*1px\s*solid\s*#000/g, 'border-bottom: 1px solid #cbd5e1');
});

// .sig-formal-details input { font-size: 9px !important; color: #334155 !important; border-bottom: 1px dotted #000 !important; }
css = css.replace(/\.sig-formal-details\s*input\s*\{[^\}]*\}/g, (match) => {
    return match.replace(/border-bottom:\s*1px\s*dotted\s*#000/g, 'border-bottom: 1px dashed #cbd5e1');
});

// Also replace the borders on regular .form-table in non-print if they are too dark? 
// The user says "eliminar los colores 000000 de los textos y los bordes y/o lineas".
// Wait, I will just replace all remaining #000000 in print section to #334155
// and #000 borders to #cbd5e1
css = css.replace(/1px solid #000000/g, '1px solid #cbd5e1');
css = css.replace(/1px solid #000/g, '1px solid #cbd5e1');
css = css.replace(/2px solid #000/g, '1px solid #cbd5e1');

fs.writeFileSync('styles.css', css, 'utf8');
console.log("styles.css softened borders and colors");
