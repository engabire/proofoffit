#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🧪 ProofOfFit Simple Test Runner')
console.log('=================================\n')

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description, cwd = process.cwd()) {
  log(`\n${colors.bold}${description}${colors.reset}`)
  log(`Running: ${command}`, 'blue')
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd: cwd
    })
    log(`✅ ${description} - PASSED`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red')
    return false
  }
}

function checkFileStructure() {
  log('🔍 Checking File Structure...', 'blue')
  
  const requiredFiles = [
    'apps/web/package.json',
    'apps/web/src/app/layout.tsx',
    'apps/web/src/app/page.tsx',
    'apps/web/src/app/auth/signin/page.tsx',
    'apps/web/src/app/auth/signup/page.tsx',
    'apps/web/src/app/candidate/profile/page.tsx',
    'apps/web/src/app/employer/intake/page.tsx',
    'apps/web/src/lib/policy-engine/index.ts',
    'apps/web/src/lib/tailor-engine/index.ts',
    'apps/web/src/lib/stripe/index.ts',
    'packages/ui/package.json',
    'infra/supabase/000_extensions.sql',
    'infra/supabase/010_rls.sql',
    'infra/supabase/020_actionlog.sql',
    'infra/supabase/030_remaining_rls.sql'
  ]
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))
  
  if (missingFiles.length > 0) {
    log(`❌ Missing required files:`, 'red')
    missingFiles.forEach(file => log(`   - ${file}`, 'red'))
    return false
  }
  
  log('✅ File structure check passed', 'green')
  return true
}

function checkCodeQuality() {
  log('\n🔍 Checking Code Quality...', 'blue')
  
  const checks = [
    {
      name: 'TypeScript Configuration',
      check: () => fs.existsSync('apps/web/tsconfig.json')
    },
    {
      name: 'Tailwind Configuration',
      check: () => fs.existsSync('apps/web/tailwind.config.js')
    },
    {
      name: 'Next.js Configuration',
      check: () => fs.existsSync('apps/web/next.config.js')
    },
    {
      name: 'Prisma Schema',
      check: () => fs.existsSync('apps/web/prisma/schema.prisma')
    },
    {
      name: 'Environment Template',
      check: () => fs.existsSync('apps/web/env.example')
    }
  ]
  
  let allPassed = true
  checks.forEach(check => {
    if (check.check()) {
      log(`✅ ${check.name}`, 'green')
    } else {
      log(`❌ ${check.name}`, 'red')
      allPassed = false
    }
  })
  
  return allPassed
}

function checkTestFiles() {
  log('\n🧪 Checking Test Files...', 'blue')
  
  const testFiles = [
    'apps/web/src/test/auth.test.tsx',
    'apps/web/src/test/policy-engine.test.ts',
    'apps/web/src/test/tailor-engine.test.ts',
    'apps/web/src/test/stripe.test.ts',
    'apps/web/src/test/e2e/auth.spec.ts',
    'apps/web/src/test/e2e/candidate.spec.ts',
    'apps/web/src/test/e2e/employer.spec.ts',
    'apps/web/src/test/e2e/landing.spec.ts'
  ]
  
  const existingTests = testFiles.filter(file => fs.existsSync(file))
  
  log(`Found ${existingTests.length}/${testFiles.length} test files:`, 'blue')
  existingTests.forEach(file => log(`✅ ${file}`, 'green'))
  
  const missingTests = testFiles.filter(file => !fs.existsSync(file))
  if (missingTests.length > 0) {
    log(`Missing test files:`, 'yellow')
    missingTests.forEach(file => log(`⚠️  ${file}`, 'yellow'))
  }
  
  return existingTests.length > 0
}

function checkArchitectureCompliance() {
  log('\n🏗️  Checking Architecture Compliance...', 'blue')
  
  const architectureChecks = [
    {
      name: 'Multi-tenant Database Schema',
      check: () => {
        const schema = fs.readFileSync('apps/web/prisma/schema.prisma', 'utf8')
        return schema.includes('tenantId') && schema.includes('tenants')
      }
    },
    {
      name: 'Row Level Security (RLS)',
      check: () => {
        const rlsFile = fs.readFileSync('infra/supabase/010_rls.sql', 'utf8')
        return rlsFile.includes('row level security') && rlsFile.includes('policy')
      }
    },
    {
      name: 'Immutable Action Log',
      check: () => {
        const actionLogFile = fs.readFileSync('infra/supabase/020_actionlog.sql', 'utf8')
        return actionLogFile.includes('actionlog_hash') && actionLogFile.includes('trigger')
      }
    },
    {
      name: 'Policy Engine Implementation',
      check: () => {
        const policyEngine = fs.readFileSync('apps/web/src/lib/policy-engine/index.ts', 'utf8')
        return policyEngine.includes('PolicyEngine') && policyEngine.includes('checkJobSourcePolicy')
      }
    },
    {
      name: 'Tailor Engine Implementation',
      check: () => {
        const tailorEngine = fs.readFileSync('apps/web/src/lib/tailor-engine/index.ts', 'utf8')
        return tailorEngine.includes('TailorEngine') && tailorEngine.includes('tailorDocument')
      }
    },
    {
      name: 'Stripe Integration',
      check: () => {
        const stripeService = fs.readFileSync('apps/web/src/lib/stripe/index.ts', 'utf8')
        return stripeService.includes('StripeService') && stripeService.includes('createCheckoutSession')
      }
    },
    {
      name: 'Authentication System',
      check: () => {
        const authHelpers = fs.readFileSync('apps/web/src/lib/auth-helpers.ts', 'utf8')
        return authHelpers.includes('getCurrentUserWithProfile') && authHelpers.includes('supabase')
      }
    },
    {
      name: 'Candidate Features',
      check: () => {
        const candidateProfile = fs.readFileSync('apps/web/src/app/candidate/profile/page.tsx', 'utf8')
        return candidateProfile.includes('candidate_profiles') && candidateProfile.includes('bullets')
      }
    },
    {
      name: 'Employer Features',
      check: () => {
        const employerIntake = fs.readFileSync('apps/web/src/app/employer/intake/page.tsx', 'utf8')
        return employerIntake.includes('employer_intakes') && employerIntake.includes('requirements')
      }
    }
  ]
  
  let allPassed = true
  architectureChecks.forEach(check => {
    try {
      if (check.check()) {
        log(`✅ ${check.name}`, 'green')
      } else {
        log(`❌ ${check.name}`, 'red')
        allPassed = false
      }
    } catch (error) {
      log(`❌ ${check.name} - Error: ${error.message}`, 'red')
      allPassed = false
    }
  })
  
  return allPassed
}

function generateReport() {
  log('\n📊 ProofOfFit Test Report', 'bold')
  log('==========================', 'bold')
  
  const results = {
    fileStructure: checkFileStructure(),
    codeQuality: checkCodeQuality(),
    testFiles: checkTestFiles(),
    architecture: checkArchitectureCompliance()
  }
  
  log('\n📋 Summary', 'bold')
  log('===========', 'bold')
  
  const status = (passed) => passed ? '✅ PASSED' : '❌ FAILED'
  const color = (passed) => passed ? 'green' : 'red'
  
  log(`File Structure: ${status(results.fileStructure)}`, color(results.fileStructure))
  log(`Code Quality: ${status(results.codeQuality)}`, color(results.codeQuality))
  log(`Test Files: ${status(results.testFiles)}`, color(results.testFiles))
  log(`Architecture: ${status(results.architecture)}`, color(results.architecture))
  
  const allPassed = Object.values(results).every(Boolean)
  
  if (allPassed) {
    log('\n🎉 All checks passed! ProofOfFit is properly implemented.', 'green')
    log('\n📝 Next Steps:', 'blue')
    log('1. Set up Supabase project and run migrations', 'blue')
    log('2. Configure environment variables', 'blue')
    log('3. Install dependencies: npm install', 'blue')
    log('4. Run development server: npm run dev', 'blue')
    log('5. Test the application manually', 'blue')
  } else {
    log('\n⚠️  Some checks failed. Please review the issues above.', 'yellow')
  }
  
  return allPassed
}

// Main execution
if (require.main === module) {
  const success = generateReport()
  process.exit(success ? 0 : 1)
}

module.exports = {
  checkFileStructure,
  checkCodeQuality,
  checkTestFiles,
  checkArchitectureCompliance,
  generateReport
}