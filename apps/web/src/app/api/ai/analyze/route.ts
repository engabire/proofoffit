import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContentAnalyzer } from '@/lib/ai/content-analyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Authentication and authorization
function assertAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const cronHdr = req.headers.get('x-vercel-cron');
  const internalRun = req.headers.get('x-internal-run');
  
  if (!process.env.AI_ANALYZER_TOKEN || token !== process.env.AI_ANALYZER_TOKEN) {
    throw new Error('401');
  }
  
  // In production, only allow cron or internal runs
  if (process.env.NODE_ENV === 'production' && !cronHdr && !internalRun) {
    throw new Error('403');
  }
}

// Kill switch for operational incidents
function checkKillSwitch() {
  if (process.env.AI_ANALYZER_DISABLED === '1') {
    throw new Error('AI analysis temporarily disabled');
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Security checks
    assertAuthorized(req);
    checkKillSwitch();
    
    const { mode = 'batch', limit = 10, item_ids = [] } = await req.json();
    
    // Initialize services
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const analyzer = new ContentAnalyzer();
    
    // eslint-disable-next-line no-console
    console.log('🧠 Starting AI content analysis', { 
      mode, 
      limit, 
      item_ids: item_ids.length,
      timestamp: new Date().toISOString() 
    });
    
    let items: any[] = [];
    let processedCount = 0;
    let errors: any[] = [];
    
    if (mode === 'batch') {
      // Process unanalyzed items in batch
      const { data: unanalyzedItems, error } = await supabase
        .from('scraped_items')
        .select('*')
        .not('id', 'in', `(
          SELECT scraped_item_id 
          FROM content_analysis 
          WHERE scraped_item_id IS NOT NULL
        )`)
        .order('last_seen_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(`Failed to fetch items: ${error.message}`);
      }
      
      items = unanalyzedItems || [];
      
    } else if (mode === 'specific' && item_ids.length > 0) {
      // Process specific items
      const { data: specificItems, error } = await supabase
        .from('scraped_items')
        .select('*')
        .in('id', item_ids);
      
      if (error) {
        throw new Error(`Failed to fetch specific items: ${error.message}`);
      }
      
      items = specificItems || [];
      
    } else if (mode === 'reanalyze') {
      // Re-analyze items with outdated analysis
      const { data: outdatedItems, error } = await supabase
        .from('scraped_items')
        .select(`
          *,
          content_analysis!inner(analyzed_at)
        `)
        .lt('content_analysis.analyzed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('last_seen_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(`Failed to fetch outdated items: ${error.message}`);
      }
      
      items = outdatedItems || [];
    }
    
    if (items.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No items to process',
        processed: 0,
        errors: [],
        duration_ms: Date.now() - startTime
      });
    }
    
    // eslint-disable-next-line no-console
    console.log(`Processing ${items.length} items for AI analysis`);
    
    // Process items in batches to respect API limits
    const batchSize = 3;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (item) => {
        try {
          const analysis = await analyzer.analyzeContent(item);
          processedCount++;
          
          // eslint-disable-next-line no-console
          console.log(`✅ Analyzed: ${item.title.substring(0, 50)}... (${analysis.sentiment}, priority: ${analysis.priority_score})`);
          
          return {
            item_id: item.id,
            status: 'success',
            analysis: {
              sentiment: analysis.sentiment,
              category: analysis.primary_category,
              topics: analysis.topics.length,
              relevance: analysis.relevance_score,
              priority: analysis.priority_score
            }
          };
        } catch (error: any) {
          const errorInfo = {
            item_id: item.id,
            status: 'error',
            error: error.message,
            title: item.title.substring(0, 100)
          };
          errors.push(errorInfo);
          
          // eslint-disable-next-line no-console
          
          console.error(`❌ Analysis failed for ${item.id}:`, error.message);
          return errorInfo;
        }
      });
      
      await Promise.all(batchPromises);
      
      // Rate limiting between batches
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Detect trends after processing
    let trends: any[] = [];
    try {
      trends = await analyzer.detectTrends();
      // eslint-disable-next-line no-console
      console.log(`🔍 Detected ${trends.length} trends`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Trend detection failed:', error);
    }
    
    const duration = Date.now() - startTime;
    const successRate = items.length > 0 ? (processedCount / items.length) * 100 : 0;
    
    // eslint-disable-next-line no-console
    console.log('✅ AI analysis completed', {
      total_items: items.length,
      processed: processedCount,
      errors: errors.length,
      trends_detected: trends.length,
      success_rate: successRate.toFixed(1) + '%',
      duration_ms: duration
    });
    
    return NextResponse.json({
      ok: true,
      results: {
        total_items: items.length,
        processed: processedCount,
        errors: errors.length,
        success_rate: Math.round(successRate * 100) / 100,
        trends_detected: trends.length,
        duration_ms: duration
      },
      trends: trends.slice(0, 10), // Return top 10 trends
      errors: errors.slice(0, 5), // Return first 5 errors for debugging
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('❌ AI analysis job failed', {
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
      timestamp: new Date().toISOString(),
      duration_ms: duration
    }, { status: code });
  }
}

// Get analysis results and trends
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'summary';
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    
    if (type === 'trends') {
      // Get trending topics
      let query = supabase
        .from('content_trends')
        .select('*')
        .order('trend_strength', { ascending: false })
        .limit(limit);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data: trends, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch trends: ${error.message}`);
      }
      
      return NextResponse.json({
        trends: trends || [],
        total: trends?.length || 0
      });
      
    } else if (type === 'analysis') {
      // Get analysis results with item details
      let query = supabase
        .from('content_analysis')
        .select(`
          *,
          scraped_items!inner(
            id,
            title,
            author,
            source_domain,
            canonical_item_url,
            last_seen_at
          )
        `)
        .order('analyzed_at', { ascending: false })
        .limit(limit);
      
      if (category) {
        query = query.eq('primary_category', category);
      }
      
      const { data: analyses, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch analyses: ${error.message}`);
      }
      
      return NextResponse.json({
        analyses: analyses || [],
        total: analyses?.length || 0
      });
      
    } else {
      // Summary statistics
      const [trendsResult, analysisResult, categoriesResult] = await Promise.all([
        supabase.from('content_trends').select('trend_type', { count: 'exact' }),
        supabase.from('content_analysis').select('sentiment, primary_category', { count: 'exact' }),
        supabase.from('content_analysis').select('primary_category').not('primary_category', 'is', null)
      ]);
      
      // Aggregate statistics
      const trendStats = trendsResult.data?.reduce((acc: any, trend) => {
        acc[trend.trend_type] = (acc[trend.trend_type] || 0) + 1;
        return acc;
      }, {}) || {};
      
      const sentimentStats = analysisResult.data?.reduce((acc: any, analysis) => {
        acc[analysis.sentiment] = (acc[analysis.sentiment] || 0) + 1;
        return acc;
      }, {}) || {};
      
      const categoryStats = categoriesResult.data?.reduce((acc: any, analysis) => {
        acc[analysis.primary_category] = (acc[analysis.primary_category] || 0) + 1;
        return acc;
      }, {}) || {};
      
      return NextResponse.json({
        summary: {
          total_analyses: analysisResult.count || 0,
          total_trends: trendsResult.count || 0,
          sentiment_distribution: sentimentStats,
          trend_distribution: trendStats,
          category_distribution: categoryStats
        }
      });
    }
    
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('AI analysis GET failed:', error);
    
    return NextResponse.json({
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}