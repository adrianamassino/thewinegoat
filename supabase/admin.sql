-- =====================================================================================================
-- The Wine Goat — pannello di amministrazione (https://thewinegoat.com/admin/)
--
-- Da incollare UNA volta nel SQL Editor di Supabase (Dashboard > SQL Editor > New query) e poi "Run".
-- Si può rieseguire senza problemi: tutto è "create or replace" / "if not exists".
--
-- PRIMA DI ESEGUIRE: in fondo al file, sezione 9, sostituisci  LA-TUA-EMAIL  con l'email del TUO account
-- The Wine Goat (quello con cui accedi all'app). L'account deve già esistere.
--
-- Sicurezza:
--   * il sito usa solo la chiave "publishable": tutto ciò che è riservato è controllato QUI, nel database;
--   * ogni funzione admin_* è SECURITY DEFINER, con search_path vuoto, e come prima cosa verifica is_admin():
--     chi non è nella tabella public.admins riceve l'errore "not authorised";
--   * le funzioni sono eseguibili solo da utenti autenticati (non da "anon", non da "public");
--   * le tabelle admins e admin_audit_log non sono leggibili né scrivibili dal sito (RLS attiva, nessuna policy);
--   * gli utenti normali possono solo LEGGERE i propri acquisti; nessuno può scriverli dal browser.
--
-- Accessi concessi a mano: sono righe di public.purchases con source = 'admin'. L'app legge già
-- public.purchases (refunded = false, expires_at nel futuro) per sbloccare l'accesso completo, quindi un
-- accesso concesso qui funziona sul sito e nelle app come un acquisto. Il Livello 1 resta sempre gratuito.
-- =====================================================================================================


-- 1. Tabelle di amministrazione ------------------------------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on table public.admins from anon, authenticated;

create table if not exists public.admin_audit_log (
  id           bigint generated always as identity primary key,
  at           timestamptz not null default now(),
  admin_id     uuid,
  admin_email  text,
  action       text not null,
  target_user  uuid,
  target_email text,
  details      jsonb not null default '{}'::jsonb
);
create index if not exists admin_audit_log_at_idx on public.admin_audit_log (at desc);
alter table public.admin_audit_log enable row level security;
revoke all on table public.admin_audit_log from anon, authenticated;


-- 2. Acquisti / diritti di accesso (tabella già usata dall'app e dai webhook Stripe e RevenueCat) -------
-- Se la tabella esiste già non viene toccata; si aggiungono solo le colonne mancanti (compatibile all'indietro).

create table if not exists public.purchases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  expires_at  timestamptz not null,
  refunded    boolean not null default false,
  source      text,
  external_id text unique,
  note        text,
  created_at  timestamptz default now()
);
alter table public.purchases add column if not exists source      text;
alter table public.purchases add column if not exists external_id text unique;
alter table public.purchases add column if not exists note        text;
alter table public.purchases add column if not exists created_at  timestamptz;
alter table public.purchases alter column created_at set default now();
-- identificativo di riga, serve al pannello per modificare un singolo diritto (riempito per le righe esistenti)
alter table public.purchases add column if not exists id uuid default gen_random_uuid();
create index if not exists purchases_user_id_idx on public.purchases (user_id);

-- RLS rigorosa: ognuno legge solo i propri acquisti; nessuna scrittura dal browser
-- (Stripe e RevenueCat scrivono lato server con la service role, che ignora la RLS).
alter table public.purchases enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'purchases'
                 and policyname = 'purchases: read own') then
    create policy "purchases: read own" on public.purchases for select to authenticated
      using (user_id = (select auth.uid()));
  end if;
end $$;
revoke insert, update, delete, truncate on table public.purchases from anon, authenticated;


-- 3. is_admin() -----------------------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
     and exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- registro delle azioni (uso interno, non esposto)
create or replace function public._admin_log(p_action text, p_target uuid, p_target_email text, p_details jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.admin_audit_log (admin_id, admin_email, action, target_user, target_email, details)
  values (auth.uid(), (select u.email from auth.users u where u.id = auth.uid()),
          p_action, p_target, p_target_email, coalesce(p_details, '{}'::jsonb));
end $$;


-- 4. Elenco utenti con profilo, livello, progressi, pagamenti -------------------------------------------
-- Restituisce un array JSON, un oggetto per utente.

create or replace function public.admin_list_users()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_out jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;

  with pr as (                                -- profilo pubblico (classifica)
    select p.user_id, to_jsonb(p) as j from public.profiles p
  ),
  docs as (                                   -- documenti salvati dall'app
    select d.user_id,
           max(d.updated_at)                                         as docs_updated,
           (array_agg(d.data) filter (where d.doc_id = 'profile'))[1]  as prof_doc,
           (array_agg(d.data) filter (where d.doc_id = 'progress'))[1] as prog_doc
    from public.user_docs d
    group by d.user_id
  ),
  pu as (                                     -- acquisti e accessi concessi
    select p.user_id,
           jsonb_agg(to_jsonb(p) order by p.expires_at desc) as rows,
           max(p.expires_at) filter (where not coalesce(p.refunded, false))                        as until_any,
           max(p.expires_at) filter (where not coalesce(p.refunded, false)
                                     and coalesce(p.source, 'stripe') <> 'admin')                  as until_paid,
           max(p.expires_at) filter (where not coalesce(p.refunded, false) and p.source = 'admin') as until_grant,
           bool_or(coalesce(p.source, 'stripe') <> 'admin')                                        as ever_paid
    from public.purchases p
    where p.user_id is not null
    group by p.user_id
  )
  select coalesce(jsonb_agg(row_obj order by created_at desc), '[]'::jsonb) into v_out
  from (
    select u.created_at,
      jsonb_build_object(
        'id',              u.id,
        'email',           u.email,
        'created_at',      u.created_at,
        'confirmed_at',    coalesce(u.email_confirmed_at, u.confirmed_at),
        'last_sign_in_at', u.last_sign_in_at,
        'providers',       coalesce(u.raw_app_meta_data -> 'providers', '[]'::jsonb),
        'name',            coalesce(nullif(pr.j ->> 'nickname', ''), u.raw_user_meta_data ->> 'full_name',
                                    u.raw_user_meta_data ->> 'name'),
        'lang',            coalesce(pr.j ->> 'lang', u.raw_user_meta_data ->> 'lang'),
        'level',           docs.prof_doc ->> 'lvl',
        'country',         pr.j ->> 'country',
        'nationality',     pr.j ->> 'nationality',
        'school',          pr.j ->> 'school',
        'exam_date',       pr.j ->> 'exam_date',
        'xp_total',        pr.j -> 'xp_total',
        'streak',          pr.j -> 'streak',
        'crowns',          pr.j -> 'crowns',
        'answered',        (select count(*) from jsonb_object_keys(
                              case when jsonb_typeof(docs.prog_doc -> 'q') = 'object'
                                   then docs.prog_doc -> 'q' else '{}'::jsonb end)),
        'attempts',        (select coalesce(sum(case when jsonb_typeof(v) = 'array' then (v ->> 0)::numeric end), 0)
                              from jsonb_each(case when jsonb_typeof(docs.prog_doc -> 'q') = 'object'
                                                   then docs.prog_doc -> 'q' else '{}'::jsonb end) as e(k, v)),
        'correct',         (select coalesce(sum(case when jsonb_typeof(v) = 'array' then (v ->> 1)::numeric end), 0)
                              from jsonb_each(case when jsonb_typeof(docs.prog_doc -> 'q') = 'object'
                                                   then docs.prog_doc -> 'q' else '{}'::jsonb end) as e(k, v)),
        'last_activity',   greatest(u.last_sign_in_at, (pr.j ->> 'updated_at')::timestamptz, docs.docs_updated),
        'purchases',       coalesce(pu.rows, '[]'::jsonb),
        'access_until',    pu.until_any,
        'paid_until',      pu.until_paid,
        'grant_until',     pu.until_grant,
        'ever_paid',       coalesce(pu.ever_paid, false),
        'is_admin',        exists (select 1 from public.admins a where a.user_id = u.id)
      ) as row_obj
    from auth.users u
    left join pr   on pr.user_id   = u.id
    left join docs on docs.user_id = u.id
    left join pu   on pu.user_id   = u.id
  ) t;

  return v_out;
end $$;


-- 5. Concedere / estendere l'accesso completo -----------------------------------------------------------
-- p_days = null  -> per sempre (fino al 31/12/2999)
-- p_days = N     -> N giorni, a partire dalla scadenza attuale se l'utente ha già un accesso attivo
--                   (p_from_current = true), altrimenti da adesso.

create or replace function public.admin_grant_access(p_user_id uuid, p_days integer default null,
                                                     p_note text default null, p_from_current boolean default true)
returns timestamptz
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_base  timestamptz := now();
  v_until timestamptz;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  select u.email into v_email from auth.users u where u.id = p_user_id;
  if not found then raise exception 'user not found'; end if;
  if p_days is not null and (p_days < 1 or p_days > 36500) then raise exception 'invalid number of days'; end if;

  if p_days is null then
    v_until := timestamptz '2999-12-31 00:00:00+00';
  else
    if p_from_current then
      select greatest(now(), coalesce(max(p.expires_at), now())) into v_base
      from public.purchases p where p.user_id = p_user_id and not coalesce(p.refunded, false);
      if v_base > timestamptz '2999-01-01 00:00:00+00' then v_base := now(); end if;
    end if;
    v_until := v_base + make_interval(days => p_days);
  end if;

  insert into public.purchases (user_id, expires_at, refunded, source, external_id, note)
  values (p_user_id, v_until, false, 'admin', 'admin:' || gen_random_uuid()::text, nullif(left(p_note, 500), ''));

  perform public._admin_log('grant', p_user_id, v_email,
    jsonb_build_object('days', p_days, 'until', v_until, 'note', p_note));
  return v_until;
end $$;


-- 6. Revocare l'accesso ----------------------------------------------------------------------------------
-- p_include_paid = false -> chiude solo gli accessi concessi a mano (source = 'admin')
-- p_include_paid = true  -> chiude anche gli acquisti Stripe / Apple / Google (la scadenza diventa "adesso";
--                           la riga resta, con la scadenza originale annotata nel registro)

create or replace function public.admin_revoke_access(p_user_id uuid, p_include_paid boolean default false)
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_old   jsonb;
  v_n     integer;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  select u.email into v_email from auth.users u where u.id = p_user_id;

  select coalesce(jsonb_agg(to_jsonb(p)), '[]'::jsonb) into v_old
  from public.purchases p
  where p.user_id = p_user_id and not coalesce(p.refunded, false) and p.expires_at > now()
    and (p_include_paid or p.source = 'admin');

  update public.purchases p
     set expires_at = now(),
         note = left(concat_ws(' · ', nullif(p.note, ''), 'revocato ' || to_char(now(), 'YYYY-MM-DD')), 500)
   where p.user_id = p_user_id and not coalesce(p.refunded, false) and p.expires_at > now()
     and (p_include_paid or p.source = 'admin');
  get diagnostics v_n = row_count;

  perform public._admin_log('revoke', p_user_id, v_email,
    jsonb_build_object('include_paid', p_include_paid, 'rows', v_n, 'before', v_old));
  return v_n;
end $$;


-- 7. Modificare / eliminare una singola riga di diritto ---------------------------------------------------

create or replace function public.admin_update_purchase(p_purchase_id text, p_expires_at timestamptz,
                                                        p_refunded boolean, p_note text default null)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_old jsonb;
  v_uid uuid;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  if p_expires_at is null then raise exception 'expiry date required'; end if;

  select to_jsonb(p), p.user_id into v_old, v_uid from public.purchases p where p.id::text = p_purchase_id;
  if not found then raise exception 'purchase not found'; end if;

  update public.purchases p
     set expires_at = p_expires_at,
         refunded   = coalesce(p_refunded, false),
         note       = nullif(left(p_note, 500), '')
   where p.id::text = p_purchase_id;

  perform public._admin_log('update_purchase', v_uid, (select u.email from auth.users u where u.id = v_uid),
    jsonb_build_object('purchase_id', p_purchase_id, 'before', v_old,
                       'after', jsonb_build_object('expires_at', p_expires_at, 'refunded', p_refunded, 'note', p_note)));
end $$;

-- solo per gli accessi concessi a mano: gli acquisti veri non si cancellano (si possono modificare o revocare)
create or replace function public.admin_delete_grant(p_purchase_id text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_old jsonb;
  v_uid uuid;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  select to_jsonb(p), p.user_id into v_old, v_uid from public.purchases p
   where p.id::text = p_purchase_id and p.source = 'admin';
  if not found then raise exception 'only manual grants (source = admin) can be deleted'; end if;

  delete from public.purchases p where p.id::text = p_purchase_id and p.source = 'admin';
  perform public._admin_log('delete_grant', v_uid, (select u.email from auth.users u where u.id = v_uid),
    jsonb_build_object('before', v_old));
end $$;


-- 8. Eliminare un utente (account + tutti i suoi dati) -----------------------------------------------------
-- p_confirm_email deve essere identica all'email dell'utente (protezione contro gli errori).
-- Cancella le righe con user_id = utente in TUTTE le tabelle di public (user_docs, profiles, purchases, ...),
-- tranne admins e admin_audit_log, poi l'account in auth.users. Gli amministratori non si possono eliminare.

create or replace function public.admin_delete_user(p_user_id uuid, p_confirm_email text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_tab   record;
  v_n     integer;
  v_done  jsonb := '{}'::jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  select u.email into v_email from auth.users u where u.id = p_user_id;
  if not found then raise exception 'user not found'; end if;
  if lower(coalesce(v_email, '')) <> lower(trim(coalesce(p_confirm_email, ''))) then
    raise exception 'confirmation email does not match';
  end if;
  if p_user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = p_user_id) then
    raise exception 'an administrator cannot be deleted from the panel';
  end if;

  for v_tab in
    select c.table_name
      from information_schema.columns c
      join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
     where c.table_schema = 'public' and c.column_name = 'user_id' and c.data_type = 'uuid'
       and t.table_type = 'BASE TABLE'
       and c.table_name not in ('admins', 'admin_audit_log')
  loop
    execute format('delete from public.%I where user_id = $1', v_tab.table_name) using p_user_id;
    get diagnostics v_n = row_count;
    if v_n > 0 then v_done := v_done || jsonb_build_object(v_tab.table_name, v_n); end if;
  end loop;

  delete from auth.users u where u.id = p_user_id;

  perform public._admin_log('delete_user', p_user_id, v_email, jsonb_build_object('deleted_rows', v_done));
  return v_done;
end $$;


-- 9. Registro delle azioni ---------------------------------------------------------------------------------

create or replace function public.admin_list_audit(p_limit integer default 200)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare v_out jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  select coalesce(jsonb_agg(to_jsonb(l) order by l.at desc), '[]'::jsonb) into v_out
  from (select * from public.admin_audit_log order by at desc limit least(greatest(coalesce(p_limit, 200), 1), 2000)) l;
  return v_out;
end $$;


-- 10. Proprietario e permessi delle funzioni ---------------------------------------------------------------
-- (proprietario postgres: serve per poter cancellare da auth.users; esecuzione solo per utenti autenticati)

do $$
declare f text;
begin
  foreach f in array array[
    'public.is_admin()',
    'public._admin_log(text, uuid, text, jsonb)',
    'public.admin_list_users()',
    'public.admin_grant_access(uuid, integer, text, boolean)',
    'public.admin_revoke_access(uuid, boolean)',
    'public.admin_update_purchase(text, timestamptz, boolean, text)',
    'public.admin_delete_grant(text)',
    'public.admin_delete_user(uuid, text)',
    'public.admin_list_audit(integer)'
  ] loop
    if exists (select 1 from pg_roles where rolname = 'postgres') then
      execute format('alter function %s owner to postgres', f);
    end if;
    execute format('revoke all on function %s from public, anon', f);
    if f <> 'public._admin_log(text, uuid, text, jsonb)' then
      execute format('grant execute on function %s to authenticated', f);
    end if;
  end loop;
end $$;
-- _admin_log non è eseguibile da nessuno dal sito: solo dalle altre funzioni
revoke all on function public._admin_log(text, uuid, text, jsonb) from authenticated;


-- 11. IL TUO ACCOUNT AMMINISTRATORE ------------------------------------------------------------------------
-- >>> Sostituisci LA-TUA-EMAIL con l'email del tuo account The Wine Goat (lascia gli apici). <<<
-- L'account deve già esistere (crealo prima nell'app, se serve). Se l'email non corrisponde a nessun
-- account, non viene aggiunto niente e compare l'avviso "NESSUN AMMINISTRATORE AGGIUNTO".

insert into public.admins (user_id, email)
select u.id, u.email from auth.users u where lower(u.email) = lower('LA-TUA-EMAIL')
on conflict (user_id) do nothing;

do $$ begin
  if not exists (select 1 from public.admins) then
    raise warning 'NESSUN AMMINISTRATORE AGGIUNTO: controlla l''email nella sezione 11 (deve essere quella di un account esistente).';
  end if;
end $$;
