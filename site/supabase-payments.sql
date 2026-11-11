-- The Wine Goat — payments (Stripe). Run once in Supabase → SQL Editor.
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  product text not null default 'level3',
  amount integer,            -- in the smallest unit (cents)
  currency text,
  stripe_session text unique,
  payment_intent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '12 months'),
  refunded boolean not null default false
);
create index if not exists purchases_user on public.purchases(user_id);
create index if not exists purchases_email on public.purchases(lower(email));
alter table public.purchases enable row level security;
-- each person can read only their own purchases; nobody can write from the browser (only the Stripe webhook, server side)
drop policy if exists "read own purchases" on public.purchases;
create policy "read own purchases" on public.purchases for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
