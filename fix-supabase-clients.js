#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of pages that need to be fixed
const pagesToFix = [
  'apps/web/src/app/dashboard/page.tsx',
  'apps/web/src/app/candidate/profile/page.tsx',
  'apps/web/src/app/candidate/matches/page.tsx',
  'apps/web/src/app/candidate/applications/page.tsx',
  'apps/web/src/app/employer/intake/page.tsx',
  'apps/web/src/app/employer/slates/page.tsx'
];

function fixPage(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has the environment check
  if (content.includes('isSupabaseConfigured')) {
    console.log(`File ${filePath} already has environment check, skipping...`);
    return;
  }
  
  // Add the import if it doesn't exist
  if (!content.includes('import { isSupabaseConfigured }')) {
    content = content.replace(
      /import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs'/g,
      `import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'`
    );
  }
  
  // Fix the Supabase client creation
  content = content.replace(
    /const supabase = createClientComponentClient\(\)/g,
    'const supabase = isSupabaseConfigured() ? createClientComponentClient() : null'
  );
  
  // Add null checks for supabase usage
  content = content.replace(
    /await supabase\./g,
    'if (!supabase) return; await supabase.'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

// Fix all pages
pagesToFix.forEach(fixPage);

console.log('Done fixing Supabase client creation issues!');
