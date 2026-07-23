-- Phase 6: Wishlist schema
-- Run this in the Supabase SQL Editor.
-- Depends on public.set_updated_at() from 001_cafes_schema.sql.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'wishlist_priority') then
    create type public.wishlist_priority as enum ('must_visit', 'interested', 'someday');
  end if;
  if not exists (select 1 from pg_type where typname = 'wishlist_status') then
    create type public.wishlist_status as enum ('idea', 'planned', 'visited');
  end if;
end $$;

create table if not exists public.wishlist_cafes (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id) on delete set null,

  name text not null,
  priority public.wishlist_priority not null default 'interested',
  status public.wishlist_status not null default 'idea',
  notes text,
  estimated_budget numeric(10, 2),
  google_maps_url text,

  -- Set once this entry is converted into a real cafes row, so we can tell
  -- "visited" wishlist items apart from ones still waiting.
  converted_cafe_id uuid references public.cafes (id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wishlist_cafes enable row level security;

create index if not exists wishlist_cafes_status_idx on public.wishlist_cafes (status);
create index if not exists wishlist_cafes_priority_idx on public.wishlist_cafes (priority);

drop trigger if exists wishlist_cafes_set_updated_at on public.wishlist_cafes;
create trigger wishlist_cafes_set_updated_at
  before update on public.wishlist_cafes
  for each row execute procedure public.set_updated_at();

-- RLS: same simple "any authenticated user" approach as cafes for now.
create policy "Authenticated users can view wishlist"
  on public.wishlist_cafes for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can add wishlist entries"
  on public.wishlist_cafes for insert
  with check (auth.uid() = created_by);

create policy "Authenticated users can update wishlist entries"
  on public.wishlist_cafes for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete wishlist entries"
  on public.wishlist_cafes for delete
  using (auth.role() = 'authenticated');
