const fs = require('fs');
const css = `
.tech-label {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 5px;
    margin-bottom: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
}
`;
fs.appendFileSync('styles.css', css, 'utf8');
