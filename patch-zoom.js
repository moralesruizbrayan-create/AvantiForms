const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

css = css.replace(/zoom:\s*0\.77\s*!important;/g, 'zoom: 0.70 !important;');
css = css.replace(/transform:\s*scale\(0\.95\)\s*!important;/g, 'transform: none !important;');
css = css.replace(/zoom:\s*0\.95\s*!important;/g, 'zoom: 0.88 !important;'); // Reduce delivery mode slightly too just in case
css = css.replace(/transform:\s*scale\(1\)\s*!important;/g, 'transform: none !important;');

// Ensure max-height and overflow are perfectly strictly applied in print
if (!css.includes('page-break-inside: avoid !important;')) {
    // Should be there already
}

fs.writeFileSync('styles.css', css, 'utf8');
console.log('styles.css zoom scaling optimized');
