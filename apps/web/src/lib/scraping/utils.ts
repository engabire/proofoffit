// Enhanced data quality and normalization utilities

import crypto from 'node:crypto';

// Unicode and whitespace normalization for content hashing
export function normalizeText(text: string): string {
  return text
    .normalize('NFC')                    // Unicode normalization
    .replace(/[\u200B-\u200F\uFEFF]/g, '') // Remove zero-width characters
    .replace(/\s+/g, ' ')                // Collapse whitespace
    .trim();
}

// Enhanced content hashing with normalization
export function createContentHash(title: string, author?: string, content?: string): string {
  const normalizedTitle = normalizeText(title);
  const normalizedAuthor = author ? normalizeText(author) : '';
  const normalizedContent = content ? normalizeText(content) : '';
  
  const combined = [normalizedTitle, normalizedAuthor, normalizedContent]
    .filter(Boolean)
    .join('|');
    
  return crypto.createHash('sha256').update(combined, 'utf8').digest('hex');
}

// Robots.txt caching to avoid repeated requests
const robotsCache = new Map<string, { robots: any; expires: number }>();

export function getCachedRobots(origin: string): any | null {
  const cached = robotsCache.get(origin);
  if (cached && Date.now() < cached.expires) {
    return cached.robots;
  }
  return null;
}

export function setCachedRobots(origin: string, robots: any, ttlMs = 3600000): void {
  robotsCache.set(origin, {
    robots,
    expires: Date.now() + ttlMs
  });
}

// Selector hit-rate tracking for drift detection
interface SelectorMetrics {
  selector: string;
  matched: number;
  htmlLength: number;
  url: string;
  timestamp: number;
}

const selectorMetrics: SelectorMetrics[] = [];

export function trackSelectorHitRate(
  selector: string,
  matched: number,
  htmlLength: number,
  url: string
): void {
  selectorMetrics.push({
    selector,
    matched,
    htmlLength,
    url,
    timestamp: Date.now()
  });
  
  // Keep only last 1000 entries to prevent memory bloat
  if (selectorMetrics.length > 1000) {
    selectorMetrics.splice(0, selectorMetrics.length - 1000);
  }
}

export function getSelectorHitRate(selector: string, daysBack = 7): {
  current: number;
  median: number;
  alertThreshold: number;
} {
  const cutoff = Date.now() - (daysBack * 24 * 60 * 60 * 1000);
  const recent = selectorMetrics.filter(m => 
    m.selector === selector && m.timestamp > cutoff
  );
  
  if (recent.length === 0) {
    return { current: 0, median: 0, alertThreshold: 0 };
  }
  
  const hitRates = recent.map(m => m.matched / Math.max(m.htmlLength / 1000, 1));
  const sorted = hitRates.sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 0;
  const current = hitRates[hitRates.length - 1] || 0;
  
  return {
    current,
    median,
    alertThreshold: median * 0.5 // Alert if current < 50% of median
  };
}

// Job ID generation for tracing
export function generateJobId(): string {
  // Simple ULID-like ID generation
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `job_${timestamp}_${randomPart}`;
}

// HTML sanitization for UI display
export function sanitizeHtmlText(text: string): string {
  return text
    .replace(/[<>&"']/g, char => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char] || char;
    })
    .substring(0, 500); // Limit length for display
}

// Enhanced error categorization for retry logic
export function shouldRetryError(error: Error): boolean {
  const message = error.message.toLowerCase();
  
  // Retry on these conditions
  const retryableConditions = [
    'timeout', 'etimedout', 'econnreset', 'enotfound',
    'socket hang up', 'network error',
    'http 429', 'http 503', 'http 502', 'http 504'
  ];
  
  // Don't retry on these conditions
  const nonRetryableConditions = [
    'http 400', 'http 401', 'http 403', 'http 404',
    'invalid url', 'robots disallowed'
  ];
  
  if (nonRetryableConditions.some(condition => message.includes(condition))) {
    return false;
  }
  
  return retryableConditions.some(condition => message.includes(condition));
}

// Compression support headers
export function getCompressionHeaders(): Record<string, string> {
  return {
    'Accept-Encoding': 'gzip, br, deflate',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
}

// RSS/Atom feed detection
export function extractFeedUrls(html: string, baseUrl: string): string[] {
  const feeds: string[] = [];
  
  // Look for feed link tags
  const feedRegex = /<link[^>]+(?:type=["']application\/(?:rss|atom)\+xml["'][^>]*href=["']([^"']+)["']|href=["']([^"']+)["'][^>]*type=["']application\/(?:rss|atom)\+xml["'])[^>]*>/gi;
  
  let match;
  while ((match = feedRegex.exec(html)) !== null) {
    const href = match[1] || match[2];
    if (href) {
      try {
        const feedUrl = new URL(href, baseUrl).toString();
        feeds.push(feedUrl);
      } catch {}
    }
  }
  
  return feeds;
}

// Sitemap detection
export function extractSitemapUrls(html: string, baseUrl: string): string[] {
  const sitemaps: string[] = [];
  
  // Common sitemap locations
  const commonPaths = ['/sitemap.xml', '/sitemap_index.xml', '/sitemaps.xml'];
  
  for (const path of commonPaths) {
    try {
      const sitemapUrl = new URL(path, baseUrl).toString();
      sitemaps.push(sitemapUrl);
    } catch {}
  }
  
  // Look for sitemap references in HTML
  const sitemapRegex = /sitemap[^"'\s>]*\.xml/gi;
  let match;
  while ((match = sitemapRegex.exec(html)) !== null) {
    try {
      const sitemapUrl = new URL(match[0], baseUrl).toString();
      if (!sitemaps.includes(sitemapUrl)) {
        sitemaps.push(sitemapUrl);
      }
    } catch {}
  }
  
  return sitemaps;
}

// Canonical URL extraction from HTML
export function extractCanonicalUrl(html: string, pageUrl: string): string {
  // Look for <link rel="canonical">
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
                         html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  
  if (canonicalMatch && canonicalMatch[1]) {
    try {
      return new URL(canonicalMatch[1], pageUrl).toString();
    } catch {}
  }
  
  return pageUrl;
}

// Page metadata extraction
export interface PageMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  feeds: string[];
  sitemaps: string[];
  nextPage?: string;
}

export function extractPageMetadata(html: string, baseUrl: string): PageMetadata {
  const metadata: PageMetadata = {
    feeds: extractFeedUrls(html, baseUrl),
    sitemaps: extractSitemapUrls(html, baseUrl)
  };
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = normalizeText(titleMatch[1]);
  }
  
  // Extract description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                   html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
  if (descMatch) {
    metadata.description = normalizeText(descMatch[1]);
  }
  
  // Extract canonical URL
  metadata.canonical = extractCanonicalUrl(html, baseUrl);
  
  // Look for next page link
  const nextMatch = html.match(/<link[^>]+rel=["']next["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
                   html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']next["'][^>]*>/i);
  if (nextMatch && nextMatch[1]) {
    try {
      metadata.nextPage = new URL(nextMatch[1], baseUrl).toString();
    } catch {}
  }
  
  return metadata;
}