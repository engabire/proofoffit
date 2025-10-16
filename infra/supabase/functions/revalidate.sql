create or replace function public.process_nonprofit_revalidation()
returns table (
  eligibility_id uuid,
  org_name text,
  status nonprofit_eligibility_status,
  days_until_revalidation integer
)
language plpgsql
as $$
declare
  cutoff timestamptz := timezone('utc', now());
begin
  update public.eligibility_checks
  set status = 'review',
      auto_verified = false,
      updated_at = timezone('utc', now())
  where revalidation_at is not null
    and revalidation_at <= cutoff
    and status = 'eligible';

  return query
  select
    ec.id,
    ec.org_name,
    ec.status,
    greatest(0, floor(extract(epoch from (ec.revalidation_at - cutoff)) / 86400))::int
  from public.eligibility_checks ec
  where ec.revalidation_at is not null
    and ec.revalidation_at <= cutoff + interval '60 days';
end;
$$;

comment on function public.process_nonprofit_revalidation() is 'Updates eligibility statuses past revalidation date and returns organizations within 60-day warning window.';
