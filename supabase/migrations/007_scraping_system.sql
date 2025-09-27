-- Scraping System Database Schema
-- Implements security, concurrency, and data hygiene patterns

-- 1. Job locking table for concurrency control
CREATE TABLE IF NOT EXISTS public.job_lock (
  name text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);

-- 2. Enhanced scraped_items table with canonicalization and change tracking
CREATE TABLE IF NOT EXISTS public.scraped_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_domain text NOT NULL,
  item_url text NOT NULL,
  canonical_item_url text NOT NULL,
  title text NOT NULL,
  author text,
  metadata jsonb DEFAULT '{}',
  content_hash text NOT NULL,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  changed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Fetch metadata for conditional requests (ETag/Last-Modified)
CREATE TABLE IF NOT EXISTS public.fetch_meta (
  item_url text PRIMARY KEY,
  etag text,
  last_modified text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Raw HTML storage (temporary, auto-purged)
CREATE TABLE IF NOT EXISTS public.scrape_raw (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_url text NOT NULL,
  html_content text NOT NULL,
  content_length integer,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_scraped_items_canonical 
  ON public.scraped_items (source_domain, canonical_item_url);

CREATE INDEX IF NOT EXISTS idx_scraped_items_last_seen 
  ON public.scraped_items (last_seen_at);

CREATE INDEX IF NOT EXISTS idx_scraped_items_created 
  ON public.scraped_items (created_at);

CREATE INDEX IF NOT EXISTS idx_scraped_items_domain 
  ON public.scraped_items (source_domain);

CREATE INDEX IF NOT EXISTS idx_scrape_raw_scraped_at 
  ON public.scrape_raw (scraped_at);

CREATE INDEX IF NOT EXISTS idx_scrape_raw_expires_at 
  ON public.scrape_raw (expires_at);

CREATE INDEX IF NOT EXISTS idx_fetch_meta_updated 
  ON public.fetch_meta (updated_at);

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to scraped_items
DROP TRIGGER IF EXISTS update_scraped_items_updated_at ON public.scraped_items;
CREATE TRIGGER update_scraped_items_updated_at
  BEFORE UPDATE ON public.scraped_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for change detection
CREATE OR REPLACE FUNCTION detect_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- If content_hash changed, update changed_at
  IF OLD.content_hash IS DISTINCT FROM NEW.content_hash THEN
    NEW.changed_at = now();
  END IF;
  
  -- Always update last_seen_at on any update
  NEW.last_seen_at = now();
  
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS detect_scraped_items_changes ON public.scraped_items;
CREATE TRIGGER detect_scraped_items_changes
  BEFORE UPDATE ON public.scraped_items
  FOR EACH ROW
  EXECUTE FUNCTION detect_content_changes();

-- Enable Row Level Security (RLS)
ALTER TABLE public.scraped_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fetch_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_lock ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Read-only access for anon/authenticated users
CREATE POLICY "public_read_scraped_items" ON public.scraped_items
  FOR SELECT USING (true);

-- No public access to raw HTML (contains PII/sensitive data)
CREATE POLICY "no_public_raw" ON public.scrape_raw
  FOR SELECT USING (false);

-- No public access to fetch metadata
CREATE POLICY "no_public_fetch_meta" ON public.fetch_meta
  FOR SELECT USING (false);

-- No public access to job locks
CREATE POLICY "no_public_job_lock" ON public.job_lock
  FOR SELECT USING (false);

-- Service role has full access (handled by service key)
-- No additional policies needed as service role bypasses RLS

-- View for latest items (most recent per canonical URL)
CREATE OR REPLACE VIEW public.latest_scraped_items AS
SELECT DISTINCT ON (canonical_item_url) 
  id,
  source_domain,
  canonical_item_url,
  title,
  author,
  metadata,
  first_seen_at,
  last_seen_at,
  changed_at,
  created_at
FROM public.scraped_items
ORDER BY canonical_item_url, last_seen_at DESC;

-- Materialized view for analytics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.scraping_stats AS
SELECT 
  source_domain,
  COUNT(*) as total_items,
  COUNT(DISTINCT canonical_item_url) as unique_items,
  MIN(first_seen_at) as first_seen,
  MAX(last_seen_at) as last_seen,
  COUNT(CASE WHEN changed_at IS NOT NULL THEN 1 END) as items_with_changes,
  DATE_TRUNC('day', last_seen_at) as date
FROM public.scraped_items
GROUP BY source_domain, DATE_TRUNC('day', last_seen_at)
ORDER BY date DESC, source_domain;

-- Index on materialized view
CREATE INDEX IF NOT EXISTS idx_scraping_stats_domain_date 
  ON public.scraping_stats (source_domain, date);

-- Function to refresh stats (call from cron)
CREATE OR REPLACE FUNCTION refresh_scraping_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.scraping_stats;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for automated maintenance
CREATE OR REPLACE FUNCTION cleanup_old_scrape_data()
RETURNS TABLE(operation text, deleted_count bigint) AS $$
DECLARE
  raw_deleted bigint;
  expired_locks bigint;
  old_meta bigint;
BEGIN
  -- Clean raw HTML older than 30 days
  DELETE FROM public.scrape_raw 
  WHERE scraped_at < now() - interval '30 days';
  GET DIAGNOSTICS raw_deleted = ROW_COUNT;
  
  -- Clean expired job locks
  DELETE FROM public.job_lock 
  WHERE expires_at < now();
  GET DIAGNOSTICS expired_locks = ROW_COUNT;
  
  -- Clean fetch metadata older than 90 days
  DELETE FROM public.fetch_meta 
  WHERE updated_at < now() - interval '90 days';
  GET DIAGNOSTICS old_meta = ROW_COUNT;
  
  -- Return results
  RETURN QUERY VALUES 
    ('raw_html_cleanup', raw_deleted),
    ('expired_locks_cleanup', expired_locks),
    ('old_metadata_cleanup', old_meta);
END;
$$ LANGUAGE plpgsql;

-- Domain audit table for governance
CREATE TABLE IF NOT EXISTS public.domain_audit (
  domain text PRIMARY KEY,
  permission_basis text NOT NULL, -- 'robots_txt', 'api_terms', 'public_data', etc.
  contact_info text,
  notes text,
  approved_by text,
  approved_at timestamptz NOT NULL DEFAULT now(),
  review_at timestamptz,
  active boolean NOT NULL DEFAULT true
);

-- Insert initial allowlisted domains
INSERT INTO public.domain_audit (domain, permission_basis, notes) VALUES
  ('quotes.toscrape.com', 'public_scraping_sandbox', 'Test site designed for scraping practice'),
  ('books.toscrape.com', 'public_scraping_sandbox', 'Test site designed for scraping practice')
ON CONFLICT (domain) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.scraped_items IS 'Normalized, deduplicated scraped content with change tracking';
COMMENT ON TABLE public.scrape_raw IS 'Temporary raw HTML storage, auto-purged after 30 days';
COMMENT ON TABLE public.fetch_meta IS 'ETag and Last-Modified headers for conditional requests';
COMMENT ON TABLE public.job_lock IS 'Prevents concurrent scraping jobs';
COMMENT ON TABLE public.domain_audit IS 'Governance record for scraping permissions';

COMMENT ON COLUMN public.scraped_items.canonical_item_url IS 'Normalized URL without tracking params';
COMMENT ON COLUMN public.scraped_items.content_hash IS 'SHA-256 hash for change detection';
COMMENT ON COLUMN public.scraped_items.changed_at IS 'Last time content_hash changed';

-- Grant necessary permissions
GRANT SELECT ON public.latest_scraped_items TO anon, authenticated;
GRANT SELECT ON public.scraping_stats TO anon, authenticated;