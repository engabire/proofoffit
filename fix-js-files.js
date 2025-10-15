#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that were incorrectly processed (JavaScript files with escaped quotes)
const jsFiles = [
  'apps/web/next.config.js',
  'apps/web/jest.config.js',
  'apps/web/playwright.config.ts',
  'apps/web/tailwind.config.js',
  'apps/web/middleware.ts',
  'apps/web/src/middleware.ts',
  'apps/web/src/i18n.ts',
  'apps/web/src/instrumentation.ts'
];

// Fix JavaScript files by unescaping quotes
function fixJavaScriptFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Unescape quotes in JavaScript files
    let newContent = content
      .replace(/&apos;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&quot;/g, '"');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed JavaScript file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('Fixing JavaScript files that were incorrectly processed...');
  
  let fixedCount = 0;
  
  for (const file of jsFiles) {
    if (fs.existsSync(file)) {
      if (fixJavaScriptFile(file)) {
        fixedCount++;
      }
    }
  }
  
  console.log(`\n📊 Summary: Fixed ${fixedCount} JavaScript files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixJavaScriptFile };
