const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// 1. Update body inside print
css = css.replace(/body\s*\{([^}]*print-color-adjust:\s*exact;[^}]*)\}/, (match, inner) => {
    if (inner.includes('max-height: 100vh')) return match;
    return `body {${inner}\n        max-height: 100vh !important;\n        overflow: hidden !important;\n    }`;
});

// 2. Update .form-view.active padding
css = css.replace(/\.form-view\.active\s*\{([^}]*)padding:\s*1\.5cm\s+1\.5cm\s*!important;([^}]*)\}/, (match, before, after) => {
    return `.form-view.active {${before}padding: 1cm 1.2cm !important;${after}}`;
});

// 3. Add scaling rules
if (!css.includes('.form-view.modo-completo.active {')) {
    const zoomRules = `
    /* 7. Escalar form view para caber en una cara */
    .form-view.modo-completo.active {
        zoom: 0.77 !important;
        transform: scale(0.95) !important;
        transform-origin: top center !important;
    }
    .form-view.modo-entrega.active, .form-view.modo-devolucion.active {
        zoom: 0.95 !important;
        transform: scale(1) !important;
        transform-origin: top center !important;
    }
`;
    const lastBraceIndex = css.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        css = css.substring(0, lastBraceIndex) + zoomRules + css.substring(lastBraceIndex);
    }
}

fs.writeFileSync('styles.css', css, 'utf8');
console.log('styles.css updated successfully');
