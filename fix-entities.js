#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript/JavaScript files in the apps/web directory
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files = files.concat(findFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix entity escaping issues
function fixEntities(content) {
  // Fix apostrophes
  content = content.replace(/(?<!&)(?<!&#)(?<!&apos;)(?<!&lsquo;)(?<!&rsquo;)(?<!&quot;)(?<!&ldquo;)(?<!&rdquo;)(?<!&amp;)(?<!&lt;)(?<!&gt;)'/g, '&apos;');
  
  // Fix quotes (but be careful not to break existing HTML attributes)
  content = content.replace(/(?<!&)(?<!&#)(?<!&apos;)(?<!&lsquo;)(?<!&rsquo;)(?<!&quot;)(?<!&ldquo;)(?<!&rdquo;)(?<!&amp;)(?<!&lt;)(?<!&gt;)(?<!=\s*)"(?![^<]*>)/g, '&ldquo;');
  
  return content;
}

// Fix anchor tags
function fixAnchorTags(content) {
  // Replace <a href="/..."> with <Link href="/...">
  content = content.replace(/<a\s+href="\/([^"]*)"([^>]*)>/g, '<Link href="/$1"$2>');
  content = content.replace(/<\/a>/g, '</Link>');
  
  return content;
}

// Add console statement guards
function fixConsoleStatements(content) {
  // Wrap console.log statements
  content = content.replace(/console\.log\(/g, 'if (process.env.NODE_ENV !== \'production\') { console.log(');
  content = content.replace(/console\.info\(/g, 'if (process.env.NODE_ENV !== \'production\') { console.info(');
  
  // Add closing braces for wrapped statements (simple approach)
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newLines.push(line);
    
    // If line contains wrapped console statement, add closing brace
    if (line.includes('if (process.env.NODE_ENV !== \'production\') { console.') && 
        line.includes(');') && 
        !line.includes('}')) {
      newLines.push('  }');
    }
  }
  
  return newLines.join('\n');
}

// Main execution
function main() {
  const webDir = path.join(__dirname, 'apps', 'web');
  const files = findFiles(webDir);
  
  console.log(`Found ${files.length} files to process...`);
  
  let processedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      
      // Apply fixes
      newContent = fixEntities(newContent);
      newContent = fixAnchorTags(newContent);
      newContent = fixConsoleStatements(newContent);
      
      // Only write if content changed
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        processedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`- Files processed: ${processedCount}`);
  console.log(`- Errors: ${errorCount}`);
  console.log(`- Total files: ${files.length}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixEntities, fixAnchorTags, fixConsoleStatements };
