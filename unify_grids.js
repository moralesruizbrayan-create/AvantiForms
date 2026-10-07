const fs = require('fs');

for (const file of ['admin-empleados.html', 'inventario.html']) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded slate-blue table row colors with neutral darks
    html = html.replace(/#0B121E/g, 'transparent'); // odd row - match main bg #0a0a0c
    html = html.replace(/#0D1524/g, '#0f0f11');     // even row
    html = html.replace(/#1A263D/g, '#18181b');     // hover
    
    // Replace responsive collapse card background
    html = html.replace(/#131E32/g, 'var(--surface-slate)'); 
    
    // Replace paginator hover
    html = html.replace(/#1E293B/g, '#1a1a1c');
    
    // Replace any remaining #64748B text colors for standard muted text
    html = html.replace(/color: #64748B;/g, 'color: var(--text-muted);');

    fs.writeFileSync(file, html, 'utf8');
    console.log(`Unified table grid colors in ${file}`);
}

