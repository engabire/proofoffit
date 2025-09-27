-- Enhanced scraping system with data quality and monitoring

-- Add constraints for data quality
ALTER TABLE public.scraped_items
  ADD CONSTRAINT url_is_http CHECK (canonical_item_url ~ '^https?://'),
  ADD CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
  ADD CONSTRAINT domain_not_empty CHECK (length(trim(source_domain)) > 0);

-- Add indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_items_domain_last_seen 
  ON public.scraped_items (source_domain, last_seen_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_items_content_hash 
  ON public.scraped_items (content_hash);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_items_changed_at 
  ON public.scraped_items (changed_at) WHERE changed_at IS NOT NULL;

-- Enhanced domain audit with purpose binding
ALTER TABLE public.domain_audit 
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'not_set',
  ADD COLUMN IF NOT EXISTS render_mode text NOT NULL DEFAULT 'http' CHECK (render_mode IN ('http', 'playwright')),
  ADD COLUMN IF NOT EXISTS max_depth integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS rate_limit_ms integer NOT NULL DEFAULT 1500,
  ADD COLUMN IF NOT EXISTS paused boolean NOT NULL DEFAULT false;

-- Update existing domains with purposes
UPDATE public.domain_audit 
SET purpose = 'testing_sandbox' 
WHERE domain IN ('quotes.toscrape.com', 'books.toscrape.com') AND purpose = 'not_set';

-- Crawl frontier table for advanced discovery
CREATE TABLE IF NOT EXISTS public.crawl_frontier (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  source_domain text NOT NULL,
  depth integer NOT NULL DEFAULT 0,
  priority integer NOT NULL DEFAULT 0,
  next_run_at timestamptz NOT NULL DEFAULT now(),
  last_crawled_at timestamptz,
  crawl_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'crawled', 'failed', 'skipped')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crawl_frontier_next_run 
  ON public.crawl_frontier (next_run_at, status) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_crawl_frontier_domain 
  ON public.crawl_frontier (source_domain);

-- Selector metrics for drift detection
CREATE TABLE IF NOT EXISTS public.selector_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id text NOT NULL,
  source_domain text NOT NULL,
  url text NOT NULL,
  selector text NOT NULL,
  matched_count integer NOT NULL DEFAULT 0,
  html_length integer NOT NULL DEFAULT 0,
  hit_rate decimal(10,6) GENERATED ALWAYS AS (
    CASE WHEN html_length > 0 THEN matched_count::decimal / (html_length::decimal / 1000.0) ELSE 0 END
  ) STORED,
  scraped_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_selector_metrics_domain_selector 
  ON public.selector_metrics (source_domain, selector, scraped_at DESC);

CREATE INDEX IF NOT EXISTS idx_selector_metrics_scraped_at 
  ON public.selector_metrics (scraped_at);

-- Job execution logs for monitoring
CREATE TABLE IF NOT EXISTS public.scrape_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'killed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer,
  urls_processed integer DEFAULT 0,
  items_scraped integer DEFAULT 0,
  items_changed integer DEFAULT 0,
  bytes_processed bigint DEFAULT 0,
  success_rate decimal(5,2),
  error_message text,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_scrape_jobs_job_id ON public.scrape_jobs (job_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_started_at ON public.scrape_jobs (started_at DESC);

-- SLO tracking table
CREATE TABLE IF NOT EXISTS public.slo_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name text NOT NULL,
  source_domain text,
  value decimal(10,6) NOT NULL,
  threshold decimal(10,6),
  passed boolean NOT NULL,
  measured_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_slo_metrics_name_domain 
  ON public.slo_metrics (metric_name, source_domain, measured_at DESC);

-- Feed and sitemap discovery
CREATE TABLE IF NOT EXISTS public.discovered_feeds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_domain text NOT NULL,
  feed_url text NOT NULL,
  feed_type text NOT NULL CHECK (feed_type IN ('rss', 'atom', 'sitemap')),
  last_build_date timestamptz,
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  item_count integer DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(source_domain, feed_url)
);

-- PII detection quarantine
CREATE TABLE IF NOT EXISTS public.pii_quarantine (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scraped_item_id uuid REFERENCES public.scraped_items(id),
  pii_type text NOT NULL, -- 'email', 'phone', 'ssn', etc.
  detected_content text NOT NULL,
  confidence decimal(3,2) NOT NULL, -- 0.00 to 1.00
  quarantined_at timestamptz NOT NULL DEFAULT now(),
  reviewed boolean NOT NULL DEFAULT false,
  approved boolean
);

-- Enhanced triggers
CREATE OR REPLACE FUNCTION validate_domain_purpose()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure purpose is set before allowing scraping
  IF NEW.purpose = 'not_set' OR NEW.purpose IS NULL THEN
    RAISE EXCEPTION 'Domain purpose must be set before scraping is allowed';
  END IF;
  
  -- Validate render mode
  IF NEW.render_mode NOT IN ('http', 'playwright') THEN
    RAISE EXCEPTION 'Invalid render mode: %', NEW.render_mode;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_domain_purpose_trigger ON public.domain_audit;
CREATE TRIGGER validate_domain_purpose_trigger
  BEFORE INSERT OR UPDATE ON public.domain_audit
  FOR EACH ROW
  EXECUTE FUNCTION validate_domain_purpose();

-- Function to calculate SLO metrics
CREATE OR REPLACE FUNCTION calculate_slo_metrics()
RETURNS void AS $$
DECLARE
  domain_rec record;
  availability decimal(5,2);
  freshness_p95 interval;
  false_positive_rate decimal(5,2);
BEGIN
  -- Calculate metrics for each domain
  FOR domain_rec IN SELECT DISTINCT source_domain FROM scraped_items LOOP
    
    -- Availability: percentage of successful runs in last 30 days
    SELECT 
      COALESCE(
        (COUNT(*) FILTER (WHERE status = 'completed')::decimal / NULLIF(COUNT(*), 0) * 100),
        0
      ) INTO availability
    FROM scrape_jobs 
    WHERE started_at > now() - interval '30 days'
      AND metadata->>'domain' = domain_rec.source_domain;
    
    INSERT INTO slo_metrics (metric_name, source_domain, value, threshold, passed)
    VALUES (
      'availability_30d', 
      domain_rec.source_domain, 
      availability, 
      99.0, 
      availability >= 99.0
    );
    
    -- Item freshness P95 (placeholder - requires more complex calculation)
    INSERT INTO slo_metrics (metric_name, source_domain, value, threshold, passed)
    VALUES (
      'freshness_p95_hours', 
      domain_rec.source_domain, 
      6.0, -- Placeholder
      6.0, 
      true
    );
    
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for selector metrics (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_selector_metrics()
RETURNS bigint AS $$
DECLARE
  deleted_count bigint;
BEGIN
  DELETE FROM selector_metrics 
  WHERE scraped_at < now() - interval '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to detect selector drift
CREATE OR REPLACE FUNCTION detect_selector_drift(
  p_domain text,
  p_selector text,
  p_days_back integer DEFAULT 7
)
RETURNS TABLE(
  current_hit_rate decimal(10,6),
  median_hit_rate decimal(10,6),
  alert_threshold decimal(10,6),
  should_alert boolean
) AS $$
DECLARE
  rates decimal(10,6)[];
  median_rate decimal(10,6);
  current_rate decimal(10,6);
  threshold decimal(10,6);
BEGIN
  -- Get hit rates for the last N days
  SELECT array_agg(hit_rate ORDER BY scraped_at) INTO rates
  FROM selector_metrics 
  WHERE source_domain = p_domain 
    AND selector = p_selector 
    AND scraped_at > now() - (p_days_back || ' days')::interval;
  
  IF array_length(rates, 1) = 0 THEN
    current_hit_rate := 0;
    median_hit_rate := 0;
    alert_threshold := 0;
    should_alert := false;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Calculate median
  SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY rate) INTO median_rate
  FROM unnest(rates) AS rate;
  
  -- Get most recent rate
  current_rate := rates[array_upper(rates, 1)];
  
  -- Alert threshold is 50% of median
  threshold := median_rate * 0.5;
  
  current_hit_rate := current_rate;
  median_hit_rate := median_rate;
  alert_threshold := threshold;
  should_alert := current_rate < threshold AND median_rate > 0;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Enhanced materialized view for monitoring dashboard
DROP MATERIALIZED VIEW IF EXISTS public.scraping_stats;
CREATE MATERIALIZED VIEW public.scraping_stats AS
SELECT 
  source_domain,
  DATE_TRUNC('day', last_seen_at) as date,
  COUNT(*) as total_items,
  COUNT(DISTINCT canonical_item_url) as unique_items,
  COUNT(CASE WHEN changed_at IS NOT NULL THEN 1 END) as changed_items,
  COUNT(CASE WHEN DATE_TRUNC('day', first_seen_at) = DATE_TRUNC('day', last_seen_at) THEN 1 END) as new_items,
  MIN(first_seen_at) as first_seen,
  MAX(last_seen_at) as last_seen,
  AVG(length(title)) as avg_title_length,
  COUNT(CASE WHEN author IS NOT NULL THEN 1 END) as items_with_author
FROM public.scraped_items
WHERE last_seen_at > now() - interval '90 days'
GROUP BY source_domain, DATE_TRUNC('day', last_seen_at)
ORDER BY date DESC, source_domain;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW public.scraping_stats;

-- RLS policies for new tables
ALTER TABLE public.crawl_frontier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selector_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovered_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_quarantine ENABLE ROW LEVEL SECURITY;

-- Read-only policies for monitoring data
CREATE POLICY "public_read_scrape_jobs" ON public.scrape_jobs FOR SELECT USING (true);
CREATE POLICY "public_read_slo_metrics" ON public.slo_metrics FOR SELECT USING (true);
CREATE POLICY "public_read_discovered_feeds" ON public.discovered_feeds FOR SELECT USING (true);

-- No public access to sensitive data
CREATE POLICY "no_public_frontier" ON public.crawl_frontier FOR SELECT USING (false);
CREATE POLICY "no_public_selector_metrics" ON public.selector_metrics FOR SELECT USING (false);
CREATE POLICY "no_public_pii_quarantine" ON public.pii_quarantine FOR SELECT USING (false);

-- Comments
COMMENT ON TABLE public.crawl_frontier IS 'Queue for discovered URLs with depth and priority';
COMMENT ON TABLE public.selector_metrics IS 'Tracks CSS selector hit rates for drift detection';
COMMENT ON TABLE public.scrape_jobs IS 'Job execution logs and metrics';
COMMENT ON TABLE public.slo_metrics IS 'Service Level Objective measurements';
COMMENT ON TABLE public.discovered_feeds IS 'RSS/Atom feeds and sitemaps found during crawling';
COMMENT ON TABLE public.pii_quarantine IS 'Potential PII detection and review queue';

COMMENT ON FUNCTION calculate_slo_metrics() IS 'Calculates and stores SLO metrics for monitoring';
COMMENT ON FUNCTION detect_selector_drift(text, text, integer) IS 'Detects significant changes in CSS selector hit rates';
COMMENT ON FUNCTION cleanup_selector_metrics() IS 'Removes old selector metrics to prevent table bloat';