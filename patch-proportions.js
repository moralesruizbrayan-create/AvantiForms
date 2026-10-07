const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// I will replace the .form-view.active rule to include scaling
const replaceTarget = /\.form-view\.active\s*\{[\s\S]*?box-sizing:\s*border-box\s*!important;\s*\}/;

const newRule = `.form-view.active {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        height: 100% !important;
        width: 100% !important;
        padding: 1.2cm 1.2cm !important;
        box-sizing: border-box !important;
    }

    .form-view.modo-completo.active {
        zoom: 0.80 !important;
        transform: scale(0.95) !important;
        transform-origin: top center !important;
    }
    
    .form-view.modo-entrega.active, 
    .form-view.modo-devolucion.active {
        zoom: 1 !important;
        transform: scale(1) !important;
        transform-origin: top center !important;
    }`;

css = css.replace(replaceTarget, newRule);
fs.writeFileSync(cssPath, css);
console.log('Proportions fixed in styles.css');
