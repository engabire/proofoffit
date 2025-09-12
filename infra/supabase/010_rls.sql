-- Enable RLS on tenant-scoped tables and add baseline policies

alter table if exists tenants enable row level security;
alter table if exists users enable row level security;
alter table if exists candidate_profiles enable row level security;
alter table if exists jobs enable row level security;
alter table if exists employer_intakes enable row level security;
alter table if exists slates enable row level security;
alter table if exists applications enable row level security;
alter table if exists consents enable row level security;
alter table if exists action_log enable row level security;

-- Helper to extract JWT claims
create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true), '{}')::jsonb;
$$;

-- Tenant isolation policy example for candidate_profiles
create policy if not exists tenant_isolation_candidate_profiles on candidate_profiles
for select using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

create policy if not exists tenant_insert_candidate_profiles on candidate_profiles
for insert with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

create policy if not exists tenant_update_candidate_profiles on candidate_profiles
for update using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
) with check (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Read policy for jobs (public readable if desired). For MVP, allow read to all.
create policy if not exists jobs_read_all on jobs for select using (true);

-- ActionLog: read within tenant, no updates/deletes
create policy if not exists action_log_read on action_log for select using (
  (auth.jwt()->>'tenant_id') is not null and tenant_id = auth.jwt()->>'tenant_id'
);

-- Prevent modification via RLS in addition to rules
create policy if not exists action_log_block_update on action_log for update using (false);
create policy if not exists action_log_block_delete on action_log for delete using (false);