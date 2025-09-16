#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the deployment is working correctly
 * and prevents regressions by checking critical functionality.
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const PRODUCTION_URL = 'https://www.proofoffit.com';
const HEALTH_CHECK_URL = `${PRODUCTION_URL}/api/health`;
const CRITICAL_PATHS = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/demo/simple'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkHealthEndpoint() {
  log('\n🏥 Checking Health Endpoint...', 'blue');
  
  try {
    const response = await makeRequest(HEALTH_CHECK_URL);
    
    if (response.statusCode === 200) {
      const health = JSON.parse(response.body);
      log('✅ Health endpoint is responding', 'green');
      log(`   Status: ${health.status}`, 'green');
      log(`   Environment: ${health.environment}`, 'green');
      log(`   Database: ${health.services.database}`, 'green');
      log(`   Auth: ${health.services.auth}`, 'green');
      return true;
    } else {
      log(`❌ Health endpoint returned status ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health endpoint check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkCriticalPaths() {
  log('\n🛣️  Checking Critical Paths...', 'blue');
  
  const results = [];
  
  for (const path of CRITICAL_PATHS) {
    try {
      const url = `${PRODUCTION_URL}${path}`;
      const response = await makeRequest(url);
      
      if (response.statusCode === 200) {
        log(`✅ ${path} - OK (${response.statusCode})`, 'green');
        results.push({ path, status: 'success', statusCode: response.statusCode });
      } else {
        log(`❌ ${path} - Failed (${response.statusCode})`, 'red');
        results.push({ path, status: 'failed', statusCode: response.statusCode });
      }
    } catch (error) {
      log(`❌ ${path} - Error: ${error.message}`, 'red');
      results.push({ path, status: 'error', error: error.message });
    }
  }
  
  return results;
}

async function checkContentIntegrity() {
  log('\n🔍 Checking Content Integrity...', 'blue');
  
  try {
    const response = await makeRequest(PRODUCTION_URL);
    
    if (response.statusCode !== 200) {
      log(`❌ Main page returned status ${response.statusCode}`, 'red');
      return false;
    }
    
    const content = response.body;
    const requiredElements = [
      'ProofOfFit',
      'AI-Powered Hiring',
      'Sign In',
      'Get Started',
      'Features',
      'Pricing'
    ];
    
    const missingElements = requiredElements.filter(element => 
      !content.includes(element)
    );
    
    if (missingElements.length === 0) {
      log('✅ All required content elements found', 'green');
      return true;
    } else {
      log(`❌ Missing content elements: ${missingElements.join(', ')}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Content integrity check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkPerformance() {
  log('\n⚡ Checking Performance...', 'blue');
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(PRODUCTION_URL);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.statusCode === 200) {
      if (responseTime < 3000) {
        log(`✅ Response time: ${responseTime}ms (Good)`, 'green');
        return true;
      } else if (responseTime < 5000) {
        log(`⚠️  Response time: ${responseTime}ms (Acceptable)`, 'yellow');
        return true;
      } else {
        log(`❌ Response time: ${responseTime}ms (Too slow)`, 'red');
        return false;
      }
    } else {
      log(`❌ Performance check failed with status ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Performance check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkSecurityHeaders() {
  log('\n🔒 Checking Security Headers...', 'blue');
  
  try {
    const response = await makeRequest(PRODUCTION_URL);
    const headers = response.headers;
    
    const requiredHeaders = [
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => 
      !headers[header]
    );
    
    if (missingHeaders.length === 0) {
      log('✅ All required security headers present', 'green');
      return true;
    } else {
      log(`❌ Missing security headers: ${missingHeaders.join(', ')}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Security headers check failed: ${error.message}`, 'red');
    return false;
  }
}

async function getDeploymentInfo() {
  log('\n📊 Getting Deployment Information...', 'blue');
  
  try {
    // Get latest deployment info from Vercel
    const vercelInfo = execSync('vercel ls --json', { encoding: 'utf8' });
    const deployments = JSON.parse(vercelInfo);
    
    if (deployments.length > 0) {
      const latest = deployments[0];
      log(`✅ Latest deployment: ${latest.url}`, 'green');
      log(`   Status: ${latest.state}`, 'green');
      log(`   Created: ${new Date(latest.created).toLocaleString()}`, 'green');
      return latest;
    } else {
      log('❌ No deployments found', 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Failed to get deployment info: ${error.message}`, 'red');
    return null;
  }
}

async function main() {
  log('🚀 ProofOfFit Deployment Verification', 'bold');
  log('=====================================', 'bold');
  
  const results = {
    health: false,
    paths: [],
    content: false,
    performance: false,
    security: false,
    deployment: null
  };
  
  // Run all checks
  results.health = await checkHealthEndpoint();
  results.paths = await checkCriticalPaths();
  results.content = await checkContentIntegrity();
  results.performance = await checkPerformance();
  results.security = await checkSecurityHeaders();
  results.deployment = await getDeploymentInfo();
  
  // Summary
  log('\n📋 Verification Summary', 'bold');
  log('======================', 'bold');
  
  const pathResults = results.paths.filter(p => p.status === 'success');
  const allPathsWorking = pathResults.length === CRITICAL_PATHS.length;
  
  log(`Health Endpoint: ${results.health ? '✅ PASS' : '❌ FAIL'}`, results.health ? 'green' : 'red');
  log(`Critical Paths: ${allPathsWorking ? '✅ PASS' : '❌ FAIL'} (${pathResults.length}/${CRITICAL_PATHS.length})`, allPathsWorking ? 'green' : 'red');
  log(`Content Integrity: ${results.content ? '✅ PASS' : '❌ FAIL'}`, results.content ? 'green' : 'red');
  log(`Performance: ${results.performance ? '✅ PASS' : '❌ FAIL'}`, results.performance ? 'green' : 'red');
  log(`Security Headers: ${results.security ? '✅ PASS' : '❌ FAIL'}`, results.security ? 'green' : 'red');
  
  const allChecksPassed = results.health && allPathsWorking && results.content && results.performance && results.security;
  
  if (allChecksPassed) {
    log('\n🎉 All verification checks passed! Deployment is healthy.', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some verification checks failed. Please investigate.', 'red');
    process.exit(1);
  }
}

// Run the verification
main().catch(error => {
  log(`\n💥 Verification script failed: ${error.message}`, 'red');
  process.exit(1);
});
