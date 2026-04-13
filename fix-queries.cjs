const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.svelte')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Fix expected 1 arguments, but got 2 on getOwnedQuery
      content = content.replace(/getOwnedQuery\((["'][A-Za-z0-9_]+["']),\s*[a-zA-Z0-9_]+\)/g, 'getOwnedQuery($1)');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
};

traverse(path.join(__dirname, 'src', 'lib', 'api'));
traverse(path.join(__dirname, 'src', 'routes'));
