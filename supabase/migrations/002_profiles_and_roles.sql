-- Roles foundation (RBAC groundwork)
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

-- 1. Role enum — an invalid role becomes a schema-level impossibility,
-- not just something a check constraint catches at insert time.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'member', 'guest');
  end if;
end $$;

-- 2. Profiles table — one row per auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
-- (set_updated_at() was already created by the Phase 4 cafes migration.)

-- 3. Trigger: auto-create a profile row (as 'member') whenever someone registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Central role-check helper — every future RLS policy that needs to know
-- "is this caller an admin?" calls this one function instead of repeating
-- the same subquery on every table.
create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 5. RLS policies.
-- Both of you can see both profiles — small private app, no reason to hide it.
create policy "Profiles are viewable by any signed-in user"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Deliberately NO update/insert/delete policy here for regular users.
-- That means `role` can only ever change via SQL run directly by you as the
-- project owner (step 6 below) — never from the app itself, so there is no
-- client-side path to self-promote to admin.

-- 6. Promote yourself to admin (run manually, once, after you've registered):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
