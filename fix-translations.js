import fs from 'fs';
import path from 'path';

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
    if (content.includes('{$t') && !content.includes(`import { t }`) && !content.includes(`import {t}`)) {
      content = content.replace(/<script[^>]*>/, match => `${match}\n  import { t } from '$lib/i18n/translations';`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
