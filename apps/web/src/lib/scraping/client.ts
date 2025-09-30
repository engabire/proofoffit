// Client-side utilities for the scraping system
import { createClient } from '@supabase/supabase-js';

export interface ScrapedItem {
  id: string;
  source_domain: string;
  canonical_item_url: string;
  title: string;
  author?: string;
  metadata: Record<string, any>;
  first_seen_at: string;
  last_seen_at: string;
  changed_at?: string;
  created_at: string;
}

export interface ScrapingStats {
  source_domain: string;
  total_items: number;
  unique_items: number;
  first_seen: string;
  last_seen: string;
  items_with_changes: number;
  date: string;
}

export class ScrapingClient {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  // Get latest scraped items with pagination
  async getLatestItems(options: {
    domain?: string;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}) {
    const { domain, limit = 20, offset = 0, search } = options;
    
    let query = this.supabase
      .from('latest_scraped_items')
      .select('*')
      .order('last_seen_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (domain) {
      query = query.eq('source_domain', domain);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }
    
    return {
      items: data as ScrapedItem[],
      total: count,
      hasMore: (data?.length || 0) === limit
    };
  }
  
  // Get scraping statistics
  async getStats(domain?: string) {
    let query = this.supabase
      .from('scraping_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(30); // Last 30 days
    
    if (domain) {
      query = query.eq('source_domain', domain);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
    
    return data as ScrapingStats[];
  }
  
  // Get available domains
  async getDomains() {
    // Fetch domains then de-duplicate client-side (distinct not available in typed options)
    const { data, error } = await this.supabase
      .from('scraped_items')
      .select('source_domain')
      .order('source_domain', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch domains: ${error.message}`);
    }
    
    const domains = (data || []).map((item: any) => item.source_domain).filter(Boolean);
    return Array.from(new Set(domains));
  }
  
  // Search items across all domains
  async searchItems(query: string, limit = 20) {
    const { data, error } = await this.supabase
      .from('scraped_items')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
      .order('last_seen_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
    
    return data as ScrapedItem[];
  }
  
  // Get item by canonical URL
  async getItem(canonicalUrl: string) {
    const { data, error } = await this.supabase
      .from('scraped_items')
      .select('*')
      .eq('canonical_item_url', canonicalUrl)
      .single();
    
    if (error) {
      throw new Error(`Failed to fetch item: ${error.message}`);
    }
    
    return data as ScrapedItem;
  }
  
  // Get job execution history
  async getJobHistory(limit = 10) {
    const { data, error } = await this.supabase
      .from('scrape_jobs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch job history: ${error.message}`);
    }
    
    return data || [];
  }

  // Get SLO metrics
  async getSloMetrics(days = 7) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await this.supabase
      .from('slo_metrics')
      .select('*')
      .gte('measured_at', cutoff)
      .order('measured_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch SLO metrics: ${error.message}`);
    }
    
    return data || [];
  }

  // Trigger manual scraping (requires proper auth in production)
  async triggerScraping() {
    const response = await fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'x-internal-run': '1'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to trigger scraping');
    }
    
    return response.json();
  }

  // Run system tests
  async runTest(testId: string, params = {}) {
    const response = await fetch('/api/scrape/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: testId, params })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Test execution failed');
    }
    
    return response.json();
  }

  // Subscribe to real-time updates
  subscribeToUpdates(
    callback: (payload: any) => void,
    domain?: string
  ) {
    let subscription = this.supabase
      .channel('scraped_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scraped_items',
          filter: domain ? `source_domain=eq.${domain}` : undefined
        },
        callback
      );
    
    subscription.subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }
}

// Singleton instance
export const scrapingClient = new ScrapingClient();

// Utility functions
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

export function getDomainIcon(domain: string): string {
  // Return appropriate icon based on domain
  const iconMap: Record<string, string> = {
    'quotes.toscrape.com': '💬',
    'books.toscrape.com': '📚',
    'news.ycombinator.com': '🔶',
    'reddit.com': '🔴',
  };
  
  return iconMap[domain] || '🌐';
}