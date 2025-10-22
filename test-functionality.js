#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3002';

// Test endpoints and expected status codes
const testEndpoints = [
  // Main pages
  { path: '/', expected: 200, description: 'Home page' },
  { path: '/analytics', expected: 200, description: 'Analytics page' },
  { path: '/monitoring', expected: 200, description: 'Monitoring page' },
  { path: '/security', expected: 200, description: 'Security page' },
  { path: '/performance', expected: 200, description: 'Performance page' },
  { path: '/integrations', expected: 200, description: 'Integrations page' },
  
  // API endpoints
  { path: '/api/health', expected: 200, description: 'Health API' },
  { path: '/api/analytics', expected: 200, description: 'Analytics API' },
  { path: '/api/monitoring?action=dashboard', expected: 200, description: 'Monitoring Dashboard API' },
  { path: '/api/monitoring?action=events', expected: 200, description: 'Monitoring Events API' },
  { path: '/api/monitoring?action=alerts', expected: 200, description: 'Monitoring Alerts API' },
  { path: '/api/jobs/search?q=software&limit=5', expected: 200, description: 'Job Search API' },
  
  // Integration APIs (expected to return errors due to missing API keys)
  { path: '/api/integrations/email', expected: 500, description: 'Email Integration API' },
  { path: '/api/integrations/calendar', expected: 400, description: 'Calendar Integration API' },
  { path: '/api/integrations/ats', expected: 500, description: 'ATS Integration API' },
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        url: url
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  console.log('🧪 Starting ProofOfFit Functionality Tests\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  for (const test of testEndpoints) {
    try {
      const url = `${BASE_URL}${test.path}`;
      const result = await makeRequest(url);
      
      const success = result.statusCode === test.expected;
      const status = success ? '✅ PASS' : '❌ FAIL';
      
      console.log(`${status} ${test.description}`);
      console.log(`   URL: ${url}`);
      console.log(`   Expected: ${test.expected}, Got: ${result.statusCode}`);
      
      if (!success) {
        console.log(`   ❌ Status code mismatch!`);
      }
      
      results.push({
        ...test,
        actual: result.statusCode,
        success,
        url
      });
      
      if (success) passed++;
      else failed++;
      
    } catch (error) {
      console.log(`❌ FAIL ${test.description}`);
      console.log(`   URL: ${BASE_URL}${test.path}`);
      console.log(`   Error: ${error.message}`);
      
      results.push({
        ...test,
        actual: 'ERROR',
        success: false,
        error: error.message,
        url: `${BASE_URL}${test.path}`
      });
      
      failed++;
    }
    
    console.log('');
  }
  
  console.log('=' .repeat(60));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('=' .repeat(60));
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   • ${result.description}: Expected ${result.expected}, got ${result.actual}`);
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });
  }
  
  console.log('\n🎯 Testing Complete!');
  
  // Test specific functionality
  console.log('\n🔍 Testing Specific Functionality:');
  
  // Test job search with different parameters
  try {
    const jobSearchUrl = `${BASE_URL}/api/jobs/search?q=react&location=remote&limit=3`;
    const jobResult = await makeRequest(jobSearchUrl);
    console.log(`✅ Job Search (React, Remote): ${jobResult.statusCode}`);
  } catch (error) {
    console.log(`❌ Job Search Error: ${error.message}`);
  }
  
  // Test analytics data
  try {
    const analyticsUrl = `${BASE_URL}/api/analytics`;
    const analyticsResult = await makeRequest(analyticsUrl);
    console.log(`✅ Analytics Data: ${analyticsResult.statusCode}`);
  } catch (error) {
    console.log(`❌ Analytics Error: ${error.message}`);
  }
  
  return { passed, failed, results };
}

// Run the tests
runTests().then(({ passed, failed }) => {
  process.exit(failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
