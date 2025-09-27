-- AI-powered content intelligence and analysis system

-- Content analysis results table
CREATE TABLE IF NOT EXISTS public.content_analysis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scraped_item_id uuid REFERENCES public.scraped_items(id) ON DELETE CASCADE,
  
  -- AI Classification
  sentiment text CHECK (sentiment IN ('positive', 'negative', 'neutral', 'mixed')),
  confidence_score decimal(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Topic and Category Analysis
  primary_category text,
  topics jsonb DEFAULT '[]', -- Array of extracted topics
  keywords jsonb DEFAULT '[]', -- Array of relevant keywords
  
  -- Content Quality Metrics
  readability_score decimal(5,2),
  content_quality_score decimal(3,2) CHECK (content_quality_score >= 0 AND content_quality_score <= 1),
  uniqueness_score decimal(3,2) CHECK (uniqueness_score >= 0 AND uniqueness_score <= 1),
  
  -- AI-Generated Content
  ai_summary text,
  ai_tags jsonb DEFAULT '[]',
  key_insights jsonb DEFAULT '[]',
  
  -- Relevance and Priority
  relevance_score decimal(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  priority_score integer CHECK (priority_score >= 1 AND priority_score <= 10),
  
  -- Processing Metadata
  model_version text NOT NULL,
  processing_time_ms integer,
  analyzed_at timestamptz NOT NULL DEFAULT now(),
  
  -- Additional Analysis Data
  metadata jsonb DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Content embeddings for semantic similarity
CREATE TABLE IF NOT EXISTS public.content_embeddings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scraped_item_id uuid REFERENCES public.scraped_items(id) ON DELETE CASCADE,
  content_analysis_id uuid REFERENCES public.content_analysis(id) ON DELETE CASCADE,
  
  -- Vector embeddings (using pgvector extension if available)
  title_embedding vector(1536), -- OpenAI ada-002 embedding size
  content_embedding vector(1536),
  combined_embedding vector(1536),
  
  -- Embedding metadata
  embedding_model text NOT NULL DEFAULT 'text-embedding-ada-002',
  embedding_version text NOT NULL DEFAULT 'v1',
  
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trend detection and predictions
CREATE TABLE IF NOT EXISTS public.content_trends (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Trend Identification
  trend_type text NOT NULL CHECK (trend_type IN ('emerging', 'growing', 'declining', 'stable', 'viral')),
  topic text NOT NULL,
  category text,
  
  -- Trend Metrics
  current_volume integer NOT NULL DEFAULT 0,
  volume_change_24h decimal(5,2),
  volume_change_7d decimal(5,2),
  growth_rate decimal(5,2),
  
  -- Prediction Data
  predicted_peak_date timestamptz,
  confidence_level decimal(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  trend_strength decimal(3,2) CHECK (trend_strength >= 0 AND trend_strength <= 1),
  
  -- Geographic and Demographic Data
  geographic_scope jsonb DEFAULT '[]', -- Countries/regions where trend is observed
  demographic_data jsonb DEFAULT '{}',
  
  -- Time Series Data
  time_series_data jsonb DEFAULT '[]', -- Historical volume data points
  
  -- Detection Metadata
  detection_algorithm text NOT NULL,
  first_detected_at timestamptz NOT NULL DEFAULT now(),
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Content similarity clusters for deduplication
CREATE TABLE IF NOT EXISTS public.content_clusters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Cluster Information
  cluster_name text,
  cluster_type text CHECK (cluster_type IN ('exact_duplicate', 'near_duplicate', 'semantic_similar', 'topic_related')),
  
  -- Cluster Metrics
  item_count integer NOT NULL DEFAULT 0,
  similarity_threshold decimal(3,2) CHECK (similarity_threshold >= 0 AND similarity_threshold <= 1),
  centroid_embedding vector(1536),
  
  -- Representative Content
  representative_item_id uuid REFERENCES public.scraped_items(id),
  cluster_summary text,
  common_keywords jsonb DEFAULT '[]',
  
  -- Cluster Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Content cluster membership
CREATE TABLE IF NOT EXISTS public.content_cluster_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id uuid REFERENCES public.content_clusters(id) ON DELETE CASCADE,
  scraped_item_id uuid REFERENCES public.scraped_items(id) ON DELETE CASCADE,
  content_analysis_id uuid REFERENCES public.content_analysis(id) ON DELETE CASCADE,
  
  -- Membership Metrics
  similarity_score decimal(3,2) CHECK (similarity_score >= 0 AND similarity_score <= 1),
  is_representative boolean DEFAULT false,
  distance_from_centroid decimal(10,6),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(cluster_id, scraped_item_id)
);

-- AI model performance tracking
CREATE TABLE IF NOT EXISTS public.ai_model_performance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Model Information
  model_name text NOT NULL,
  model_version text NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('classification', 'sentiment', 'summarization', 'embedding', 'trend_detection')),
  
  -- Performance Metrics
  accuracy decimal(3,2),
  precision_score decimal(3,2),
  recall_score decimal(3,2),
  f1_score decimal(3,2),
  
  -- Processing Metrics
  avg_processing_time_ms decimal(10,2),
  total_items_processed integer DEFAULT 0,
  success_rate decimal(3,2),
  
  -- Cost Tracking
  api_calls_count integer DEFAULT 0,
  estimated_cost_usd decimal(10,4),
  
  -- Evaluation Period
  evaluation_start_date timestamptz NOT NULL,
  evaluation_end_date timestamptz NOT NULL,
  
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_analysis_item_id ON public.content_analysis(scraped_item_id);
CREATE INDEX IF NOT EXISTS idx_content_analysis_sentiment ON public.content_analysis(sentiment);
CREATE INDEX IF NOT EXISTS idx_content_analysis_category ON public.content_analysis(primary_category);
CREATE INDEX IF NOT EXISTS idx_content_analysis_relevance ON public.content_analysis(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_content_analysis_analyzed_at ON public.content_analysis(analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_embeddings_item_id ON public.content_embeddings(scraped_item_id);
CREATE INDEX IF NOT EXISTS idx_content_embeddings_analysis_id ON public.content_embeddings(content_analysis_id);

CREATE INDEX IF NOT EXISTS idx_content_trends_topic ON public.content_trends(topic);
CREATE INDEX IF NOT EXISTS idx_content_trends_type ON public.content_trends(trend_type);
CREATE INDEX IF NOT EXISTS idx_content_trends_updated ON public.content_trends(last_updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_clusters_type ON public.content_clusters(cluster_type);
CREATE INDEX IF NOT EXISTS idx_content_clusters_count ON public.content_clusters(item_count DESC);

CREATE INDEX IF NOT EXISTS idx_cluster_members_cluster ON public.content_cluster_members(cluster_id);
CREATE INDEX IF NOT EXISTS idx_cluster_members_item ON public.content_cluster_members(scraped_item_id);
CREATE INDEX IF NOT EXISTS idx_cluster_members_similarity ON public.content_cluster_members(similarity_score DESC);

-- RLS Policies
ALTER TABLE public.content_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_cluster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_performance ENABLE ROW LEVEL SECURITY;

-- Public read access for analysis results
CREATE POLICY "public_read_content_analysis" ON public.content_analysis FOR SELECT USING (true);
CREATE POLICY "public_read_content_trends" ON public.content_trends FOR SELECT USING (true);
CREATE POLICY "public_read_content_clusters" ON public.content_clusters FOR SELECT USING (true);

-- Restricted access to embeddings and performance data
CREATE POLICY "no_public_embeddings" ON public.content_embeddings FOR SELECT USING (false);
CREATE POLICY "no_public_cluster_members" ON public.content_cluster_members FOR SELECT USING (false);
CREATE POLICY "no_public_model_performance" ON public.ai_model_performance FOR SELECT USING (false);

-- Functions for AI processing
CREATE OR REPLACE FUNCTION calculate_content_similarity(
  embedding1 vector(1536),
  embedding2 vector(1536)
)
RETURNS decimal(3,2) AS $$
BEGIN
  -- Calculate cosine similarity between two embeddings
  -- This is a placeholder - actual implementation would use pgvector operations
  RETURN 0.85; -- Placeholder return value
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_trend_metrics()
RETURNS void AS $$
DECLARE
  trend_rec record;
  current_volume integer;
  volume_24h_ago integer;
  volume_7d_ago integer;
BEGIN
  -- Update trend metrics for all active trends
  FOR trend_rec IN SELECT * FROM content_trends WHERE last_updated_at < now() - interval '1 hour' LOOP
    
    -- Calculate current volume for this trend topic
    SELECT COUNT(*) INTO current_volume
    FROM content_analysis ca
    JOIN scraped_items si ON ca.scraped_item_id = si.id
    WHERE ca.topics ? trend_rec.topic
      AND si.last_seen_at > now() - interval '24 hours';
    
    -- Calculate volume 24 hours ago
    SELECT COUNT(*) INTO volume_24h_ago
    FROM content_analysis ca
    JOIN scraped_items si ON ca.scraped_item_id = si.id
    WHERE ca.topics ? trend_rec.topic
      AND si.last_seen_at BETWEEN now() - interval '48 hours' AND now() - interval '24 hours';
    
    -- Calculate volume 7 days ago
    SELECT COUNT(*) INTO volume_7d_ago
    FROM content_analysis ca
    JOIN scraped_items si ON ca.scraped_item_id = si.id
    WHERE ca.topics ? trend_rec.topic
      AND si.last_seen_at BETWEEN now() - interval '8 days' AND now() - interval '7 days';
    
    -- Update the trend record
    UPDATE content_trends SET
      current_volume = current_volume,
      volume_change_24h = CASE WHEN volume_24h_ago > 0 THEN ((current_volume - volume_24h_ago)::decimal / volume_24h_ago) * 100 ELSE 0 END,
      volume_change_7d = CASE WHEN volume_7d_ago > 0 THEN ((current_volume - volume_7d_ago)::decimal / volume_7d_ago) * 100 ELSE 0 END,
      last_updated_at = now()
    WHERE id = trend_rec.id;
    
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Automated content clustering function
CREATE OR REPLACE FUNCTION cluster_similar_content()
RETURNS integer AS $$
DECLARE
  processed_count integer := 0;
  similarity_threshold decimal(3,2) := 0.85;
  item_rec record;
  cluster_id uuid;
BEGIN
  -- Find unprocessed items and cluster them based on similarity
  FOR item_rec IN 
    SELECT si.id, si.title, ca.id as analysis_id
    FROM scraped_items si
    JOIN content_analysis ca ON si.id = ca.scraped_item_id
    WHERE NOT EXISTS (
      SELECT 1 FROM content_cluster_members ccm WHERE ccm.scraped_item_id = si.id
    )
    AND si.created_at > now() - interval '24 hours'
    LIMIT 100
  LOOP
    
    -- Try to find an existing cluster for this item
    -- This would use actual similarity calculations in a real implementation
    SELECT id INTO cluster_id
    FROM content_clusters cc
    WHERE cc.cluster_type = 'semantic_similar'
    LIMIT 1;
    
    -- If no suitable cluster found, create a new one
    IF cluster_id IS NULL THEN
      INSERT INTO content_clusters (cluster_type, similarity_threshold, representative_item_id)
      VALUES ('semantic_similar', similarity_threshold, item_rec.id)
      RETURNING id INTO cluster_id;
    END IF;
    
    -- Add item to cluster
    INSERT INTO content_cluster_members (cluster_id, scraped_item_id, content_analysis_id, similarity_score)
    VALUES (cluster_id, item_rec.id, item_rec.analysis_id, 0.90)
    ON CONFLICT (cluster_id, scraped_item_id) DO NOTHING;
    
    processed_count := processed_count + 1;
    
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.content_analysis IS 'AI-powered analysis results for scraped content';
COMMENT ON TABLE public.content_embeddings IS 'Vector embeddings for semantic similarity and clustering';
COMMENT ON TABLE public.content_trends IS 'Detected trends and predictions from content analysis';
COMMENT ON TABLE public.content_clusters IS 'Content similarity clusters for deduplication and organization';
COMMENT ON TABLE public.content_cluster_members IS 'Membership mapping between content items and clusters';
COMMENT ON TABLE public.ai_model_performance IS 'Performance metrics and cost tracking for AI models';

COMMENT ON FUNCTION calculate_content_similarity(vector, vector) IS 'Calculate cosine similarity between content embeddings';
COMMENT ON FUNCTION update_trend_metrics() IS 'Update trend volume and growth metrics';
COMMENT ON FUNCTION cluster_similar_content() IS 'Automatically cluster similar content for deduplication';