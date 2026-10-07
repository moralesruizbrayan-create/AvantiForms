const fs = require('fs');

const cssPrint = `
/* =========================================
   ESTILOS DE IMPRESIÓN / PRINT STYLES
   ========================================= */
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
        margin: 0; /* Controlamos los márgenes en el contenedor */
    }

    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #FFFFFF !important;
        color: #000000 !important;
        width: 100vw;
        height: 100vh; /* Ocupar exactamente el viewport de impresión */
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    /* 3. Contenedor del formulario: Flexbox expansivo y centrado simétrico */
    .page-container,
    .form-view {
        width: 100%;
        height: 98vh; /* Altura simétrica casi total de la hoja */
        max-height: 297mm;
        margin: 0 auto !important;
        padding: 1.5cm 1.5cm !important;
        box-shadow: none !important;
        border: none !important;
        background: #FFFFFF !important;
        display: flex !important;
        flex-direction: column;
        justify-content: space-between; /* Distribuye el espacio sobrante simétricamente */
        box-sizing: border-box;
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
`;

fs.appendFileSync('styles.css', cssPrint, 'utf8');
console.log('Print CSS appended.');
