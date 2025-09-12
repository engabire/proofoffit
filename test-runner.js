#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 ProofOfFit Test Runner')
console.log('========================\n')

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

function runCommand(command, description) {
  log(`\n${colors.bold}${description}${colors.reset}`)
  log(`Running: ${command}`, 'blue')
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    log(`✅ ${description} - PASSED`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red')
    return false
  }
}

function checkEnvironment() {
  log('🔍 Checking Environment...', 'blue')
  
  const requiredFiles = [
    'apps/web/package.json',
    'apps/web/jest.config.js',
    'apps/web/playwright.config.ts',
    'apps/web/src/test/setup.ts'
  ]
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))
  
  if (missingFiles.length > 0) {
    log(`❌ Missing required files: ${missingFiles.join(', ')}`, 'red')
    return false
  }
  
  log('✅ Environment check passed', 'green')
  return true
}

function installDependencies() {
  log('\n📦 Installing Dependencies...', 'blue')
  
  const commands = [
    'npm install',
    'cd apps/web && npm install'
  ]
  
  for (const command of commands) {
    if (!runCommand(command, `Installing dependencies`)) {
      return false
    }
  }
  
  return true
}

function runUnitTests() {
  log('\n🧪 Running Unit Tests...', 'blue')
  
  const testFiles = [
    'apps/web/src/test/auth.test.tsx',
    'apps/web/src/test/policy-engine.test.ts',
    'apps/web/src/test/tailor-engine.test.ts',
    'apps/web/src/test/stripe.test.ts'
  ]
  
  const existingTests = testFiles.filter(file => fs.existsSync(file))
  
  if (existingTests.length === 0) {
    log('⚠️  No unit tests found', 'yellow')
    return true
  }
  
  return runCommand(
    'cd apps/web && npm test -- --coverage --watchAll=false',
    'Unit Tests'
  )
}

function runE2ETests() {
  log('\n🌐 Running End-to-End Tests...', 'blue')
  
  const e2eFiles = [
    'apps/web/src/test/e2e/auth.spec.ts',
    'apps/web/src/test/e2e/candidate.spec.ts',
    'apps/web/src/test/e2e/employer.spec.ts',
    'apps/web/src/test/e2e/landing.spec.ts'
  ]
  
  const existingTests = e2eFiles.filter(file => fs.existsSync(file))
  
  if (existingTests.length === 0) {
    log('⚠️  No E2E tests found', 'yellow')
    return true
  }
  
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' })
  } catch (error) {
    log('📦 Installing Playwright...', 'blue')
    runCommand('cd apps/web && npx playwright install', 'Playwright Installation')
  }
  
  return runCommand(
    'cd apps/web && npx playwright test --reporter=html',
    'End-to-End Tests'
  )
}

function runLinting() {
  log('\n🔍 Running Linting...', 'blue')
  
  return runCommand(
    'cd apps/web && npm run lint',
    'ESLint'
  )
}

function runBuild() {
  log('\n🏗️  Running Build...', 'blue')
  
  return runCommand(
    'cd apps/web && npm run build',
    'Next.js Build'
  )
}

function generateTestReport() {
  log('\n📊 Test Results Summary', 'blue')
  log('========================', 'blue')
  
  const results = {
    environment: checkEnvironment(),
    dependencies: false,
    linting: false,
    build: false,
    unitTests: false,
    e2eTests: false
  }
  
  if (results.environment) {
    results.dependencies = installDependencies()
    
    if (results.dependencies) {
      results.linting = runLinting()
      results.build = runBuild()
      results.unitTests = runUnitTests()
      results.e2eTests = runE2ETests()
    }
  }
  
  // Summary
  log('\n📋 Test Summary', 'bold')
  log('===============', 'bold')
  
  const status = (passed) => passed ? '✅ PASSED' : '❌ FAILED'
  const color = (passed) => passed ? 'green' : 'red'
  
  log(`Environment Check: ${status(results.environment)}`, color(results.environment))
  log(`Dependencies: ${status(results.dependencies)}`, color(results.dependencies))
  log(`Linting: ${status(results.linting)}`, color(results.linting))
  log(`Build: ${status(results.build)}`, color(results.build))
  log(`Unit Tests: ${status(results.unitTests)}`, color(results.unitTests))
  log(`E2E Tests: ${status(results.e2eTests)}`, color(results.e2eTests))
  
  const allPassed = Object.values(results).every(Boolean)
  
  if (allPassed) {
    log('\n🎉 All tests passed! ProofOfFit is ready for deployment.', 'green')
  } else {
    log('\n⚠️  Some tests failed. Please review the output above.', 'yellow')
  }
  
  return allPassed
}

// Main execution
if (require.main === module) {
  const success = generateTestReport()
  process.exit(success ? 0 : 1)
}

module.exports = {
  checkEnvironment,
  installDependencies,
  runUnitTests,
  runE2ETests,
  runLinting,
  runBuild,
  generateTestReport
}