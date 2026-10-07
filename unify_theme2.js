const fs = require('fs');

for (const file of ['admin-empleados.html', 'inventario.html']) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Fix btn-outline styles
    html = html.replace(/background-color: #172033/g, 'background-color: transparent');
    html = html.replace(/border: 1px solid #334155/g, 'border: 1px solid var(--border-focus)');
    html = html.replace(/border-color: #475569; background-color: #1E293B/g, 'border-color: var(--text-muted); background-color: rgba(255, 255, 255, 0.05)');
    
    // Fix global search icon and other text colors
    html = html.replace(/text-\[#64748B\]/g, 'text-[var(--text-muted)]');
    
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated buttons in ${file}`);
}

