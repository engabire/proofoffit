create or replace view public.impact_transparency_vw as
select
  ec.tier,
  count(distinct ec.id) as nonprofits_enrolled,
  count(distinct fg.id) as grants_issued,
  coalesce(sum(fg.consumed_amount), 0) as credits_consumed,
  coalesce(sum(fg.amount), 0) as credits_allocated,
  coalesce(sum(fg.unit_value * fg.consumed_amount), 0)::numeric as value_consumed
from public.eligibility_checks ec
left join public.fund_grants fg on fg.ngo_account_id = ec.id
group by ec.tier;

comment on view public.impact_transparency_vw is 'Tier-level summary of nonprofit enrollment and fund utilization.';
