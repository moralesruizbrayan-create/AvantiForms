const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace body rule to include overflow: hidden
const bodyRegex = /body\s*\{[\s\S]*?print-color-adjust:\s*exact;\s*\}/;
const newBodyRule = `html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #FFFFFF !important;
        color: #000000 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }`;

css = css.replace(bodyRegex, newBodyRule);

// Adjust zoom to 0.77
css = css.replace(/zoom:\s*0\.80\s*!important;/g, 'zoom: 0.77 !important;');
// I will also make padding slightly smaller to ensure no overflow on edges
css = css.replace(/padding:\s*1\.2cm\s*1\.2cm\s*!important;/g, 'padding: 1cm 1.2cm !important;');

fs.writeFileSync(cssPath, css);
console.log('Fixed body overflow and padding.');
