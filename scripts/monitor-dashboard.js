#!/usr/bin/env node

/**
 * Monitoring Dashboard Script
 * 
 * Provides real-time monitoring of the ProofOfFit deployment
 * with alerts and status reporting.
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const PRODUCTION_URL = 'https://www.proofoffit.com';
const HEALTH_CHECK_URL = `${PRODUCTION_URL}/api/health`;
const CHECK_INTERVAL = 60000; // 1 minute
const ALERT_THRESHOLD = 3; // Alert after 3 consecutive failures

// State tracking
let consecutiveFailures = 0;
let lastAlertTime = 0;
let isHealthy = true;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
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

async function checkHealth() {
  try {
    const response = await makeRequest(HEALTH_CHECK_URL);
    
    if (response.statusCode === 200) {
      const health = JSON.parse(response.body);
      return {
        status: 'healthy',
        data: health,
        responseTime: Date.now() - health.timestamp
      };
    } else {
      return {
        status: 'unhealthy',
        error: `HTTP ${response.statusCode}`,
        data: null
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      data: null
    };
  }
}

async function checkMainSite() {
  try {
    const startTime = Date.now();
    const response = await makeRequest(PRODUCTION_URL);
    const responseTime = Date.now() - startTime;
    
    if (response.statusCode === 200) {
      return {
        status: 'healthy',
        responseTime,
        contentLength: response.body.length
      };
    } else {
      return {
        status: 'unhealthy',
        error: `HTTP ${response.statusCode}`,
        responseTime
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      responseTime: null
    };
  }
}

function displayStatus(healthCheck, siteCheck) {
  // Clear screen and move cursor to top
  process.stdout.write('\x1B[2J\x1B[0f');
  
  // Header
  log('🚀 ProofOfFit Monitoring Dashboard', 'bold');
  log('=====================================', 'bold');
  log(`Last Check: ${new Date().toLocaleString()}`, 'cyan');
  log('');
  
  // Health Check Status
  if (healthCheck.status === 'healthy') {
    log('🏥 Health Endpoint: ✅ HEALTHY', 'green');
    if (healthCheck.data) {
      log(`   Status: ${healthCheck.data.status}`, 'green');
      log(`   Environment: ${healthCheck.data.environment}`, 'green');
      log(`   Database: ${healthCheck.data.services.database}`, 'green');
      log(`   Auth: ${healthCheck.data.services.auth}`, 'green');
      log(`   Uptime: ${Math.floor(healthCheck.data.uptime / 60)} minutes`, 'green');
    }
  } else {
    log(`🏥 Health Endpoint: ❌ ${healthCheck.status.toUpperCase()}`, 'red');
    log(`   Error: ${healthCheck.error}`, 'red');
  }
  
  log('');
  
  // Main Site Status
  if (siteCheck.status === 'healthy') {
    log('🌐 Main Site: ✅ HEALTHY', 'green');
    log(`   Response Time: ${siteCheck.responseTime}ms`, 'green');
    log(`   Content Length: ${siteCheck.contentLength} bytes`, 'green');
  } else {
    log(`🌐 Main Site: ❌ ${siteCheck.status.toUpperCase()}`, 'red');
    log(`   Error: ${siteCheck.error}`, 'red');
    if (siteCheck.responseTime) {
      log(`   Response Time: ${siteCheck.responseTime}ms`, 'red');
    }
  }
  
  log('');
  
  // Overall Status
  const overallHealthy = healthCheck.status === 'healthy' && siteCheck.status === 'healthy';
  if (overallHealthy) {
    log('🎉 Overall Status: ✅ ALL SYSTEMS OPERATIONAL', 'green');
    consecutiveFailures = 0;
    isHealthy = true;
  } else {
    consecutiveFailures++;
    log(`⚠️  Overall Status: ❌ ISSUES DETECTED (${consecutiveFailures} consecutive failures)`, 'red');
    isHealthy = false;
  }
  
  log('');
  
  // Monitoring Info
  log('📊 Monitoring Info:', 'blue');
  log(`   Check Interval: ${CHECK_INTERVAL / 1000} seconds`, 'blue');
  log(`   Alert Threshold: ${ALERT_THRESHOLD} failures`, 'blue');
  log(`   Consecutive Failures: ${consecutiveFailures}`, consecutiveFailures > 0 ? 'red' : 'green');
  log('');
  
  // Commands
  log('💡 Commands:', 'magenta');
  log('   Ctrl+C to stop monitoring', 'magenta');
  log('   Run "node scripts/verify-deployment.js" for detailed check', 'magenta');
  log('');
}

function sendAlert(healthCheck, siteCheck) {
  const now = Date.now();
  
  // Don't spam alerts - wait at least 5 minutes between alerts
  if (now - lastAlertTime < 300000) {
    return;
  }
  
  lastAlertTime = now;
  
  log('🚨 ALERT: Deployment Issues Detected!', 'red');
  log('=====================================', 'red');
  
  if (healthCheck.status !== 'healthy') {
    log(`Health Endpoint: ${healthCheck.error}`, 'red');
  }
  
  if (siteCheck.status !== 'healthy') {
    log(`Main Site: ${siteCheck.error}`, 'red');
  }
  
  log('');
  log('🔧 Recommended Actions:', 'yellow');
  log('1. Check Vercel dashboard: https://vercel.com/dashboard', 'yellow');
  log('2. Run verification script: node scripts/verify-deployment.js', 'yellow');
  log('3. Check deployment logs: vercel logs', 'yellow');
  log('4. Consider rollback if issues persist', 'yellow');
  log('');
}

async function runCheck() {
  try {
    const [healthCheck, siteCheck] = await Promise.all([
      checkHealth(),
      checkMainSite()
    ]);
    
    displayStatus(healthCheck, siteCheck);
    
    // Send alert if we've exceeded the threshold
    if (consecutiveFailures >= ALERT_THRESHOLD) {
      sendAlert(healthCheck, siteCheck);
    }
    
  } catch (error) {
    log(`💥 Monitoring error: ${error.message}`, 'red');
    consecutiveFailures++;
  }
}

function startMonitoring() {
  log('🚀 Starting ProofOfFit monitoring...', 'green');
  log(`Monitoring URL: ${PRODUCTION_URL}`, 'cyan');
  log(`Check interval: ${CHECK_INTERVAL / 1000} seconds`, 'cyan');
  log('');
  
  // Run initial check
  runCheck();
  
  // Set up interval
  const interval = setInterval(runCheck, CHECK_INTERVAL);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Stopping monitoring...', 'yellow');
    clearInterval(interval);
    log('👋 Monitoring stopped. Goodbye!', 'green');
    process.exit(0);
  });
}

// Start monitoring
startMonitoring();
