-- Gifting tables and policies

-- Gift codes a sponsor can buy and a candidate can redeem
create table if not exists public.gift_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  months int not null check (months between 1 and 6),
  currency text not null default 'USD',
  amount_cents int not null check (amount_cents > 0),
  status text not null check (status in ('active','redeemed','expired')) default 'active',
  sponsor_user_id uuid references auth.users(id) on delete set null,
  recipient_email text,
  message text,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz not null default now() + interval '12 months',
  created_at timestamptz not null default now(),
  stripe_coupon_id text,
  stripe_promotion_code_id text,
  stripe_subscription_id text
);

create index if not exists gift_codes_status_idx on public.gift_codes(status);
create unique index if not exists gift_codes_active_redeemed_by_idx
  on public.gift_codes(redeemed_by)
  where status = 'active' and redeemed_by is not null;

-- Optional: community pool for bulk donations
create table if not exists public.sponsor_pool (
  id uuid primary key default gen_random_uuid(),
  sponsor_user_id uuid references auth.users(id) on delete cascade,
  amount_cents int not null check (amount_cents >= 0),
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table if exists public.gift_codes enable row level security;
alter table if exists public.sponsor_pool enable row level security;

-- RLS policies for gift_codes
create policy if not exists gift_codes_owner_select on public.gift_codes
for select using (
  auth.uid() = sponsor_user_id
  or auth.uid() = redeemed_by
  or auth.role() = 'service_role'
);

create policy if not exists gift_codes_owner_update on public.gift_codes
for update using (
  auth.uid() = sponsor_user_id or auth.role() = 'service_role'
) with check (
  auth.uid() = sponsor_user_id or auth.role() = 'service_role'
);

create policy if not exists gift_codes_service_insert on public.gift_codes
for insert with check (auth.role() = 'service_role');

-- Allow service role deletes (for administrative cleanup)
create policy if not exists gift_codes_service_delete on public.gift_codes
for delete using (auth.role() = 'service_role');

-- Sponsor pool policies
create policy if not exists sponsor_pool_owner_all on public.sponsor_pool
for all using (
  auth.uid() = sponsor_user_id or auth.role() = 'service_role'
) with check (
  auth.uid() = sponsor_user_id or auth.role() = 'service_role'
);

-- Gift code lookup helper for anonymous redemption forms
create or replace function public.lookup_gift_code(p_code text)
returns table (
  code text,
  status text,
  expires_at timestamptz,
  months int,
  recipient_email text
) language sql
security definer
set search_path = public
as $$
  select
    gift_codes.code,
    gift_codes.status,
    gift_codes.expires_at,
    gift_codes.months,
    gift_codes.recipient_email
  from public.gift_codes
  where gift_codes.code = p_code;
$$;

revoke all on function public.lookup_gift_code(text) from public;
grant execute on function public.lookup_gift_code(text) to anon, authenticated;

-- Nightly job to expire unused gift codes
do $$
begin
  if not exists (select 1 from cron.job where jobname = 'expire_gift_codes') then
    perform cron.schedule(
      'expire_gift_codes',
      '0 3 * * *',
      $$update public.gift_codes
        set status = 'expired'
      where status = 'active'
        and expires_at < now();$$
    );
  end if;
end $$;
