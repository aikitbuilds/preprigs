const fs = require('fs');
const path = 'f:/Active Projects 2-1-26/Proto/preprigs.com/src/components/BlogSection.tsx';

let lines = fs.readFileSync(path, 'utf-8').split(/\r?\n/);

// Remove lines 657 to 690 inclusive
lines.splice(657, 691 - 657);

fs.writeFileSync(path, lines.join('\n'));
console.log("Successfully removed duplicated block 657-690 via line slicing!");
