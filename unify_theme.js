const fs = require('fs');

const cssVarsRegex = /:root\s*\{[^}]+\}/;

const newCssVars = `:root {
      --bg-deep: #0a0a0c;
      --surface-slate: #131416;
      --border-subtle: #222222;
      --border-focus: #333333;
      --text-bright: #ffffff;
      --text-muted: #a1a1aa;
      --accent-green: #00c867;
      --accent-green-hover: #00b05b;
    }`;

for (const file of ['admin-empleados.html', 'inventario.html']) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace CSS vars
    html = html.replace(cssVarsRegex, newCssVars);
    
    // Also replace background colors in tailwind classes inside the files, like bg-[#0F172A]
    html = html.replace(/bg-\[#0F172A\]/g, 'bg-[var(--surface-slate)]');
    html = html.replace(/border-\[#1E293B\]/g, 'border-[var(--border-subtle)]');
    html = html.replace(/border-\[#334155\]/g, 'border-[var(--border-focus)]');
    html = html.replace(/text-\[#F8FAFC\]/g, 'text-[var(--text-bright)]');
    html = html.replace(/text-\[#94A3B8\]/g, 'text-[var(--text-muted)]');
    html = html.replace(/text-\[#64748B\]/g, 'text-[var(--text-muted)]');
    html = html.replace(/bg-\[#1E293B\]/g, 'bg-[#1a1a1c]');
    
    // Replace specific icon container backgrounds
    
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated ${file}`);
}

