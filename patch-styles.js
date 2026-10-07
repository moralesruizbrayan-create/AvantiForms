const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the buggy @media print at the bottom
const buggyPrintRegex = /@media print\s*\{[\s\S]*?(?=\n\n|\n$)/g;

css = css.replace(/@media print\s*\{[\s\S]*\}\s*$/, `
@media print {
    /* 1. Ocultar elementos irrelevantes para la impresión */
    button, 
    .btn-dash, 
    .btn-scan, 
    .btn-outline, 
    .btn-danger,
    .theme-toggle-btn, 
    .user-controls,
    .action-bar-container,
    .mode-selector,
    nav,
    a[href]:after,
    .no-print {
        display: none !important;
    }

    /* 2. Forzar diseño a una única página A4 utilizando flexbox y vh */
    @page {
        size: A4 portrait;
        margin: 0;
    }

    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #FFFFFF !important;
        color: #000000 !important;
        width: 100vw !important;
        height: 100vh !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    body::before { display: none !important; }

    /* 3. Contenedor del formulario: Flexbox expansivo y centrado simétrico */
    .page-container {
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important; /* Move padding to form-view */
        box-shadow: none !important;
        border: none !important;
        background: #FFFFFF !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
    }
    
    .form-view.active {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        height: 100% !important;
        width: 100% !important;
        padding: 1.5cm 1.5cm !important;
        box-sizing: border-box !important;
    }

    /* 4. Forzar evitar quiebres de página en secciones principales */
    .form-table,
    .signature-section,
    .compromiso-box,
    .header-table {
        page-break-inside: avoid !important;
        page-break-after: auto !important;
    }

    /* 5. Mantener Branding Verde */
    .header-table {
        border-top: 5px solid #16A34A !important;
        border-bottom: 2px solid #F59E0B !important;
    }

    h3 {
        color: #16A34A !important;
    }

    /* Quitar sombras de las cajas */
    * {
        box-shadow: none !important;
        text-shadow: none !important;
    }
}
`);

fs.writeFileSync(cssPath, css);
console.log('styles.css patched successfully.');
