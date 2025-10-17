#!/usr/bin/env node

/**
 * Supabase Security Audit Script
 * 
 * This script helps identify and fix common security issues in Supabase projects.
 * Run this script to get recommendations for improving your Supabase security posture.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.bold}${colors.cyan}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Security checks
const securityChecks = {
  // Environment Variables
  checkEnvironmentVariables() {
    logSection('Environment Variables Security');
    
    const envExamplePath = path.join(process.cwd(), 'apps/web/env.example');
    const envPath = path.join(process.cwd(), 'apps/web/.env');
    const envLocalPath = path.join(process.cwd(), 'apps/web/.env.local');
    
    if (fs.existsSync(envExamplePath)) {
      const envExample = fs.readFileSync(envExamplePath, 'utf8');
      
      // Check for sensitive defaults
      if (envExample.includes('localhost:3000')) {
        logWarning('Found localhost:3000 in env.example - ensure production URLs are used');
      }
      
      if (envExample.includes('your_')) {
        logInfo('Found placeholder values in env.example - ensure these are replaced in production');
      }
      
      // Check for required Supabase variables
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
      ];
      
      requiredVars.forEach(varName => {
        if (envExample.includes(varName)) {
          logSuccess(`Found required variable: ${varName}`);
        } else {
          logError(`Missing required variable: ${varName}`);
        }
      });
    } else {
      logError('env.example file not found');
    }
    
    // Check if .env files exist (should not be committed)
    if (fs.existsSync(envPath)) {
      logWarning('.env file exists - ensure it\'s in .gitignore');
    }
    
    if (fs.existsSync(envLocalPath)) {
      logWarning('.env.local file exists - ensure it\'s in .gitignore');
    }
  },

  // RLS Policies
  checkRLSPolicies() {
    logSection('Row Level Security (RLS) Policies');
    
    const rlsFiles = [
      'infra/supabase/010_rls.sql',
      'infra/supabase/030_remaining_rls.sql'
    ];
    
    let hasRLS = false;
    let hasPolicies = false;
    
    rlsFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        hasRLS = true;
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('enable row level security')) {
          logSuccess(`RLS enabled in ${file}`);
        }
        
        if (content.includes('create policy')) {
          hasPolicies = true;
          logSuccess(`Policies defined in ${file}`);
        }
        
        // Check for common security issues
        if (content.includes('for all using (true)')) {
          logWarning(`Found overly permissive policy in ${file} - review for security`);
        }
        
        if (content.includes('tenant_id')) {
          logSuccess(`Tenant isolation found in ${file}`);
        }
      }
    });
    
    if (!hasRLS) {
      logError('No RLS configuration found');
    }
    
    if (!hasPolicies) {
      logError('No RLS policies found');
    }
  },

  // Authentication Configuration
  checkAuthentication() {
    logSection('Authentication Security');
    
    const authFiles = [
      'apps/web/src/components/auth/enhanced-auth.tsx',
      'apps/web/src/lib/supabase.ts'
    ];
    
    authFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('createClientComponentClient')) {
          logSuccess(`Supabase client properly configured in ${file}`);
        }
        
        if (content.includes('autoRefreshToken: false')) {
          logSuccess(`Auto-refresh disabled for admin client in ${file}`);
        }
        
        if (content.includes('persistSession: false')) {
          logSuccess(`Session persistence disabled for admin client in ${file}`);
        }
      }
    });
  },

  // Security Headers
  checkSecurityHeaders() {
    logSection('Security Headers');
    
    const securityFile = path.join(process.cwd(), 'apps/web/src/lib/security.ts');
    if (fs.existsSync(securityFile)) {
      const content = fs.readFileSync(securityFile, 'utf8');
      
      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];
      
      requiredHeaders.forEach(header => {
        if (content.includes(header)) {
          logSuccess(`Security header configured: ${header}`);
        } else {
          logError(`Missing security header: ${header}`);
        }
      });
      
      // Check CSP configuration
      if (content.includes('Content-Security-Policy')) {
        logSuccess('Content Security Policy configured');
        
        if (content.includes("'unsafe-inline'")) {
          logWarning('CSP contains unsafe-inline - consider removing for better security');
        }
        
        if (content.includes("'unsafe-eval'")) {
          logWarning('CSP contains unsafe-eval - consider removing for better security');
        }
      }
    } else {
      logError('Security configuration file not found');
    }
  },

  // CSRF Protection
  checkCSRFProtection() {
    logSection('CSRF Protection');
    
    const securityFile = path.join(process.cwd(), 'apps/web/src/lib/security.ts');
    if (fs.existsSync(securityFile)) {
      const content = fs.readFileSync(securityFile, 'utf8');
      
      if (content.includes('csrfProtection')) {
        logSuccess('CSRF protection implemented');
      } else {
        logError('CSRF protection not found');
      }
      
      if (content.includes('generateCSRFToken')) {
        logSuccess('CSRF token generation implemented');
      }
      
      if (content.includes('validateCSRFToken')) {
        logSuccess('CSRF token validation implemented');
      }
    }
  },

  // Rate Limiting
  checkRateLimiting() {
    logSection('Rate Limiting');
    
    const securityFile = path.join(process.cwd(), 'apps/web/src/lib/security.ts');
    if (fs.existsSync(securityFile)) {
      const content = fs.readFileSync(securityFile, 'utf8');
      
      if (content.includes('rateLimit')) {
        logSuccess('Rate limiting implemented');
      } else {
        logError('Rate limiting not found');
      }
    }
  },

  // Input Sanitization
  checkInputSanitization() {
    logSection('Input Sanitization');
    
    const securityFile = path.join(process.cwd(), 'apps/web/src/lib/security.ts');
    if (fs.existsSync(securityFile)) {
      const content = fs.readFileSync(securityFile, 'utf8');
      
      if (content.includes('sanitizeInput')) {
        logSuccess('Input sanitization implemented');
      } else {
        logError('Input sanitization not found');
      }
      
      if (content.includes('escapeHTML')) {
        logSuccess('HTML escaping implemented');
      } else {
        logError('HTML escaping not found');
      }
    }
  },

  // Database Security
  checkDatabaseSecurity() {
    logSection('Database Security');
    
    const migrationFiles = fs.readdirSync(path.join(process.cwd(), 'infra/supabase/migrations'), { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
      .map(dirent => dirent.name);
    
    if (migrationFiles.length > 0) {
      logSuccess(`Found ${migrationFiles.length} migration files`);
    } else {
      logWarning('No migration files found');
    }
    
    // Check for common SQL injection vulnerabilities
    const sqlFiles = [
      'infra/supabase/010_rls.sql',
      'infra/supabase/030_remaining_rls.sql'
    ];
    
    sqlFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('$$')) {
          logSuccess(`Using dollar-quoted strings in ${file} (good for SQL injection prevention)`);
        }
        
        if (content.includes('auth.jwt()')) {
          logSuccess(`Using JWT claims for authorization in ${file}`);
        }
      }
    });
  }
};

// Generate security recommendations
function generateRecommendations() {
  logSection('Security Recommendations');
  
  const recommendations = [
    {
      category: 'Authentication',
      items: [
        'Enable MFA for all admin users',
        'Use strong password policies',
        'Implement session timeout',
        'Enable email verification',
        'Use secure JWT secrets'
      ]
    },
    {
      category: 'Database',
      items: [
        'Enable RLS on all tables',
        'Use least privilege principle for database users',
        'Enable audit logging',
        'Regular security updates',
        'Backup encryption'
      ]
    },
    {
      category: 'Network',
      items: [
        'Use HTTPS everywhere',
        'Implement proper CORS policies',
        'Use secure headers',
        'Enable HSTS',
        'Implement rate limiting'
      ]
    },
    {
      category: 'Application',
      items: [
        'Input validation and sanitization',
        'CSRF protection',
        'XSS prevention',
        'Secure cookie settings',
        'Content Security Policy'
      ]
    },
    {
      category: 'Monitoring',
      items: [
        'Enable Supabase security advisor',
        'Set up alerting for suspicious activity',
        'Regular security audits',
        'Log analysis',
        'Incident response plan'
      ]
    }
  ];
  
  recommendations.forEach(rec => {
    log(`\n${colors.bold}${rec.category}:${colors.reset}`);
    rec.items.forEach(item => {
      log(`  • ${item}`, 'blue');
    });
  });
}

// Generate Supabase-specific fixes
function generateSupabaseFixes() {
  logSection('Supabase Security Fixes');
  
  const fixes = [
    {
      issue: 'Enable RLS on all tables',
      fix: `-- Run this in Supabase SQL editor
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "policy_name" ON your_table_name
FOR ALL USING (auth.uid() = user_id);`
    },
    {
      issue: 'Secure API keys',
      fix: `-- In Supabase Dashboard > Settings > API
-- 1. Regenerate anon key if compromised
-- 2. Use service role key only on server-side
-- 3. Never expose service role key to client`
    },
    {
      issue: 'Enable email verification',
      fix: `-- In Supabase Dashboard > Authentication > Settings
-- Enable "Enable email confirmations"
-- Set custom SMTP if needed`
    },
    {
      issue: 'Configure CORS',
      fix: `-- In Supabase Dashboard > Settings > API
-- Add your domain to allowed origins
-- Remove wildcard (*) origins`
    },
    {
      issue: 'Enable audit logging',
      fix: `-- Enable in Supabase Dashboard > Settings > Audit Logs
-- Or use pgAudit extension for detailed logging`
    }
  ];
  
  fixes.forEach((fix, index) => {
    log(`\n${colors.bold}${index + 1}. ${fix.issue}:${colors.reset}`);
    log(fix.fix, 'cyan');
  });
}

// Main execution
function main() {
  log(`${colors.bold}${colors.magenta}Supabase Security Audit${colors.reset}`);
  log('Scanning your project for security issues...\n');
  
  // Run all security checks
  Object.values(securityChecks).forEach(check => {
    try {
      check();
    } catch (error) {
      logError(`Error running security check: ${error.message}`);
    }
  });
  
  // Generate recommendations
  generateRecommendations();
  
  // Generate Supabase-specific fixes
  generateSupabaseFixes();
  
  log(`\n${colors.bold}${colors.green}Audit Complete!${colors.reset}`);
  log('Review the recommendations above and implement the necessary fixes.');
  log('For more information, visit: https://supabase.com/docs/guides/platform/security');
}

// Run the audit
if (require.main === module) {
  main();
}

module.exports = { securityChecks, generateRecommendations, generateSupabaseFixes };
