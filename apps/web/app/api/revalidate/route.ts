import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Security check for revalidation
function assertAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const internalCall = req.headers.get('x-internal-run');
  
  // Allow internal calls or Bearer token
  if (internalCall === 'true') return;
  
  if (!process.env.SCRAPER_BEARER_TOKEN || token !== process.env.SCRAPER_BEARER_TOKEN) {
    throw new Error('401');
  }
}

export async function POST(req: NextRequest) {
  try {
    assertAuthorized(req);
    
    const { tags } = await req.json();
    
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags array is required' },
        { status: 400 }
      );
    }
    
    // Revalidate specified cache tags
    const revalidated: string[] = [];
    
    for (const tag of tags) {
      if (typeof tag === 'string' && tag.length > 0) {
        revalidateTag(tag);
        revalidated.push(tag);
      }
    }
    
    // eslint-disable-next-line no-console
    console.log('🔄 Cache revalidated', {
      tags: revalidated,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      ok: true,
      revalidated,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Cache revalidation failed', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    const msg = error?.message === '401' ? 'unauthorized' : 
               (error?.message || 'Internal server error');
    const code = msg === 'unauthorized' ? 401 : 500;
    
    return NextResponse.json({
      error: msg,
      timestamp: new Date().toISOString()
    }, { status: code });
  }
}