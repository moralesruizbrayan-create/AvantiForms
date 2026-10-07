const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The string to append right before the closing brace of the @media print block
const appendCss = `
    /* 6. Evitar impresión de dd/mm/aaaa en fechas vacías y estilos genéricos de inputs */
    input[type="text"], input[type="date"], textarea {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        font-size: 11px !important;
        color: #000 !important;
        width: 100% !important;
        font-family: inherit !important;
        text-align: left !important;
        vertical-align: middle !important;
        overflow: visible !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }
    textarea {
        height: auto !important;
        min-height: auto !important;
        resize: none !important;
        display: block !important;
    }
    textarea::-webkit-resizer { display: none !important; }
    
    input[type="date"]:not(.has-val) { color: transparent !important; }
    input[type="date"]:not(.has-val)::-webkit-datetime-edit { color: transparent !important; }
    input[type="date"]:not(.has-val)::-webkit-datetime-edit-text { color: transparent !important; }
    input[type="date"]:not(.has-val)::-webkit-datetime-edit-fields-wrapper { color: transparent !important; }
    input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; }
    input[type="date"]::-webkit-inner-spin-button { display: none !important; }
    
    input[type="checkbox"], input[type="radio"] {
        width: 12px !important;
        height: 12px !important;
        margin-right: 4px !important;
        accent-color: #16A34A !important;
    }
    
    /* Evitar que se impriman las cajas de evidencia fotográfica */
    .evidencia-box, .evidencia-runtime-img { display: none !important; }

    /* Firmas Formales en Impresión */
    .sig-formal-table { margin-top: 15px !important; border: 2px solid #000 !important; }
    .sig-formal-cell { border: 1px solid #000 !important; }
    .sig-formal-cell:first-child { border-right: 1px solid #000 !important; }
    .sig-formal-title { background: #F1F5F9 !important; color: #000 !important; border-bottom: 1px solid #000 !important; font-size: 10px !important; padding: 4px !important; }
    .sig-formal-body { padding: 8px !important; }
    .sig-formal-box-firma { border: none !important; border-bottom: 1px solid #000 !important; border-radius: 0 !important; min-height: 60px !important; margin-right: 15px !important; margin-left: 10px !important; }
    .sig-formal-box-huella { border: 1px solid #000 !important; border-radius: 0 !important; width: 16mm !important; height: 22mm !important; min-height: 22mm !important; }
    .sig-formal-label { color: #000 !important; border: none !important; font-size: 7.5px !important; padding-top: 0 !important; margin-top: 2px !important; }
    .sig-formal-details { font-size: 9px !important; }
    .sig-formal-details td:first-child { color: #000 !important; width: 45px !important; font-weight: bold; }
    .sig-formal-details input { font-size: 9px !important; color: #000 !important; border-bottom: 1px dotted #000 !important; }
    .signature-trigger-box { border: none !important; background: transparent !important; height: 100% !important; min-height: 40px !important; margin: 0 !important; position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; }
    .signature-runtime-img { max-height: 50px !important; object-fit: contain !important; }
    .signature-trigger-box span { display: none !important; }
`;

// Insert right before the last closing brace in styles.css
const lastBraceIndex = css.lastIndexOf('}');
if (lastBraceIndex !== -1) {
    css = css.substring(0, lastBraceIndex) + appendCss + '\n' + css.substring(lastBraceIndex);
    fs.writeFileSync(cssPath, css);
    console.log('Appended date and signature fixes to styles.css @media print block.');
} else {
    console.log('Could not find closing brace for @media print.');
}
