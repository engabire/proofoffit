#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need console statement fixes
const filesToFix = [
  'apps/web/app/api/dsr/route.ts',
  'apps/web/app/api/jobs/refresh/route.ts', 
  'apps/web/app/api/jobs/route.ts',
  'apps/web/app/api/jobs/search/route.ts',
  'apps/web/app/api/revalidate/route.ts',
  'apps/web/app/api/scrape/route.ts',
  'apps/web/app/api/stripe/webhook/route.ts',
  'apps/web/app/api/webhooks/agile-cockpit/route.ts',
  'apps/web/app/app/fit/page.tsx',
  'apps/web/app/app/fit-simple/page.tsx',
  'apps/web/app/candidate/applications/page.tsx',
  'apps/web/app/candidate/matches/page.tsx',
  'apps/web/app/candidate/profile/page.tsx',
  'apps/web/app/dashboard/page.tsx',
  'apps/web/app/employer/dashboard/page.tsx',
  'apps/web/app/employer/intake/page.tsx',
  'apps/web/app/employer/jobs/page.tsx',
  'apps/web/app/employer/slates/page.tsx',
  'apps/web/app/gift/success/page.tsx',
  'apps/web/app/settings/enterprise/page.tsx',
  'apps/web/lib/analytics.ts',
  'apps/web/lib/security.ts',
  'apps/web/src/app/api/ai/analyze/route.ts',
  'apps/web/src/app/api/cleanup/route.ts',
  'apps/web/src/app/api/cron/refresh-jobs/route.ts',
  'apps/web/src/app/api/dsr/route.ts',
  'apps/web/src/app/api/jobs/refresh/route.ts',
  'apps/web/src/app/api/jobs/search/route.ts',
  'apps/web/src/app/api/revalidate/route.ts',
  'apps/web/src/app/api/scrape/route.ts',
  'apps/web/src/app/api/stripe/webhook/route.ts',
  'apps/web/src/app/api/webhooks/agile-cockpit/route.ts',
  'apps/web/src/app/employer/intake/page.tsx',
  'apps/web/src/components/application-automation/AutoApplyDashboard.tsx',
  'apps/web/src/components/auth/email-verification-guidance.tsx',
  'apps/web/src/components/auth/enhanced-auth.tsx',
  'apps/web/src/components/auth/enhanced-enterprise-login.tsx',
  'apps/web/src/components/auth/mfa-setup.tsx',
  'apps/web/src/components/auth/simple-login.tsx',
  'apps/web/src/components/dashboard/quick-actions.tsx',
  'apps/web/src/components/employer/EmployerDashboard.tsx',
  'apps/web/src/components/notifications/access-link-notification.tsx',
  'apps/web/src/components/scraping/ScrapedItemsList.tsx',
  'apps/web/src/hooks/use-auth.ts',
  'apps/web/src/lib/ai/content-analyzer.ts',
  'apps/web/src/lib/ai/smart-analysis-trigger.ts',
  'apps/web/src/lib/analytics.ts',
  'apps/web/src/lib/application-automation/auto-apply.ts',
  'apps/web/src/lib/email/notification-system.ts',
  'apps/web/src/lib/job-feeds/index.ts',
  'apps/web/src/lib/security/credential-manager.ts'
];

function fixConsoleStatements(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern to match console statements that aren't already disabled
  const consolePattern = /^(\s*)(console\.(log|info|warn|error|debug)\([^)]*\);?\s*)$/gm;
  
  content = content.replace(consolePattern, (match, indent, consoleStatement) => {
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
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed console statements in: ${filePath}`);
  } else {
    console.log(`No changes needed in: ${filePath}`);
  }
}

// Process all files
filesToFix.forEach(fixConsoleStatements);

console.log('Console statement fixes completed!');
