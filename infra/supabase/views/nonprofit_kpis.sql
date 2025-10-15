create or replace view public.nonprofit_kpis_vw as
with tier_totals as (
  select
    ec.tier,
    coalesce(sum(fg.consumed_amount), 0) as credits_consumed,
    coalesce(sum(fg.amount), 0) as credits_allocated,
    coalesce(sum(fg.unit_value * fg.consumed_amount), 0)::numeric as funded_value,
    coalesce(avg(ec.discount_pct), 0)::numeric as avg_discount_pct
  from public.eligibility_checks ec
  left join public.fund_grants fg on fg.ngo_account_id = ec.id
  group by ec.tier
)
select
  tier,
  credits_consumed,
  credits_allocated,
  funded_value,
  avg_discount_pct,
  case when credits_allocated = 0 then 0 else credits_consumed::numeric / credits_allocated end as donor_coverage_pct,
  0::numeric as iei_score,
  0::numeric as nonprofit_nrr
from tier_totals;

comment on view public.nonprofit_kpis_vw is 'Aggregated KPIs for nonprofit tiers (placeholder columns for IEI and NRR pending data integration).';
