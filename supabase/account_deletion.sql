-- =====================================================================================================
-- The Wine Goat — "Elimina il mio account" (richiesto da Apple e da Google per le app con un account)
--
-- Da incollare UNA volta nel SQL Editor di Supabase (Dashboard > SQL Editor > New query) e poi "Run".
-- Si può rieseguire senza problemi. Non dipende da admin.sql: funziona anche se non l'hai ancora eseguito.
--
-- Cosa fa: aggiunge la funzione public.delete_my_account(email), che l'app chiama quando una persona,
-- dal proprio profilo, sceglie "Elimina il mio account" e riscrive la propria email per conferma.
-- La funzione cancella SOLO i dati di chi la chiama:
--   * le sue righe in tutte le tabelle di public che hanno una colonna user_id (user_docs, purchases, ...);
--   * il suo account in auth.users (con le sessioni e le identità collegate).
-- Non tocca i dati di nessun altro. I pagamenti restano registrati presso Stripe, Apple o Google, come
-- richiede la legge: qui viene cancellata solo la riga che dà l'accesso nell'app.
--
-- Sicurezza:
--   * SECURITY DEFINER con search_path vuoto; agisce solo su auth.uid(), cioè su chi è autenticato;
--   * richiede di riscrivere l'email dell'account: una chiamata per errore non cancella niente;
--   * non è eseguibile da "anon" né da "public", solo da utenti autenticati;
--   * un amministratore (tabella public.admins, se esiste) non può eliminarsi da qui: prima va tolto
--     dagli amministratori, per non restare senza accesso al pannello.
-- =====================================================================================================

create or replace function public.delete_my_account(p_confirm_email text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
  v_tab   record;
  v_n     integer;
  v_admin boolean := false;
  v_done  jsonb := '{}'::jsonb;
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  select u.email into v_email from auth.users u where u.id = v_uid;
  if not found then
    raise exception 'account not found';
  end if;
  if lower(coalesce(v_email, '')) <> lower(trim(coalesce(p_confirm_email, ''))) then
    raise exception 'confirmation email does not match' using errcode = '22023';
  end if;
  if to_regclass('public.admins') is not null then
    execute 'select exists (select 1 from public.admins a where a.user_id = $1)' into v_admin using v_uid;
    if v_admin then
      raise exception 'an administrator account cannot be deleted from the app' using errcode = '42501';
    end if;
  end if;

  for v_tab in
    select c.table_name
      from information_schema.columns c
      join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
     where c.table_schema = 'public' and c.column_name = 'user_id' and c.data_type = 'uuid'
       and t.table_type = 'BASE TABLE'
       and c.table_name not in ('admins', 'admin_audit_log')
  loop
    execute format('delete from public.%I where user_id = $1', v_tab.table_name) using v_uid;
    get diagnostics v_n = row_count;
    if v_n > 0 then v_done := v_done || jsonb_build_object(v_tab.table_name, v_n); end if;
  end loop;

  delete from auth.users u where u.id = v_uid;

  return jsonb_build_object('deleted', true, 'rows', v_done);
end $$;

do $$ begin
  if exists (select 1 from pg_roles where rolname = 'postgres') then
    alter function public.delete_my_account(text) owner to postgres;
  end if;
end $$;
revoke all on function public.delete_my_account(text) from public, anon;
grant execute on function public.delete_my_account(text) to authenticated;
