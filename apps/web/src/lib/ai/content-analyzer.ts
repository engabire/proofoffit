// AI-powered content analysis and intelligence system

import { createClient } from "@supabase/supabase-js";

interface ScrapedItem {
  id: string;
  title: string;
  author?: string;
  metadata: Record<string, any>;
  canonical_item_url: string;
  source_domain: string;
}

interface ContentAnalysis {
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  confidence_score: number;
  primary_category: string;
  topics: string[];
  keywords: string[];
  readability_score: number;
  content_quality_score: number;
  uniqueness_score: number;
  ai_summary: string;
  ai_tags: string[];
  key_insights: string[];
  relevance_score: number;
  priority_score: number;
  model_version: string;
  processing_time_ms: number;
}

interface TrendDetection {
  trend_type: "emerging" | "growing" | "declining" | "stable" | "viral";
  topic: string;
  category: string;
  current_volume: number;
  volume_change_24h: number;
  volume_change_7d: number;
  growth_rate: number;
  confidence_level: number;
  trend_strength: number;
}

class ContentAnalyzer {
  private supabase;
  private openaiApiKey: string;
  private anthropicApiKey: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    this.openaiApiKey = process.env.OPENAI_API_KEY || "";
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
  }

  // Main content analysis pipeline
  async analyzeContent(item: ScrapedItem): Promise<ContentAnalysis> {
    const startTime = Date.now();

    try {
      // Parallel AI analysis calls for speed
      const [
        sentimentResult,
        topicResult,
        qualityResult,
        summaryResult,
      ] = await Promise.all([
        this.analyzeSentiment(item),
        this.extractTopicsAndKeywords(item),
        this.assessContentQuality(item),
        this.generateSummaryAndInsights(item),
      ]);

      const analysis: ContentAnalysis = {
        sentiment: sentimentResult.sentiment,
        confidence_score: sentimentResult.confidence,
        primary_category: topicResult.primary_category,
        topics: topicResult.topics,
        keywords: topicResult.keywords,
        readability_score: qualityResult.readability_score,
        content_quality_score: qualityResult.quality_score,
        uniqueness_score: await this.calculateUniqueness(item),
        ai_summary: summaryResult.summary,
        ai_tags: summaryResult.tags,
        key_insights: summaryResult.insights,
        relevance_score: this.calculateRelevanceScore(item, topicResult),
        priority_score: this.calculatePriorityScore(
          item,
          sentimentResult,
          qualityResult,
        ),
        model_version: "gpt-4o-mini-v1",
        processing_time_ms: Date.now() - startTime,
      };

      // Store analysis results
      await this.storeAnalysis(item.id, analysis);

      // Generate embeddings for similarity analysis
      await this.generateEmbeddings(item, analysis);

      return analysis;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Content analysis failed:", error);
      throw new Error(
        `Analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  // Sentiment analysis using OpenAI
  private async analyzeSentiment(item: ScrapedItem): Promise<{
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    confidence: number;
  }> {
    const prompt = `Analyze the sentiment of this content:
    
Title: ${item.title}
Author: ${item.author || "Unknown"}
Content: ${JSON.stringify(item.metadata)}

Respond with a JSON object containing:
- sentiment: "positive", "negative", "neutral", or "mixed"
- confidence: number between 0 and 1
- reasoning: brief explanation

Focus on job market, career, and professional context.`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 200,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        sentiment: result.sentiment,
        confidence: Math.min(Math.max(result.confidence, 0), 1),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Sentiment analysis failed:", error);
      // Fallback to neutral sentiment
      return { sentiment: "neutral", confidence: 0.5 };
    }
  }

  // Topic extraction and categorization
  private async extractTopicsAndKeywords(item: ScrapedItem): Promise<{
    primary_category: string;
    topics: string[];
    keywords: string[];
  }> {
    const prompt = `Extract topics and keywords from this job market content:

Title: ${item.title}
Source: ${item.source_domain}
Content: ${JSON.stringify(item.metadata)}

Respond with JSON containing:
- primary_category: main category (e.g., "Software Engineering", "Data Science", "Marketing", "Sales", "Design")
- topics: array of 3-5 relevant topics
- keywords: array of 5-10 important keywords

Focus on professional skills, technologies, industries, and job roles.`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 300,
          }),
        },
      );

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        primary_category: result.primary_category || "General",
        topics: Array.isArray(result.topics) ? result.topics.slice(0, 5) : [],
        keywords: Array.isArray(result.keywords)
          ? result.keywords.slice(0, 10)
          : [],
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Topic extraction failed:", error);
      return {
        primary_category: "General",
        topics: [],
        keywords: [],
      };
    }
  }

  // Content quality assessment
  private async assessContentQuality(item: ScrapedItem): Promise<{
    readability_score: number;
    quality_score: number;
  }> {
    const content = `${item.title} ${item.author || ""} ${
      JSON.stringify(item.metadata)
    }`;

    // Simple readability metrics
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;

    // Readability score (Flesch-like approximation)
    const readability_score = Math.max(
      0,
      Math.min(
        100,
        206.835 - (1.015 * avgWordsPerSentence) -
          (84.6 * (content.split(/[aeiouAEIOU]/).length / words)),
      ),
    );

    // Quality score based on multiple factors
    const hasAuthor = item.author ? 0.2 : 0;
    const hasMetadata = Object.keys(item.metadata).length > 0 ? 0.3 : 0;
    const titleLength = item.title.length >= 10 && item.title.length <= 200
      ? 0.3
      : 0;
    const contentRichness = words > 50 ? 0.2 : words / 250; // Scale based on word count

    const quality_score = Math.min(
      1,
      hasAuthor + hasMetadata + titleLength + contentRichness,
    );

    return {
      readability_score: Math.round(readability_score * 100) / 100,
      quality_score: Math.round(quality_score * 100) / 100,
    };
  }

  // Generate AI summary and insights
  private async generateSummaryAndInsights(item: ScrapedItem): Promise<{
    summary: string;
    tags: string[];
    insights: string[];
  }> {
    const prompt =
      `Create a professional summary and insights for this job market content:

Title: ${item.title}
Author: ${item.author || "Unknown"}
Source: ${item.source_domain}
Content: ${JSON.stringify(item.metadata)}

Respond with JSON containing:
- summary: 2-3 sentence professional summary
- tags: array of 3-5 relevant hashtag-style tags (without #)
- insights: array of 2-3 key insights or takeaways

Focus on career relevance and professional value.`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 400,
          }),
        },
      );

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        summary: result.summary || "",
        tags: Array.isArray(result.tags) ? result.tags.slice(0, 5) : [],
        insights: Array.isArray(result.insights)
          ? result.insights.slice(0, 3)
          : [],
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Summary generation failed:", error);
      return {
        summary: "",
        tags: [],
        insights: [],
      };
    }
  }

  // Calculate content uniqueness based on similarity to existing content
  private async calculateUniqueness(item: ScrapedItem): Promise<number> {
    // Simple uniqueness based on title similarity for now
    // In production, this would use embeddings and semantic similarity

    const { data: similarItems } = await this.supabase
      .from("scraped_items")
      .select("title")
      .neq("id", item.id)
      .ilike("title", `%${item.title.substring(0, 20)}%`)
      .limit(10);

    if (!similarItems || similarItems.length === 0) {
      return 1.0; // Completely unique
    }

    // Calculate similarity penalty
    const similarityPenalty = Math.min(0.8, similarItems.length * 0.1);
    return Math.max(0.2, 1.0 - similarityPenalty);
  }

  // Calculate relevance score based on various factors
  private calculateRelevanceScore(item: ScrapedItem, topicData: any): number {
    let score = 0.5; // Base score

    // Domain reputation bonus
    const reputableDomains = [
      "linkedin.com",
      "indeed.com",
      "glassdoor.com",
      "stackoverflow.com",
    ];
    if (
      reputableDomains.some((domain) => item.source_domain.includes(domain))
    ) {
      score += 0.2;
    }

    // Topic relevance bonus
    if (topicData.topics.length > 0) {
      score += 0.2;
    }

    // Content richness bonus
    if (Object.keys(item.metadata).length > 3) {
      score += 0.1;
    }

    return Math.min(1, Math.round(score * 100) / 100);
  }

  // Calculate priority score for content ranking
  private calculatePriorityScore(
    item: ScrapedItem,
    sentiment: any,
    quality: any,
  ): number {
    let priority = 5; // Base priority (1-10 scale)

    // Positive sentiment bonus
    if (sentiment.sentiment === "positive" && sentiment.confidence > 0.7) {
      priority += 2;
    }

    // High quality content bonus
    if (quality.quality_score > 0.8) {
      priority += 2;
    }

    // Recent content bonus
    const now = new Date();
    const itemDate = new Date(item.metadata.date || now);
    const daysDiff = (now.getTime() - itemDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysDiff < 1) priority += 1;
    else if (daysDiff < 7) priority += 0.5;

    return Math.min(10, Math.max(1, Math.round(priority)));
  }

  // Generate vector embeddings for semantic similarity
  private async generateEmbeddings(
    item: ScrapedItem,
    analysis: ContentAnalysis,
  ): Promise<void> {
    try {
      const texts = [
        item.title,
        `${item.title} ${analysis.ai_summary}`,
        `${item.title} ${analysis.ai_summary} ${analysis.topics.join(" ")} ${
          analysis.keywords.join(" ")
        }`,
      ];

      const embeddingPromises = texts.map(async (text, index) => {
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-ada-002",
            input: text.substring(0, 8000), // Limit text length
          }),
        });

        if (!response.ok) {
          throw new Error(
            `OpenAI Embeddings API error: ${response.statusText}`,
          );
        }

        const data = await response.json();
        return data.data[0].embedding;
      });

      const [titleEmbedding, contentEmbedding, combinedEmbedding] =
        await Promise.all(embeddingPromises);

      // Store embeddings (would need pgvector extension in production)
      await this.supabase
        .from("content_embeddings")
        .insert({
          scraped_item_id: item.id,
          title_embedding: titleEmbedding,
          content_embedding: contentEmbedding,
          combined_embedding: combinedEmbedding,
          embedding_model: "text-embedding-ada-002",
          embedding_version: "v1",
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Embedding generation failed:", error);
      // Continue without embeddings - not critical for basic functionality
    }
  }

  // Store analysis results in database
  private async storeAnalysis(
    itemId: string,
    analysis: ContentAnalysis,
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("content_analysis")
        .insert({
          scraped_item_id: itemId,
          sentiment: analysis.sentiment,
          confidence_score: analysis.confidence_score,
          primary_category: analysis.primary_category,
          topics: analysis.topics,
          keywords: analysis.keywords,
          readability_score: analysis.readability_score,
          content_quality_score: analysis.content_quality_score,
          uniqueness_score: analysis.uniqueness_score,
          ai_summary: analysis.ai_summary,
          ai_tags: analysis.ai_tags,
          key_insights: analysis.key_insights,
          relevance_score: analysis.relevance_score,
          priority_score: analysis.priority_score,
          model_version: analysis.model_version,
          processing_time_ms: analysis.processing_time_ms,
        });

      if (error) {
        throw new Error(`Database storage failed: ${error.message}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to store analysis:", error);
      throw error;
    }
  }

  // Detect trends from analyzed content
  async detectTrends(): Promise<TrendDetection[]> {
    try {
      // Get topic frequency data from recent content
      const { data: topicData } = await this.supabase
        .from("content_analysis")
        .select(`
          topics,
          primary_category,
          analyzed_at,
          scraped_items!inner(last_seen_at)
        `)
        .gte(
          "scraped_items.last_seen_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        );

      if (!topicData || topicData.length === 0) {
        return [];
      }

      // Aggregate topic frequencies
      const topicCounts: Record<
        string,
        { count: number; category: string; recent: number }
      > = {};

      topicData.forEach((item: any) => {
        if (item.topics && Array.isArray(item.topics)) {
          item.topics.forEach((topic: string) => {
            if (!topicCounts[topic]) {
              topicCounts[topic] = {
                count: 0,
                category: item.primary_category,
                recent: 0,
              };
            }
            topicCounts[topic].count++;

            // Count recent mentions (last 24 hours)
            const itemDate = new Date(item.scraped_items.last_seen_at);
            if (Date.now() - itemDate.getTime() < 24 * 60 * 60 * 1000) {
              topicCounts[topic].recent++;
            }
          });
        }
      });

      // Identify trends
      const trends: TrendDetection[] = [];

      for (const [topic, data] of Object.entries(topicCounts)) {
        if (data.count >= 3) { // Minimum threshold for trend detection
          const growth_rate = data.recent /
            Math.max(1, data.count - data.recent);
          const trend_strength = Math.min(1, data.count / 100); // Normalize strength

          let trend_type: TrendDetection["trend_type"] = "stable";
          if (growth_rate > 2) trend_type = "viral";
          else if (growth_rate > 1.5) trend_type = "growing";
          else if (growth_rate > 1.2) trend_type = "emerging";
          else if (growth_rate < 0.5) trend_type = "declining";

          trends.push({
            trend_type,
            topic,
            category: data.category,
            current_volume: data.count,
            volume_change_24h:
              ((data.recent / Math.max(1, data.count - data.recent)) - 1) * 100,
            volume_change_7d: 0, // Would need historical data
            growth_rate: growth_rate,
            confidence_level: Math.min(1, data.count / 20),
            trend_strength,
          });
        }
      }

      // Store detected trends
      for (const trend of trends) {
        await this.supabase
          .from("content_trends")
          .upsert({
            trend_type: trend.trend_type,
            topic: trend.topic,
            category: trend.category,
            current_volume: trend.current_volume,
            volume_change_24h: trend.volume_change_24h,
            volume_change_7d: trend.volume_change_7d,
            growth_rate: trend.growth_rate,
            confidence_level: trend.confidence_level,
            trend_strength: trend.trend_strength,
            detection_algorithm: "frequency_based_v1",
          }, {
            onConflict: "topic",
            ignoreDuplicates: false,
          });
      }

      return trends.sort((a, b) => b.trend_strength - a.trend_strength);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Trend detection failed:", error);
      return [];
    }
  }

  // Batch process multiple items
  async processBatch(items: ScrapedItem[]): Promise<void> {
    const batchSize = 5; // Process in small batches to avoid API limits

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (item) => {
          try {
            await this.analyzeContent(item);
            // eslint-disable-next-line no-console
            console.log(`Analyzed content: ${item.title.substring(0, 50)}...`);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to analyze item ${item.id}:`, error);
          }
        }),
      );

      // Rate limiting - wait between batches
      if (i + batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}

export { type ContentAnalysis, ContentAnalyzer, type TrendDetection };
