-- unified jobs
create table if not exists jobs (
  id text primary key,
  company text not null,
  title text not null,
  description text,
  location text,
  remote boolean,
  salary_min numeric,
  salary_max numeric,
  currency text default 'USD',
  posted_at timestamptz not null,
  apply_url text,
  source text not null check (source in ('seed','manual','google','greenhouse','lever','ashby','recruitee','workable','smartrecruiters','adzuna','usajobs')),
  raw jsonb,
  flags jsonb default '{}'::jsonb
);

-- consent log
create table if not exists consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event text not null check (event in ('policy_accept','data_export','data_delete')),
  policy_version text not null,
  ip inet,
  created_at timestamptz not null default now()
);

-- policy registry
create table if not exists policy_registry (
  version text primary key,
  url text,
  published_at timestamptz
);

-- work events for reliability
create table if not exists work_event (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  employer_id uuid,
  job_id text,
  type text not null check (type in ('SHIFT_CHECKIN','SHIFT_CHECKOUT','CONTRACT_START','CONTRACT_END','FEEDBACK_SUBMITTED','REHIRE')),
  source text not null default 'self',
  signature bytea,
  prev_hash bytea,
  payload jsonb,
  ts timestamptz not null default now()
);

-- search audit
create table if not exists job_search_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  consent_id uuid references consent_events(id),
  query jsonb not null,
  provider text not null,
  result_count int not null,
  latency_ms int not null,
  created_at timestamptz not null default now()
);

-- meta table for structured extras
create table if not exists job_meta (
  job_id text references jobs(id) on delete cascade,
  key text not null,
  value jsonb,
  primary key (job_id, key)
);

-- helpful indexes
create index if not exists jobs_posted_at_idx on jobs(posted_at desc);
create index if not exists jobs_source_idx on jobs(source);

