const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const tabulatorCss = `
/* Tabulator Sorting Arrows Fix */
.tabulator-col[aria-sort="none"] .tabulator-col-sorter { opacity: 0; transition: opacity 0.2s; }
.tabulator-col:hover .tabulator-col-sorter { opacity: 0.5; }
.tabulator-col[aria-sort="ascending"] .tabulator-col-sorter,
.tabulator-col[aria-sort="descending"] .tabulator-col-sorter { opacity: 1 !important; color: #10B981 !important; }
`;

if(!css.includes('Tabulator Sorting Arrows Fix')) {
    fs.appendFileSync('styles.css', tabulatorCss);
}
console.log('styles.css updated');

