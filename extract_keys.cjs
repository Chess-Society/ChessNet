const fs = require('fs');
const path = require('path');

const svelteRegex = /\$t\(['`"](.+?)['`"](?:\s*,\s*\{.*?\})?\)/g;
const missingKeys = new Set();
let filesCount = 0;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.svelte') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = svelteRegex.exec(content)) !== null) {
        missingKeys.add(match[1]);
      }
      filesCount++;
    }
  }
}
scanDir('./src');
console.log(`Found ${missingKeys.size} unique keys across ${filesCount} files.`);
fs.writeFileSync('all_keys.txt', Array.from(missingKeys).join('\n'));
