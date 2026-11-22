-- The Wine Goat — tabella public.profiles (profilo dell'utente scritto dall'app: soprannome, avatar, paese,
-- scuola, data d'esame, punti). Ognuno legge e scrive solo il proprio profilo. Usata anche da admin.sql.
-- Applicata al database il 22/11/2026. Si può rieseguire.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text, avatar text, nationality text, country text, school text, exam_date date, lang text,
  xp_total integer, xp_week integer, week text, streak integer, crowns integer,
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon;
grant select, insert, update on table public.profiles to authenticated;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles: own select') then
    create policy "profiles: own select" on public.profiles for select to authenticated using (user_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles: own insert') then
    create policy "profiles: own insert" on public.profiles for insert to authenticated with check (user_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles: own update') then
    create policy "profiles: own update" on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
  end if;
end $$;
