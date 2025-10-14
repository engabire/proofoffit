create or replace view public.nonprofit_margin_vw as
select
  ec.id as eligibility_id,
  ec.org_name,
  ec.tier,
  coalesce(ec.discount_pct, 0) as discount_pct,
  fg.amount as grant_units,
  fg.unit_value,
  (fg.amount * fg.unit_value) as grant_value,
  fg.consumed_amount,
  greatest(fg.amount - fg.consumed_amount, 0) as remaining_units,
  ec.revalidation_at
from public.eligibility_checks ec
left join public.fund_grants fg on fg.ngo_account_id = ec.id;

comment on view public.nonprofit_margin_vw is 'Aggregates nonprofit eligibility and fund grant data for margin analysis.';
