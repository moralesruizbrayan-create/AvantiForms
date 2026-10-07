const fs = require('fs');

for (const file of ['admin-empleados.html', 'inventario.html']) {
    let html = fs.readFileSync(file, 'utf8');

    // Update the accent-green variables to Avanti Emerald
    html = html.replace(/--accent-green:\s*#00c867;/g, '--accent-green: #10B981;');
    html = html.replace(/--accent-green-hover:\s*#00b05b;/g, '--accent-green-hover: #059669;');

    // Enhance grid borders and hover states for a more unified "corporate" look
    // Instead of completely transparent rows, make them slightly more distinct
    html = html.replace(/\.tabulator-row\.tabulator-row-odd\s*\{\s*background-color:\s*#131416\s*!important;\s*\}/g,
        '.tabulator-row.tabulator-row-odd { background-color: transparent !important; }');
    html = html.replace(/\.tabulator-row\.tabulator-row-even\s*\{\s*background-color:\s*#0f0f11\s*!important;\s*\}/g,
        '.tabulator-row.tabulator-row-even { background-color: rgba(255,255,255,0.02) !important; }');
    html = html.replace(/\.tabulator-row:hover\s*\{\s*background-color:\s*#18181b\s*!important;\s*cursor:\s*pointer;\s*\}/g,
        '.tabulator-row:hover { background-color: rgba(16, 185, 129, 0.05) !important; cursor: pointer; }');

    // Give headers a slight emerald top border for branding
    html = html.replace(/\.tabulator-header\s*\{\s*background-color:\s*var\(--surface-slate\)\s*!important;\s*color:\s*var\(--text-muted\)\s*!important;\s*border-bottom:\s*1px\s*solid\s*var\(--border-subtle\)\s*!important;\s*\}/g,
        '.tabulator-header { background-color: var(--surface-slate) !important; color: var(--text-muted) !important; border-bottom: 1px solid var(--border-subtle) !important; border-top: 2px solid var(--accent-green) !important; }');
    
    // Also patch inventario which has slightly different string
    html = html.replace(/\.tabulator-header\s*\{\s*background-color:\s*var\(--surface-slate\)\s*!important;\s*border-bottom:\s*1px\s*solid\s*var\(--border-subtle\)\s*!important;\s*\}/g,
        '.tabulator-header { background-color: var(--surface-slate) !important; border-bottom: 1px solid var(--border-subtle) !important; border-top: 2px solid var(--accent-green) !important; }');

    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated grid UI in ${file}`);
}
