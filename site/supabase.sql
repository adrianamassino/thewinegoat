-- The Wine Goat: one table that keeps each user's progress (quiz results, plan, notes) in the cloud.
-- Run once in Supabase → SQL Editor → New query → Run.
create table if not exists public.user_docs (
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, doc_id)
);
alter table public.user_docs enable row level security;
drop policy if exists "own rows" on public.user_docs;
create policy "own rows" on public.user_docs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
