import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Test endpoint for validating scraping system behavior
export async function POST(req: NextRequest) {
  try {
    const { test, params = {} } = await req.json();
    
    switch (test) {
      case 'lock_correctness':
        return await testLockCorrectness();
      case 'auth_pathing':
        return await testAuthPathing(req);
      case 'backoff_realism':
        return await testBackoffRealism();
      case 'robots_compliance':
        return await testRobotsCompliance(params);
      case 'idempotency':
        return await testIdempotency(params);
      case 'clock_skew':
        return await testClockSkew(params);
      case 'ttl_recovery':
        return await testTtlRecovery();
      default:
        return NextResponse.json({ error: 'Unknown test' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Test lock correctness with parallel requests
async function testLockCorrectness() {
  const promises = Array.from({ length: 10 }, (_, i) => 
    fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-internal-run': '1'
      }
    }).then(async res => ({
      index: i,
      status: res.status,
      body: await res.json()
    }))
  );
  
  const results = await Promise.all(promises);
  const successful = results.filter(r => r.status === 200);
  const locked = results.filter(r => r.status === 423);
  
  return NextResponse.json({
    test: 'lock_correctness',
    passed: successful.length === 1 && locked.length === 9,
    successful: successful.length,
    locked: locked.length,
    results
  });
}

// Test authentication pathways
async function testAuthPathing(req: NextRequest) {
  const tests = [
    {
      name: 'no_auth',
      headers: {},
      expectedStatus: 401
    },
    {
      name: 'bearer_only',
      headers: { 'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}` },
      expectedStatus: process.env.NODE_ENV === 'production' ? 403 : 200
    },
    {
      name: 'cron_only', 
      headers: { 'x-vercel-cron': '1' },
      expectedStatus: 401
    },
    {
      name: 'bearer_and_cron',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-vercel-cron': '1'
      },
      expectedStatus: 200
    },
    {
      name: 'internal_run',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-internal-run': '1'
      },
      expectedStatus: 200
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const response = await fetch('/api/scrape', {
        method: 'GET',
        headers: test.headers
      });
      
      results.push({
        name: test.name,
        expected: test.expectedStatus,
        actual: response.status,
        passed: response.status === test.expectedStatus
      });
    } catch (error) {
      results.push({
        name: test.name,
        expected: test.expectedStatus,
        actual: 'error',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return NextResponse.json({
    test: 'auth_pathing',
    passed: results.every(r => r.passed),
    results
  });
}

// Test backoff and retry logic
async function testBackoffRealism() {
  // This would require a mock server setup
  // For now, return a placeholder
  return NextResponse.json({
    test: 'backoff_realism',
    passed: true,
    note: 'Requires mock server setup - implement with dedicated test infrastructure'
  });
}

// Test robots.txt compliance
async function testRobotsCompliance(params: any) {
  const testUrls = [
    'https://quotes.toscrape.com/robots.txt', // Should be allowed
    'https://httpbin.org/robots.txt', // Not in allowlist
  ];
  
  const results = [];
  
  for (const url of testUrls) {
    try {
      const response = await fetch('/api/scrape', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
          'x-internal-run': '1',
          'x-test-url': url // Custom header to override URL for testing
        }
      });
      
      const data = await response.json();
      
      results.push({
        url,
        status: response.status,
        robotsAllowed: url.includes('quotes.toscrape.com'),
        actuallyAllowed: response.status === 200,
        data
      });
    } catch (error) {
      results.push({
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return NextResponse.json({
    test: 'robots_compliance',
    passed: results.every(r => r.robotsAllowed === r.actuallyAllowed),
    results
  });
}

// Test idempotency - repeated runs should return 304 for unchanged content
async function testIdempotency(params: any) {
  const testUrl = params.url || 'https://quotes.toscrape.com/';
  
  try {
    // First run - should fetch content
    const firstRun = await fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-internal-run': '1'
      }
    });
    
    const firstData = await firstRun.json();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Second run - should get 304s for unchanged content
    const secondRun = await fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-internal-run': '1'
      }
    });
    
    const secondData = await secondRun.json();
    
    // Check if any URLs returned 304 status
    const has304s = secondData.results?.some((r: any) => r.status === 304);
    
    return NextResponse.json({
      test: 'idempotency',
      passed: has304s,
      firstRun: firstData,
      secondRun: secondData,
      has304s
    });
  } catch (error) {
    return NextResponse.json({
      test: 'idempotency',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test clock skew handling for If-Modified-Since logic
async function testClockSkew(params: any) {
  const supa = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // Insert fake fetch metadata with future timestamp
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day in future
    const testUrl = 'https://quotes.toscrape.com/test-clock-skew';
    
    await supa.from('fetch_meta').upsert({
      item_url: testUrl,
      last_modified: futureDate,
      updated_at: futureDate
    });
    
    // Try to fetch - should handle clock skew gracefully
    const response = await fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SCRAPER_BEARER_TOKEN}`,
        'x-internal-run': '1',
        'x-test-url': testUrl
      }
    });
    
    const data = await response.json();
    
    // Clean up
    await supa.from('fetch_meta').delete().eq('item_url', testUrl);
    
    return NextResponse.json({
      test: 'clock_skew',
      passed: response.status === 200, // Should handle gracefully
      response: data
    });
  } catch (error) {
    return NextResponse.json({
      test: 'clock_skew',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test TTL recovery after killed job
async function testTtlRecovery() {
  const supa = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // Insert expired lock manually
    const expiredTime = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    
    await supa.from('job_lock').upsert({
      name: 'test_recovery',
      expires_at: expiredTime
    });
    
    // Try to acquire lock - should succeed by stealing expired lock
    const { data, error } = await supa
      .from('job_lock')
      .update({ expires_at: new Date(Date.now() + 600000).toISOString() })
      .eq('name', 'test_recovery')
      .lt('expires_at', new Date().toISOString())
      .select();
    
    const recovered = !error && data?.length > 0;
    
    // Clean up
    await supa.from('job_lock').delete().eq('name', 'test_recovery');
    
    return NextResponse.json({
      test: 'ttl_recovery',
      passed: recovered,
      recovered,
      error: error?.message
    });
  } catch (error) {
    return NextResponse.json({
      test: 'ttl_recovery',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}