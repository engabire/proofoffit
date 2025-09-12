-- Complete RLS policies for all tenant-scoped tables

-- Users: can read/update own record within tenant
create policy if not exists users_tenant_isolation on users
for all using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Employer intakes: tenant isolation
create policy if not exists employer_intakes_tenant_isolation on employer_intakes
for all using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Slates: tenant isolation
create policy if not exists slates_tenant_isolation on slates
for all using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Applications: tenant isolation
create policy if not exists applications_tenant_isolation on applications
for all using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Consents: tenant isolation
create policy if not exists consents_tenant_isolation on consents
for all using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Tenants: users can read their own tenant
create policy if not exists tenants_read_own on tenants
for select using (
  (auth.jwt()->>'tenant_id') is not null and id = auth.jwt()->>'tenant_id'
);

-- Credentials: through candidate profile
create policy if not exists credentials_tenant_isolation on credentials
for all using (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = credentials.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
) with check (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = credentials.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
);

-- Bullets: through candidate profile
create policy if not exists bullets_tenant_isolation on bullets
for all using (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = bullets.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
) with check (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = bullets.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
);

-- Artifacts: through candidate profile
create policy if not exists artifacts_tenant_isolation on artifacts
for all using (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = artifacts.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
) with check (
  exists (
    select 1 from candidate_profiles cp
    where cp.id = artifacts.candidate_id
    and cp.tenant_id = auth.jwt()->>'tenant_id'
  )
);

-- Embeddings: public read for semantic search, tenant-scoped write
create policy if not exists embeddings_read_all on embeddings for select using (true);
create policy if not exists embeddings_write_tenant on embeddings
for insert with check (
  (auth.jwt()->>'tenant_id') is not null
);

-- Criteria nodes: public read (shared taxonomy)
create policy if not exists criteria_nodes_read_all on criteria_nodes for select using (true);

-- Policy sources: public read
create policy if not exists policy_sources_read_all on policy_sources for select using (true);