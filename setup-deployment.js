#!/usr/bin/env node

/**
 * ProofOfFit Deployment Setup Script
 * 
 * This script helps verify deployment readiness and provides
 * guidance for setting up the production environment.
 */

const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green')
    return true
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red')
    return false
  }
}

function checkEnvironmentVariables() {
  log('\n🔧 Checking Environment Variables...', 'blue')
  
  const envExample = 'apps/web/env.example'
  if (!fs.existsSync(envExample)) {
    log('❌ Environment template missing', 'red')
    return false
  }
  
  const envContent = fs.readFileSync(envExample, 'utf8')
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ]
  
  let allPresent = true
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      log(`✅ ${varName}`, 'green')
    } else {
      log(`❌ ${varName} - Missing from template`, 'red')
      allPresent = false
    }
  })
  
  return allPresent
}

function checkDatabaseSetup() {
  log('\n🗄️  Checking Database Setup...', 'blue')
  
  const checks = [
    { file: 'apps/web/prisma/schema.prisma', desc: 'Prisma schema' },
    { file: 'infra/supabase/000_extensions.sql', desc: 'Database extensions' },
    { file: 'infra/supabase/010_rls.sql', desc: 'Row-Level Security policies' },
    { file: 'infra/supabase/020_actionlog.sql', desc: 'Action log setup' },
    { file: 'infra/supabase/030_remaining_rls.sql', desc: 'Complete RLS policies' }
  ]
  
  return checks.every(check => checkFile(check.file, check.desc))
}

function checkDeploymentConfig() {
  log('\n🚀 Checking Deployment Configuration...', 'blue')
  
  const checks = [
    { file: '.github/workflows/ci.yml', desc: 'GitHub Actions CI/CD' },
    { file: 'apps/web/next.config.js', desc: 'Next.js configuration' },
    { file: 'apps/web/package.json', desc: 'Package configuration' },
    { file: 'turbo.json', desc: 'Turborepo configuration' }
  ]
  
  return checks.every(check => checkFile(check.file, check.desc))
}

function checkSecuritySetup() {
  log('\n🔐 Checking Security Configuration...', 'blue')
  
  const checks = [
    { file: 'apps/web/src/middleware.ts', desc: 'Authentication middleware' },
    { file: 'apps/web/src/lib/auth-helpers.ts', desc: 'Auth utilities' },
    { file: 'infra/supabase/README.md', desc: 'Supabase setup guide' }
  ]
  
  return checks.every(check => checkFile(check.file, check.desc))
}

function generateDeploymentSummary(results) {
  log('\n📊 Deployment Readiness Summary', 'bright')
  log('================================', 'bright')
  
  const categories = [
    { name: 'Environment Variables', result: results.envVars },
    { name: 'Database Setup', result: results.database },
    { name: 'Deployment Config', result: results.deployment },
    { name: 'Security Setup', result: results.security }
  ]
  
  categories.forEach(category => {
    const status = category.result ? '✅ READY' : '❌ NEEDS ATTENTION'
    const color = category.result ? 'green' : 'red'
    log(`${category.name}: ${status}`, color)
  })
  
  const allReady = Object.values(results).every(Boolean)
  
  if (allReady) {
    log('\n🎉 All systems ready for deployment!', 'green')
    log('\nNext steps:', 'cyan')
    log('1. Set up Supabase project and run migrations', 'yellow')
    log('2. Configure Vercel project and environment variables', 'yellow')
    log('3. Add GitHub secrets for CI/CD', 'yellow')
    log('4. Deploy to production', 'yellow')
    log('\nSee DEPLOYMENT.md for detailed instructions.', 'blue')
  } else {
    log('\n⚠️  Some components need attention before deployment.', 'yellow')
    log('Please review the issues above and fix them.', 'yellow')
  }
  
  return allReady
}

function showQuickStartGuide() {
  log('\n🚀 Quick Start Guide', 'bright')
  log('===================', 'bright')
  
  log('\n1. Set up Supabase:', 'cyan')
  log('   - Create project at supabase.com', 'yellow')
  log('   - Run SQL scripts from infra/supabase/', 'yellow')
  log('   - Get API keys from Settings → API', 'yellow')
  
  log('\n2. Set up Vercel:', 'cyan')
  log('   - Create project at vercel.com', 'yellow')
  log('   - Import GitHub repository', 'yellow')
  log('   - Set root directory to apps/web', 'yellow')
  
  log('\n3. Configure GitHub Secrets:', 'cyan')
  log('   - Go to repository Settings → Secrets', 'yellow')
  log('   - Add VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID', 'yellow')
  log('   - Add Supabase and Stripe credentials', 'yellow')
  
  log('\n4. Deploy:', 'cyan')
  log('   - Push to main branch', 'yellow')
  log('   - GitHub Actions will handle the rest!', 'yellow')
  
  log('\n📖 For detailed instructions, see DEPLOYMENT.md', 'blue')
}

function main() {
  log('🚀 ProofOfFit Deployment Setup Checker', 'bright')
  log('======================================', 'bright')
  
  const results = {
    envVars: checkEnvironmentVariables(),
    database: checkDatabaseSetup(),
    deployment: checkDeploymentConfig(),
    security: checkSecuritySetup()
  }
  
  const isReady = generateDeploymentSummary(results)
  
  if (isReady) {
    showQuickStartGuide()
  }
  
  log('\n✨ Setup check complete!', 'magenta')
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { main }

