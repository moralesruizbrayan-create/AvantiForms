const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

// The block that processes data-field
const targetField = `        form.querySelectorAll('[data-field]').forEach(el => {
          const key = el.getAttribute('data-field');
          let val = el.value;
          
          if (el.type === 'checkbox') {`;

const replacementField = `        form.querySelectorAll('[data-field]').forEach(el => {
          const key = el.getAttribute('data-field');
          let val = el.value;
          
          if (el.type === 'checkbox') {
            if (!el.checked) return;
            val = el.hasAttribute('value') && el.value !== 'on' ? el.value : (el.nextSibling ? el.nextSibling.textContent.trim() : 'true');
          } else if (typeof val === 'string') {
            val = val.replace(/\\s+/g, ' ').trim();
          }
          
          if (el.type === 'checkbox') { // prevent old code breaking if we inject above`;

// Let's do a smarter replace using Regex to avoid partial matches failing.
const fieldRegex = /form\.querySelectorAll\('\[data-field\]'\)\.forEach\(el => \{\s*const key = el\.getAttribute\('data-field'\);\s*let val = el\.value;/;
const fieldRepl = `form.querySelectorAll('[data-field]').forEach(el => {
          const key = el.getAttribute('data-field');
          let val = el.value;
          if (typeof val === 'string' && el.type !== 'checkbox') {
            val = val.replace(/\\s+/g, ' ').trim();
          }`;
html = html.replace(fieldRegex, fieldRepl);


const specRegex = /form\.querySelectorAll\('\[data-spec\]'\)\.forEach\(el => \{\s*const key = el\.getAttribute\('data-spec'\);\s*let val = el\.value;/;
const specRepl = `form.querySelectorAll('[data-spec]').forEach(el => {
          const key = el.getAttribute('data-spec');
          let val = el.value;
          if (typeof val === 'string' && el.type !== 'checkbox') {
            val = val.replace(/\\s+/g, ' ').trim();
          }`;
html = html.replace(specRegex, specRepl);

fs.writeFileSync('gestion-actas.html', html);
console.log('Sanitized data extraction in gestion-actas.html');

