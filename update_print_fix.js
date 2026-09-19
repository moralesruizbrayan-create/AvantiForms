const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const regexCss = /@media print\s*\{\s*@page\s*\{\s*size:\s*A4\s*portrait;\s*margin:\s*10mm\s*15mm;\s*\}/g;

const replacementCss = `@media print {
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
      }`;

html = html.replace(regexCss, replacementCss);

const fnTargetRegex = /function cambiarModo\(btn,\s*modo\)\s*\{[^}]*btn\.classList\.add\('active'\);/g;

const fnReplacement = `function cambiarModo(btn, modo) {
      const view = btn.closest('.form-view');
      view.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Asegurar que el contenedor tenga la clase del modo para CSS de impresión
      view.classList.remove('modo-entrega', 'modo-devolucion', 'modo-completo');
      view.classList.add('modo-' + modo);`;

html = html.replace(fnTargetRegex, fnReplacement);

fs.writeFileSync('gestion-actas.html', html);
console.log('Regex applied!');

