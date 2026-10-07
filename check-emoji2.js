const fs = require('fs');
const html = fs.readFileSync('gestion-actas.html', 'utf8');
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;
const matches = html.match(emojiRegex);
console.log(matches ? matches.join('') : "No emojis found");
