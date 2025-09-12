-- Immutable ActionLog with hash-chaining
create or replace function actionlog_hash() returns trigger as $$
declare prev bytea; cur bytea;
begin
  select hash from action_log where id = (
    select max(id) from action_log where tenant_id = new.tenant_id
  ) into prev;
  cur := digest(coalesce(prev,'') || new.payload_hash || new.ts::text::bytea, 'sha256');
  new.prev_hash := prev; new.hash := cur; return new;
end; $$ language plpgsql;

create or replace trigger actionlog_hash_trg before insert on action_log
for each row execute function actionlog_hash();

-- Prevent updates/deletes
create or replace rule no_update as on update to action_log do instead nothing;
create or replace rule no_delete as on delete to action_log do instead nothing;