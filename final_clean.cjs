const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walk(fullPath, callback);
    else callback(fullPath);
  });
}

const badImport = "import { t } from '$lib/i18n/translations';";
const targetDirs = ['./src/routes', './src/lib/components'];

targetDirs.forEach(dir => {
  walk(dir, filePath => {
    if (filePath.endsWith('.svelte') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(badImport)) {
        // Remove the bad import
        let lines = content.split('\n');
        let filteredLines = lines.filter(line => !line.includes(badImport));
        
        // Ensure the correct import exists if $t is used
        let newContent = filteredLines.join('\n');
        if (newContent.includes('$t') && !newContent.includes("from '$lib/i18n'")) {
            // Find first script tag and inject after it
            newContent = newContent.replace(/<script[^>]*>/, match => `${match}\n  import { t } from '$lib/i18n';`);
        }
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Cleaned ${filePath}`);
      }
    }
  });
});
