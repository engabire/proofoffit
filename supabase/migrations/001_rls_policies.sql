-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_proof_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Proofs table policies
CREATE POLICY "Users can manage own proofs" ON proofs
  FOR ALL USING (auth.uid() = user_id);

-- Targets table policies
CREATE POLICY "Users can manage own targets" ON targets
  FOR ALL USING (auth.uid() = user_id AND NOT is_deleted);

CREATE POLICY "Users can view own deleted targets" ON targets
  FOR SELECT USING (auth.uid() = user_id);

-- Target proof weights policies
CREATE POLICY "Users can manage own target proof weights" ON target_proof_weights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM targets 
      WHERE targets.id = target_proof_weights.target_id 
      AND targets.user_id = auth.uid()
    )
  );

-- Audit links policies
CREATE POLICY "Users can manage own audit links" ON audit_links
  FOR ALL USING (auth.uid() = user_id);

-- Audit views policies (no public access - server only)
CREATE POLICY "No public access to audit views" ON audit_views
  FOR ALL USING (false);

-- Claim logs policies
CREATE POLICY "Users can view own claim logs" ON claim_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own claim logs" ON claim_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role policies (for server-side operations)
CREATE POLICY "Service role can manage all data" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON proofs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON targets
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON target_proof_weights
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON audit_links
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON audit_views
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON claim_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all data" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proofs_user_id ON proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_targets_user_id_is_deleted ON targets(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_audit_links_token ON audit_links(token);
CREATE INDEX IF NOT EXISTS idx_audit_links_user_id ON audit_links(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_views_audit_link_id ON audit_views(audit_link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_claim_logs_user_id ON claim_logs(user_id);




