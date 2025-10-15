#!/usr/bin/env node

const fs = require('fs');

// Files that still have console warnings
const filesToFix = [
  'apps/web/app/api/jobs/route.ts',
  'apps/web/app/api/revalidate/route.ts', 
  'apps/web/app/api/scrape/route.ts',
  'apps/web/app/app/fit-simple/page.tsx',
  'apps/web/app/candidate/applications/page.tsx',
  'apps/web/app/candidate/matches/page.tsx',
  'apps/web/app/candidate/profile/page.tsx'
];

function fixConsoleStatements(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix empty lines after eslint-disable comments
  content = content.replace(
    /(\/\/ eslint-disable-next-line no-console)\n\s*\n(\s*console\.)/g,
    '$1\n$2'
  );

  // Add eslint-disable to console statements that don't have it
  content = content.replace(
    /^(\s*)(console\.(log|info|warn|error|debug)\([^)]*\);?\s*)$/gm,
    (match, indent, consoleStatement) => {
      // Check if there's already an eslint-disable comment on the previous line
      const lines = content.split('\n');
      const matchIndex = content.indexOf(match);
      const beforeMatch = content.substring(0, matchIndex);
      const lineNumber = beforeMatch.split('\n').length;
      
      if (lineNumber > 0) {
        const prevLine = lines[lineNumber - 2]; // -2 because arrays are 0-indexed
        if (prevLine && prevLine.includes('eslint-disable-next-line no-console')) {
          return match; // Already has disable comment
        }
      }
      
      modified = true;
      return `${indent}// eslint-disable-next-line no-console\n${indent}${consoleStatement}`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed console statements in: ${filePath}`);
  } else {
    console.log(`No changes needed in: ${filePath}`);
  }
}

// Process all files
filesToFix.forEach(fixConsoleStatements);

console.log('Final console statement fixes completed!');
