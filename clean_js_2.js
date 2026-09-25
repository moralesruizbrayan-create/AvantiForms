const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find where registerForm.addEventListener starts, or the comment above it
let startIdx = html.indexOf('// 3.'); // Looking for // 3. LÓGICA DE REGISTRO
if (startIdx === -1) startIdx = html.indexOf('// ==========================================\r\n        // 3.');
if (startIdx === -1) startIdx = html.indexOf('registerForm.addEventListener');

let endIdx = html.indexOf('</script>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    // Also remove the // ========================================== before it
    let previousLineIdx = html.lastIndexOf('// ==========================================', startIdx);
    if (previousLineIdx !== -1 && previousLineIdx > startIdx - 100) {
        startIdx = previousLineIdx;
    }
    
    html = html.substring(0, startIdx) + html.substring(endIdx);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Successfully cleaned registration logic');
} else {
    console.log('Could not find the bounds');
}

