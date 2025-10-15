// Smart triggering of AI analysis when new content is scraped

import { ContentAnalyzer } from './content-analyzer';

interface SmartAnalysisTrigger {
  shouldAnalyze(item: any): boolean;
  triggerAnalysis(items: any[]): Promise<void>;
}

class IntelligentAnalysisTrigger implements SmartAnalysisTrigger {
  private analyzer: ContentAnalyzer;
  private analysisQueue: any[] = [];
  private processingQueue = false;
  
  constructor() {
    this.analyzer = new ContentAnalyzer();
  }

  // Determine if an item should be analyzed immediately
  shouldAnalyze(item: any): boolean {
    // High-priority items for immediate analysis
    const priorityDomains = [
      'linkedin.com', 
      'indeed.com', 
      'glassdoor.com',
      'stackoverflow.com'
    ];
    
    const recentThreshold = 60 * 60 * 1000; // 1 hour
    const isRecent = Date.now() - new Date(item.last_seen_at).getTime() < recentThreshold;
    const isPriorityDomain = priorityDomains.some(domain => item.source_domain.includes(domain));
    const hasRichContent = Object.keys(item.metadata || {}).length > 3;
    
    return isRecent && (isPriorityDomain || hasRichContent);
  }

  // Add items to analysis queue and process intelligently
  async triggerAnalysis(items: any[]): Promise<void> {
    // Filter items that need analysis
    const newItems = items.filter(item => this.shouldAnalyze(item));
    
    if (newItems.length === 0) {
      return;
    }

    // Add to queue
    this.analysisQueue.push(...newItems);
    
    // Process queue if not already processing
    if (!this.processingQueue) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.analysisQueue.length === 0) {
      return;
    }

    this.processingQueue = true;
    
    try {
      // eslint-disable-next-line no-console
      console.log(`🧠 Processing ${this.analysisQueue.length} items for AI analysis`);
      
      // Process in batches to respect API limits
      const batchSize = 3;
      
      while (this.analysisQueue.length > 0) {
        const batch = this.analysisQueue.splice(0, batchSize);
        
        await Promise.all(
          batch.map(async (item) => {
            try {
              await this.analyzer.analyzeContent(item);
              console.log(`✅ Smart-analyzed: ${item.title.substring(0, 50)}...`);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(`❌ Smart analysis failed for ${item.id}:`, error);
            }
          })
        );
        
        // Rate limiting between batches
        if (this.analysisQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // After processing, detect trends
      try {
        const trends = await this.analyzer.detectTrends();
        // eslint-disable-next-line no-console
        console.log(`🔍 Smart trend detection found ${trends.length} trends`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Smart trend detection failed:', error);
      }
      
    } finally {
      this.processingQueue = false;
    }
  }
}

// Singleton instance for global use
export const smartAnalysisTrigger = new IntelligentAnalysisTrigger();

// Helper function to integrate with scraping pipeline
export async function analyzeNewContent(scrapedItems: any[]): Promise<void> {
  if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
    // eslint-disable-next-line no-console
    console.log('⚠️ AI analysis skipped: API keys not configured');
    return;
  }

  try {
    await smartAnalysisTrigger.triggerAnalysis(scrapedItems);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Smart content analysis failed:', error);
  }
}