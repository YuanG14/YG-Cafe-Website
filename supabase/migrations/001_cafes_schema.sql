-- Phase 4: Cafe Collection schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--
-- Note on access control: this migration keeps RLS deliberately simple —
-- any authenticated user can read/write any cafe. `created_by` is still
-- recorded on every row so the future RBAC phase can add ownership-aware
-- policies (e.g. "members can only edit their own") without a schema
-- change, just new policies.

-- 1. Cafes table.
create table if not exists public.cafes (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id) on delete set null,

  name text not null,
  address text,
  google_maps_url text,
  date_visited date not null default current_date,

  is_favorite boolean not null default false,
  tags text[] not null default '{}',

  journal_entry text,
  drinks_ordered text[] not null default '{}',
  food_ordered text[] not null default '{}',
  total_spent numeric(10, 2),

  rating_overall smallint not null default 0 check (rating_overall between 0 and 5),
  rating_coffee smallint not null default 0 check (rating_coffee between 0 and 5),
  rating_food smallint not null default 0 check (rating_food between 0 and 5),
  rating_ambiance smallint not null default 0 check (rating_ambiance between 0 and 5),
  rating_service smallint not null default 0 check (rating_service between 0 and 5),
  rating_value smallint not null default 0 check (rating_value between 0 and 5),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cafes enable row level security;

create index if not exists cafes_date_visited_idx on public.cafes (date_visited desc);
create index if not exists cafes_created_by_idx on public.cafes (created_by);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cafes_set_updated_at on public.cafes;
create trigger cafes_set_updated_at
  before update on public.cafes
  for each row execute procedure public.set_updated_at();

-- RLS: any authenticated user can read and write. Tighten with role-aware
-- policies in the RBAC phase (ownership + admin override).
create policy "Authenticated users can view cafes"
  on public.cafes for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can add cafes"
  on public.cafes for insert
  with check (auth.uid() = created_by);

create policy "Authenticated users can update cafes"
  on public.cafes for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafes"
  on public.cafes for delete
  using (auth.role() = 'authenticated');

-- 2. Photos table — one cafe has many photos.
create table if not exists public.cafe_photos (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes (id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table public.cafe_photos enable row level security;

create index if not exists cafe_photos_cafe_id_idx on public.cafe_photos (cafe_id);

create policy "Authenticated users can view cafe photos"
  on public.cafe_photos for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can add cafe photos"
  on public.cafe_photos for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafe photos"
  on public.cafe_photos for delete
  using (auth.role() = 'authenticated');

-- 3. Storage bucket for the actual photo files.
insert into storage.buckets (id, name, public)
values ('cafe-photos', 'cafe-photos', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload cafe photos"
  on storage.objects for insert
  with check (bucket_id = 'cafe-photos' and auth.role() = 'authenticated');

create policy "Anyone can view cafe photos"
  on storage.objects for select
  using (bucket_id = 'cafe-photos');

create policy "Authenticated users can delete cafe photos"
  on storage.objects for delete
  using (bucket_id = 'cafe-photos' and auth.role() = 'authenticated');
