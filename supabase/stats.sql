-- =====================================================================================================
-- The Wine Goat — statistiche anonime (visite, test, registrazioni, clic sull'acquisto) per lingua.
--
-- Niente cookie, niente indirizzi IP, niente identificativi del visitatore: ogni riga è un evento anonimo
-- (che cosa, quando, lingua della pagina, percorso, provenienza). Si contano le visite, non le persone.
-- Il sito scrive SOLO attraverso twg_track(); la tabella non è leggibile né scrivibile dal browser.
-- La lettura passa da admin_stats(), riservata agli amministratori (vedi admin.sql).
-- Si può rieseguire senza problemi.
-- =====================================================================================================

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on table public.admins from anon, authenticated;

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
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.twg_events (
  id    bigint generated always as identity primary key,
  at    timestamptz not null default now(),
  ev    text not null,          -- view | quiz_start | quiz_done | signup | buy_click
  lang  text not null,          -- lingua della pagina (en, it, es-ar, ...)
  path  text not null,          -- percorso senza parametri (/it/wset-livello-2/)
  src   text not null,          -- google | bing | other-search | instagram | social | ai | site | direct | internal
  entry boolean not null default false,   -- true = prima pagina della visita (arrivo da fuori)
  extra text                    -- per i test: tema (wine, beer, ...); per l'app: livello
);
create index if not exists twg_events_at_idx on public.twg_events (at);
alter table public.twg_events enable row level security;
revoke all on table public.twg_events from anon, authenticated;

create or replace function public.twg_track(p_ev text, p_lang text, p_path text, p_src text, p_entry boolean default false, p_extra text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_ev is null or p_ev not in ('view', 'quiz_start', 'quiz_done', 'signup', 'buy_click') then return; end if;
  if p_lang is null or p_lang !~ '^[a-z]{2}(-[a-z]{2,4})?$' then return; end if;
  if p_path is null or p_path !~ '^/[A-Za-z0-9/_.%-]{0,200}$' then return; end if;
  if p_src is null or p_src not in ('google', 'bing', 'other-search', 'instagram', 'social', 'ai', 'site', 'direct', 'internal') then return; end if;
  if p_extra is not null and p_extra !~ '^[a-z0-9_-]{1,24}$' then p_extra := null; end if;
  insert into public.twg_events (ev, lang, path, src, entry, extra)
  values (p_ev, p_lang, p_path, p_src, coalesce(p_entry, false), p_extra);
end $$;
revoke all on function public.twg_track(text, text, text, text, boolean, text) from public;
grant execute on function public.twg_track(text, text, text, text, boolean, text) to anon, authenticated;

-- Riepilogo per il pannello di amministrazione: ultimi p_days giorni.
create or replace function public.admin_stats(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare d integer := least(greatest(coalesce(p_days, 30), 1), 365); since timestamptz;
begin
  if not public.is_admin() then raise exception 'not authorised'; end if;
  since := now() - make_interval(days => d);
  return jsonb_build_object(
    'days', d,
    'by_lang', coalesce((select jsonb_agg(x order by (x->>'visits')::int desc) from (
      select jsonb_build_object('lang', lang,
        'visits',     count(*) filter (where ev = 'view' and entry),
        'views',      count(*) filter (where ev = 'view'),
        'search',     count(*) filter (where ev = 'view' and entry and src in ('google', 'bing', 'other-search')),
        'quiz_start', count(*) filter (where ev = 'quiz_start'),
        'quiz_done',  count(*) filter (where ev = 'quiz_done'),
        'signup',     count(*) filter (where ev = 'signup'),
        'buy_click',  count(*) filter (where ev = 'buy_click')) x
      from public.twg_events where at >= since group by lang) t), '[]'::jsonb),
    'by_src', coalesce((select jsonb_agg(jsonb_build_object('src', src, 'visits', n) order by n desc) from (
      select src, count(*) n from public.twg_events where at >= since and ev = 'view' and entry group by src) t), '[]'::jsonb),
    'by_day', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'visits', v, 'quiz_start', qs, 'signup', su) order by day) from (
      select (at at time zone 'Europe/Rome')::date as day,
        count(*) filter (where ev = 'view' and entry) v, count(*) filter (where ev = 'quiz_start') qs, count(*) filter (where ev = 'signup') su
      from public.twg_events where at >= since group by 1) t), '[]'::jsonb),
    'top_entry', coalesce((select jsonb_agg(jsonb_build_object('path', path, 'visits', n, 'search', s) order by n desc) from (
      select path, count(*) n, count(*) filter (where src in ('google', 'bing', 'other-search')) s
      from public.twg_events where at >= since and ev = 'view' and entry group by path order by 2 desc limit 40) t), '[]'::jsonb)
  );
end $$;
revoke all on function public.admin_stats(integer) from public, anon;
grant execute on function public.admin_stats(integer) to authenticated;
