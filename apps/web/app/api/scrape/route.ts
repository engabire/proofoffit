import { NextRequest, NextResponse } from 'next/server';
// import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import pLimit from 'p-limit';
import robotsParser from 'robots-parser';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Security & Configuration
const ALLOWED_DOMAINS = new Set([
  'quotes.toscrape.com',
  'books.toscrape.com',
  // Add more allowlisted domains here
]);

const UA = 'proofoffit-bot/1.0 (+contact: support@proofoffit.com)';
const LIMIT_CONCURRENCY = 3;
const PER_DOMAIN_DELAY_MS = 1500;
const JITTER_MS = 500;
const LOCK_TTL_MINUTES = 10;

// Security: Authentication & Authorization
function assertAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const cronHdr = req.headers.get('x-vercel-cron'); // present on Vercel Cron invocations
  const internalRun = req.headers.get('x-internal-run');
  
  if (!process.env.SCRAPER_BEARER_TOKEN || token !== process.env.SCRAPER_BEARER_TOKEN) {
    throw new Error('401');
  }
  
  // In production, only allow cron or internal runs
  if (process.env.NODE_ENV === 'production' && !cronHdr && !internalRun) {
    throw new Error('403');
  }
}

// Kill switch for operational incidents
function checkKillSwitch() {
  if (process.env.SCRAPER_DISABLED === '1') {
    throw new Error('Service temporarily disabled');
  }
}

// Job Locking for Idempotency
async function acquireLock(supa: any, name = 'scrape', ttlMin = LOCK_TTL_MINUTES) {
  const expires = new Date(Date.now() + ttlMin * 60 * 1000).toISOString();
  
  try {
    const { error } = await supa
      .from('job_lock')
      .insert({ name, expires_at: expires });
    
    if (!error) return true;
    
    // If duplicate key error, try to steal expired lock
    if (error && error.message?.includes('duplicate')) {
      const { data, error: updateError } = await supa
        .from('job_lock')
        .update({ expires_at: expires })
        .eq('name', name)
        .lt('expires_at', new Date().toISOString())
        .select();
      
      return !updateError && data?.length > 0;
    }
    
    return false;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Lock acquisition failed:', error);
    }
    return false;
  }
}

async function releaseLock(supa: any, name = 'scrape') {
  try {
    await supa.from('job_lock').delete().eq('name', name);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Lock release failed:', error);
    }
  }
}

// Robots.txt Compliance
async function isAllowed(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    
    // Check domain allowlist first
    if (!ALLOWED_DOMAINS.has(u.hostname)) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`Domain not allowlisted: ${u.hostname}`);
      }
      return false;
    }
    
    // Fetch and parse robots.txt
    const robotsURL = `${u.origin}/robots.txt`;
    const response = await fetch(robotsURL, { 
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(5000)
    });
    
    const txt = response.ok ? await response.text() : '';
    const robots = robotsParser(robotsURL, txt || '');
    
    return robots.isAllowed(url, UA) !== false;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Robots.txt check failed for ${url}:`, error);
    }
    return false; // Fail closed
  }
}

// Conditional GET with ETag/Last-Modified
async function conditionalGet(url: string, meta?: { etag?: string; lastmod?: string }) {
  const headers: Record<string, string> = {
    'User-Agent': UA,
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache'
  };
  
  if (meta?.etag) headers['If-None-Match'] = meta.etag;
  if (meta?.lastmod) headers['If-Modified-Since'] = meta.lastmod;
  
  const response = await fetch(url, {
    headers,
    redirect: 'follow',
    signal: AbortSignal.timeout(30000) // 30s timeout
  });
  
  if (response.status === 304) {
    return { notModified: true };
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const html = await response.text();
  
  return {
    html,
    etag: response.headers.get('etag') || undefined,
    lastmod: response.headers.get('last-modified') || undefined,
    hash: crypto.createHash('sha256').update(html).digest('hex'),
    size: html.length
  };
}

// Enhanced URL Canonicalization with Unicode normalization
function canonicalize(raw: string): string {
  try {
    // Decode URL and normalize Unicode to NFC
    const decoded = decodeURIComponent(raw);
    const normalized = decoded.normalize('NFC');
    
    const u = new URL(normalized);
    
    // Remove hash
    u.hash = '';
    
    // Remove tracking parameters (expanded list)
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'fbclid', 'gclid', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi',
      'source', 'campaign', 'medium', 'content', 'term'
    ];
    trackingParams.forEach(param => u.searchParams.delete(param));
    
    // Normalize hostname to punycode and lowercase
    u.hostname = u.hostname.toLowerCase();
    if (u.hostname.includes('xn--')) {
      // Already punycode encoded
    } else {
      // Convert international domain names to punycode
      try {
        u.hostname = new URL(`http://${u.hostname}`).hostname;
      } catch {}
    }
    
    // Normalize pathname - remove trailing slash and decode
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    
    // Ensure proper encoding
    u.pathname = encodeURI(decodeURI(u.pathname));
    
    return u.toString();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('URL canonicalization failed:', error);
    }
    return raw;
  }
}

// Rate Limiting with Jitter
async function rateLimit() {
  const delay = PER_DOMAIN_DELAY_MS + Math.random() * JITTER_MS;
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Retry Logic with Exponential Backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on auth errors or client errors
      if (error.message?.includes('401') || error.message?.includes('403') || 
          (error.message?.includes('HTTP') && error.message?.includes('4'))) {
        throw error;
      }
      
      // Retry on 429, 503, network errors
      const shouldRetry = error.message?.includes('429') || 
                         error.message?.includes('503') ||
                         error.message?.includes('ECONNRESET') ||
                         error.message?.includes('ETIMEDOUT');
      
      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms for: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Main Scraping Logic
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let supa: any;
  
  try {
    // Security checks
    assertAuthorized(req);
    checkKillSwitch();
    
    // Initialize Supabase with service role
    supa = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Acquire job lock
    if (!(await acquireLock(supa))) {
      return NextResponse.json({ 
        skipped: 'Another scraping job is already running',
        timestamp: new Date().toISOString()
      }, { status: 423 });
    }
    
    // eslint-disable-next-line no-console
    console.log('🤖 Starting scraping job', { timestamp: new Date().toISOString() });
    
    // Seed URLs - in production, move to config table
    const seeds = [
      'https://quotes.toscrape.com/',
      'https://quotes.toscrape.com/page/2/'
    ];
    
    const limit = pLimit(LIMIT_CONCURRENCY);
    const results: any[] = [];
    let totalItems = 0;
    let totalBytes = 0;
    
    // Process each seed URL
    const promises = seeds.map(url => limit(async () => {
      try {
        // Check robots.txt
        if (!(await isAllowed(url))) {
          return { url, status: 'robots_disallowed' };
        }
        
        // Get fetch metadata for conditional requests
        const { data: fetchMeta } = await supa
          .from('fetch_meta')
          .select('*')
          .eq('item_url', url)
          .single();
        
        // Conditional GET with retry logic
        const fetchResult = await withRetry(() => 
          conditionalGet(url, fetchMeta || undefined)
        );
        
        if (fetchResult.notModified) {
          await supa
            .from('fetch_meta')
            .update({ updated_at: new Date().toISOString() })
            .eq('item_url', url);
          
          return { url, status: 304, cached: true };
        }
        
        // Parse HTML - temporarily disabled due to cheerio compatibility issues
        // const $ = cheerio.load(fetchResult.html || '');
        const domain = new URL(url).hostname.toLowerCase();
        
        // Extract items (example: quotes) - temporarily disabled
        const items: any[] = []; // $('.quote').map((_, element) => {
          // const quote = $(element);
          // const text = quote.find('.text').text().trim();
          // const author = quote.find('.author').text().trim();
          // const tags = quote.find('.tag').map((_, tag) => $(tag).text()).get();
          
          // if (!text || !author) return null;
          
          // const itemUrl = `${url}#quote-${crypto.createHash('md5').update(text).digest('hex').slice(0, 8)}`;
          // const canonicalUrl = canonicalize(itemUrl);
          // const contentHash = crypto.createHash('sha256').update(text + author + tags.join(',')).digest('hex');
          
          // return {
          //   source_domain: domain,
          //   item_url: itemUrl,
          //   canonical_item_url: canonicalUrl,
          //   title: text.slice(0, 200), // Truncate long quotes
          //   author,
          //   metadata: {
          //     tags,
          //     source_page: url
          //   },
          //   content_hash: contentHash,
          //   last_seen_at: new Date().toISOString()
          // };
        // }).get().filter(Boolean);
        
        if (items.length > 0) {
          // Upsert items with conflict resolution
          const { error: upsertError } = await supa
            .from('scraped_items')
            .upsert(items, {
              onConflict: 'source_domain,canonical_item_url',
              ignoreDuplicates: false
            });
          
          if (upsertError) {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.error('Upsert error:', upsertError);
            }
          }
          
          totalItems += items.length;
        }
        
        // Update fetch metadata
        await supa.from('fetch_meta').upsert({
          item_url: url,
          etag: fetchResult.etag,
          last_modified: fetchResult.lastmod,
          updated_at: new Date().toISOString()
        });
        
        totalBytes += fetchResult.size || 0;
        
        // Rate limiting
        await rateLimit();
        
        return {
          url,
          status: 200,
          items: items.length,
          bytes: fetchResult.size,
          hash: fetchResult.hash
        };
        
      } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error(`Error processing ${url}:`, error);
        }
        return {
          url,
          status: 'error',
          error: error.message
        };
      }
    }));
    
    // Wait for all processing to complete
    const urlResults = await Promise.all(promises);
    results.push(...urlResults);
    
    const duration = Date.now() - startTime;
    
    // Structured logging
    // eslint-disable-next-line no-console
    console.log('✅ Scraping job completed', {
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      urls_processed: results.length,
      total_items: totalItems,
      total_bytes: totalBytes,
      success_rate: results.filter(r => r.status === 200).length / results.length
    });
    
    return NextResponse.json({
      ok: true,
      results,
      summary: {
        urls_processed: results.length,
        total_items: totalItems,
        total_bytes: totalBytes,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Scraping job failed', {
      error: error.message,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
    
    const msg = error?.message === '401' ? 'unauthorized' : 
               error?.message === '403' ? 'forbidden' : 
               (error?.message || 'Internal server error');
    const code = msg === 'unauthorized' ? 401 : 
                msg === 'forbidden' ? 403 : 500;
    
    return NextResponse.json({
      error: msg,
      timestamp: new Date().toISOString()
    }, { status: code });
    
  } finally {
    // Always release the lock
    if (supa) {
      await releaseLock(supa);
    }
  }
}