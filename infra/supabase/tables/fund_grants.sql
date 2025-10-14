create table if not exists public.fund_grants (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null,
  pool_id uuid,
  ngo_account_id uuid,
  type text not null check (type in ('verification', 'reach')),
  amount integer not null,
  consumed_amount integer not null default 0,
  unit_value numeric(10,2) not null,
  issued_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists fund_grants_donor_idx on public.fund_grants (donor_id);
create index if not exists fund_grants_ngo_idx on public.fund_grants (ngo_account_id);
create index if not exists fund_grants_type_idx on public.fund_grants (type);

drop trigger if exists set_fund_grants_updated_at on public.fund_grants;
create trigger set_fund_grants_updated_at
before update on public.fund_grants
for each row execute procedure public.set_updated_at();

comment on table public.fund_grants is 'Ledger of donor-funded verification and reach credits for nonprofits.';
comment on column public.fund_grants.unit_value is 'Monetary value per unit at time of grant issuance.';
