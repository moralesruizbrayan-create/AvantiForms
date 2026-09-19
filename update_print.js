const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// 1. Update @media print CSS
const printCssTarget = `    @media print {
      @page { size: A4 portrait; margin: 10mm 15mm; }`;

const printCssReplacement = `    @media print {
      @page { size: A4 portrait; margin: 3mm 5mm; }
      
      html, body {
        height: 100% !important;
        max-height: 297mm !important;
        overflow: hidden !important;
      }
      
      .form-view.modo-completo .page-container {
        zoom: 0.82 !important;
        transform: scale(0.82) !important;
        transform-origin: top center !important;
      }
      
      .form-view.modo-entrega .page-container, 
      .form-view.modo-devolucion .page-container {
        zoom: 0.92 !important;
        transform: scale(0.92) !important;
        transform-origin: top center !important;
      }
      
      .form-table td { padding: 1px 3px !important; font-size: 7.2px !important; }
      .signature-trigger-box { height: 13px !important; min-height: 13px !important; margin: 2px 0 !important; }
      .signature-runtime-img { max-height: 15px !important; }
      
      .signature-block { margin-top: 10px !important; }
      .signatures-container { gap: 15px !important; }
      h3 { font-size: 8.5px !important; margin: 6px 0 2px 0 !important; }`;

html = html.replace(printCssTarget, printCssReplacement);

// 2. Update cambiarModo logic
const fnTarget = `    function cambiarModo(btn, modo) {
      const view = btn.closest('.form-view');
      view.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');`;

const fnReplacement = `    function cambiarModo(btn, modo) {
      const view = btn.closest('.form-view');
      view.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Asegurar que el contenedor tenga la clase del modo para CSS de impresión
      view.classList.remove('modo-entrega', 'modo-devolucion', 'modo-completo');
      view.classList.add('modo-' + modo);`;

html = html.replace(fnTarget, fnReplacement);

fs.writeFileSync('gestion-actas.html', html);
console.log('Done CSS print update!');

