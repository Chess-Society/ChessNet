const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'lib', 'locales', 'modules');
const definedKeys = new Set();

const files = fs.readdirSync(modulesDir);
for (const file of files) {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*['"`]?([\w\.]+)['"`]?\s*:/);
      if (match) {
        definedKeys.add(match[1]);
      }
    }
  }
}

const allKeys = fs.readFileSync('all_keys.txt', 'utf8').split('\n').filter(Boolean);
const missingKeys = [];

for (const key of allKeys) {
  if (key.includes('${') || key.includes('?') || !key.includes('.')) continue;
  if (!definedKeys.has(key)) {
    missingKeys.push(key);
  }
}

fs.writeFileSync('missing.json', JSON.stringify(missingKeys, null, 2));
console.log(`Found ${missingKeys.length} missing keys. Written to missing.json`);
