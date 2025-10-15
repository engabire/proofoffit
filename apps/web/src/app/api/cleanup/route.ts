import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Security check for cleanup operations
function assertAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const cronHdr = req.headers.get('x-vercel-cron');
  
  if (!process.env.SCRAPER_BEARER_TOKEN || token !== process.env.SCRAPER_BEARER_TOKEN) {
    throw new Error('401');
  }
  
  // Only allow cron jobs or internal calls in production
  if (process.env.NODE_ENV === 'production' && !cronHdr && !req.headers.get('x-internal-run')) {
    throw new Error('403');
  }
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    assertAuthorized(req);
    
    const supa = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    console.log('🧹 Starting cleanup job', { timestamp: new Date().toISOString() });
    
    const results: any[] = [];
    
    // 1. Clean up old raw HTML data (30+ days old)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: deletedRaw, error: rawError } = await supa
      .from('scrape_raw')
      .delete()
      .lt('scraped_at', thirtyDaysAgo)
      .select('id');
    
    if (rawError) {
      // eslint-disable-next-line no-console
      console.error('Error cleaning raw data:', rawError);
    } else {
      results.push({
        operation: 'clean_raw_html',
        deleted_count: deletedRaw?.length || 0
      });
    }
    
    // 2. Clean up expired job locks
    const { data: deletedLocks, error: lockError } = await supa
      .from('job_lock')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('name');
    
    if (lockError) {
      // eslint-disable-next-line no-console
      console.error('Error cleaning expired locks:', lockError);
    } else {
      results.push({
        operation: 'clean_expired_locks',
        deleted_count: deletedLocks?.length || 0
      });
    }
    
    // 3. Clean up old fetch metadata (90+ days old)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: deletedMeta, error: metaError } = await supa
      .from('fetch_meta')
      .delete()
      .lt('updated_at', ninetyDaysAgo)
      .select('item_url');
    
    if (metaError) {
      // eslint-disable-next-line no-console
      console.error('Error cleaning fetch metadata:', metaError);
    } else {
      results.push({
        operation: 'clean_fetch_metadata',
        deleted_count: deletedMeta?.length || 0
      });
    }
    
    // 4. Clean up items not seen in 60+ days (optional - be careful!)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: deletedItems, error: itemsError } = await supa
      .from('scraped_items')
      .delete()
      .lt('last_seen_at', sixtyDaysAgo)
      .select('id');
    
    if (itemsError) {
      // eslint-disable-next-line no-console
      console.error('Error cleaning old items:', itemsError);
    } else {
      results.push({
        operation: 'clean_old_items',
        deleted_count: deletedItems?.length || 0
      });
    }
    
    const duration = Date.now() - startTime;
    const totalDeleted = results.reduce((sum, r) => sum + r.deleted_count, 0);
    
    console.log('✅ Cleanup job completed', {
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      total_deleted: totalDeleted,
      operations: results.length
    });
    
    return NextResponse.json({
      ok: true,
      results,
      summary: {
        total_deleted: totalDeleted,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Cleanup job failed', {
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
  }
}