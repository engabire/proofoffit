create type nonprofit_eligibility_status as enum ('eligible', 'review', 'denied');

create table if not exists public.eligibility_checks (
  id uuid primary key default gen_random_uuid(),
  org_name text not null,
  ein_hash text not null unique,
  ein_last4 char(4) not null,
  status nonprofit_eligibility_status not null default 'review',
  tier text check (tier in ('N1', 'N2', 'N3', 'N4')),
  discount_pct numeric(5,2),
  auto_verified boolean not null default false,
  safeguarding_policy_url text,
  served_populations text[],
  source jsonb,
  reviewed_by uuid,
  revalidation_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists eligibility_checks_status_idx on public.eligibility_checks (status);
create index if not exists eligibility_checks_revalidation_idx on public.eligibility_checks (revalidation_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_eligibility_checks_updated_at on public.eligibility_checks;
create trigger set_eligibility_checks_updated_at
before update on public.eligibility_checks
for each row execute procedure public.set_updated_at();

comment on table public.eligibility_checks is 'Stores nonprofit eligibility decisions and revalidation windows.';
comment on column public.eligibility_checks.ein_hash is 'SHA-256 hash of EIN; last four stored separately for audit.';
comment on column public.eligibility_checks.source is 'Metadata including IRS/GuideStar payloads and attestation artifacts.';
