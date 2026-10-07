const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// 1. Reduce padding of .form-view.active
css = css.replace(/padding:\s*1cm\s+1\.2cm\s*!important;/g, 'padding: 0.5cm 1cm !important;');

// 2. Reduce padding of table cells in print
if (!css.includes('.form-table td { padding: 4px 8px !important; }')) {
    const tablePadding = `
    .form-table td { padding: 4px 8px !important; }
    h3 { margin: 10px 0 4px 0 !important; }
    .signature-section { gap: 15px !important; }
    .sig-formal-table { margin-top: 10px !important; }
`;
    // inject just before closing brace of @media print
    const lastBraceIndex = css.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        css = css.substring(0, lastBraceIndex) + tablePadding + css.substring(lastBraceIndex);
    }
}

// 3. Zoom adjustments
css = css.replace(/zoom:\s*0\.70\s*!important;/g, 'zoom: 0.65 !important;'); // Shrink more to guarantee 1 page

fs.writeFileSync('styles.css', css, 'utf8');
console.log("styles.css print compactness optimized");
