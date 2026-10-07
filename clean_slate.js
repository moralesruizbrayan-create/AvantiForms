const fs = require('fs');

for (const file of ['admin-empleados.html', 'inventario.html']) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Fix neo-input hover/focus colors
    html = html.replace(/#475569/g, '#3f3f46'); // Zinc 700 for borders/scrollbars
    html = html.replace(/#1A243B/g, '#18181b'); // Zinc 900 for focus bg
    
    // Fix tabulator column titles
    html = html.replace(/color: #64748B !important;/g, 'color: var(--text-muted) !important;');
    
    // Fix scrollbar colors
    html = html.replace(/#334155/g, '#27272a'); // Zinc 800 for scrollbar thumb

    // Fix some stray #E2E8F0 text colors to var(--text-bright) for consistency
    html = html.replace(/#E2E8F0/g, 'var(--text-bright)');
    
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Deep color clean in ${file}`);
}

