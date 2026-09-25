const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the end of btnGuest logic
let searchStr = `showToast("PIN incorrecto. Acceso denegado.");\r\n            }\r\n        });`;
let pos = html.indexOf('showToast("PIN incorrecto. Acceso denegado.");');
if (pos !== -1) {
    let endOfBtnGuest = html.indexOf('});', pos) + 3;
    let endScript = html.indexOf('</script>', endOfBtnGuest);
    
    if (endScript !== -1) {
        html = html.substring(0, endOfBtnGuest) + '\n    ' + html.substring(endScript);
        fs.writeFileSync('index.html', html, 'utf8');
        console.log('Successfully removed orphaned JS logic');
    }
} else {
    // maybe \n instead of \r\n
    pos = html.indexOf('showToast("PIN incorrecto. Acceso denegado.");');
    console.log(pos);
}

