#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (!['node_modules', '.next', '.git'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to calculate relative path from file to ui-standalone
function getRelativePath(fromFile, toDir) {
  const fromDir = path.dirname(fromFile);
  const relativePath = path.relative(fromDir, toDir);
  return relativePath.startsWith('.') ? relativePath : './' + relativePath;
}

// Function to replace imports
function replaceImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Calculate the correct relative path to ui-standalone
  const webAppDir = path.join(__dirname, 'apps', 'web', 'src');
  const uiStandaloneDir = path.join(webAppDir, 'components', 'ui-standalone');
  const relativePath = getRelativePath(filePath, uiStandaloneDir);
  
  // Replace @proof-of-fit/ui imports with correct relative paths
  const importRegex = /from ['"]@proof-of-fit\/ui['"]/g;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, `from '${relativePath}'`);
    modified = true;
  }
  
  // Replace specific component imports
  const componentImports = [
    'Button', 'Input', 'Card', 'Label', 'Badge', 'Avatar', 'Separator',
    'Skeleton', 'Progress', 'Tabs', 'Dialog', 'Sheet', 'DropdownMenu',
    'Select', 'Checkbox', 'RadioGroup', 'Switch', 'Slider', 'Textarea',
    'Alert', 'AlertDialog', 'Tooltip', 'Popover', 'Command', 'Accordion',
    'NavigationMenu', 'ScrollArea', 'Toast', 'Toaster'
  ];
  
  componentImports.forEach(component => {
    const regex = new RegExp(`import\\s*{\\s*([^}]*\\b${component}\\b[^}]*)\\s*}\\s*from\\s*['"]@proof-of-fit\/ui['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `import { $1 } from '${relativePath}'`);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath} (relative path: ${relativePath})`);
  }
}

// Main execution
const webAppDir = path.join(__dirname, 'apps', 'web', 'src');
const files = findFiles(webAppDir);

console.log(`Found ${files.length} files to process...`);

files.forEach(file => {
  replaceImports(file);
});

console.log('Import path fixes complete!');
