const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walk(fullPath, callback);
    else callback(fullPath);
  });
}

walk('./src', filePath => {
  if (filePath.endsWith('.svelte')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(`import { t, locale } from '$lib/i18n'`)) {
      content = content.replace("  import { t } from '$lib/i18n/translations';\n", '');
      content = content.replace("import { t } from '$lib/i18n/translations';\n", '');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Cleaned ${filePath}`);
    }
  }
});
