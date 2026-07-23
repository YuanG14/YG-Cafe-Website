# Our Cafe Journal

A private, romantic little archive of every cafe we've visited together — built phase by phase.

## Phase 1 — Foundation (complete)

- Vite + React + TypeScript + Tailwind CSS v4
- React Router route skeleton (Home, Collection, Wishlist, Pick for Us, Our Story)
- Design system: color tokens, type scale (Cormorant Garamond + Inter), shadows, radii
- Reusable UI primitives: Button, Card, Badge, StarRating, SectionHeading
- Premium editorial landing page (Hero, Featured Memories, Statistics Preview, Random Date CTA, Footer) with placeholder photography and Framer Motion animation

## Phase 3 — Supabase Authentication (this phase)

- Supabase client (`src/lib/supabase/client.ts`) with a "remember me"–aware storage adapter
- `AuthContext` / `useAuth()` — session state, `signIn`, `signUp`, `signOut`
- `/login` and `/register` pages, styled to match the design system
- `ProtectedRoute` — guards the whole journal, redirects signed-out visitors to `/login`
- `PublicOnlyRoute` — keeps signed-in users off `/login` and `/register`
- Logout control in the navbar

### Setting up Supabase for this phase

1. Create a project at [supabase.com](https://supabase.com).
2. In your project, go to **Settings → API** and copy the **Project URL** and **anon public key**.
3. Copy `.env.example` to `.env` and paste those two values in.
4. Since this is a private site for just the two of you, once you've both registered, go to **Authentication → Providers → Email** in Supabase and turn **off "Allow new users to sign up"** so the `/register` page can't be used by anyone else afterward.
5. If you'd rather skip email confirmation for a two-person private site, **Authentication → Providers → Email → "Confirm email"** can be turned off — otherwise new accounts get a confirmation link first.

```bash
cp .env.example .env
# then fill in the two values
npm run dev
```

## Phase 4 — Cafe Collection (this phase)

- **Database:** `cafes` + `cafe_photos` tables, `cafe-photos` storage bucket (`supabase/migrations/001_cafes_schema.sql`). RLS is intentionally simple for now — any authenticated user can read/write; `created_by` is tracked on every row so the upcoming RBAC phase can tighten this to ownership + admin-override policies without a schema change.
- **Service layer:** `src/services/cafeService.ts` is the only file that talks to Supabase for cafes — everything else uses domain types (`Cafe`, `CafeInput`, `CafePhoto`) and never sees snake_case columns.
- **Hooks:** `useCafes()` (list, with optimistic favorite toggle) and `useCafe(id)` (single record) — both handle loading/error state so pages don't repeat that logic.
- **Full CRUD:** `/collection` (grid), `/collection/new` (create), `/collection/:id` (detail — photos, ratings, journal, drinks/food, spend, edit/delete), `/collection/:id/edit`.
- **Photo uploads:** `PhotoUploader` on the detail page uploads directly to Supabase Storage and writes a `cafe_photos` row; deleting removes both. Photos require a saved cafe, so they're managed from the detail page rather than the create form.
- **Ratings:** six categories (overall, coffee, food, ambiance, service, value), editable via `RatingInput`, displayed via the existing `StarRating`.
- **Tags, drinks, food:** all use the same reusable `TagInput` chip component.
- **Favorite:** toggle on the card, the grid, and the detail page, with optimistic UI.
- The landing page's "Featured Memories" section now pulls real favorite cafes instead of placeholder data, falling back to an empty-state prompt when the collection is empty.

### Running the Phase 4 migration

In your Supabase project's SQL Editor, run `supabase/migrations/001_cafes_schema.sql`. It creates the tables, indexes, RLS policies, and the `cafe-photos` storage bucket in one go.

## Roles foundation — creating your admin account

This adds the storage for roles (`profiles` table) so an account can actually
*be* admin — it does not yet add admin-only pages or route guards; that's
still queued as its own step. `useAuth()` now exposes `profile` and `isAdmin`.

1. Run `supabase/migrations/002_profiles_and_roles.sql` in your Supabase
   project's SQL Editor. This creates the `profiles` table, an `app_role`
   enum (`admin | member | guest`), and a trigger that auto-creates a
   `member` profile row for every new signup.
2. If you haven't registered your own account yet, go to `/register` and do
   that first — you need a row in `profiles` before you can promote it.
3. Back in the Supabase SQL Editor, promote yourself:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   This is deliberately **only** possible via direct SQL — there is no
   button or API route in the app that can set someone's own role, so
   there's no client-side path to self-promote to admin.
4. Log out and back in (or just refresh) — you should see a small **Admin**
   badge next to the logout button in the navbar once your profile loads.

Your girlfriend's account, and any other signups, default to `member` and
stay that way unless you run the same SQL for them.

## Phase 6 — Wishlist (this phase)

- **Database:** `wishlist_cafes` table (`supabase/migrations/003_wishlist_schema.sql`) with `priority` and `status` enums, plus a `converted_cafe_id` link back to `cafes` once an item has been visited. Same simple "any authenticated user" RLS as the rest of the app for now.
- **Service layer:** `src/services/wishlistService.ts` — CRUD plus `convertWishlistItemToCafe()`, which creates a real `cafes` row (pre-filled with the wishlist's name, maps link, and budget) and marks the wishlist entry `visited` with a link to the new cafe.
- **`useWishlist()` hook** — mirrors `useCafes()`'s shape (loading/error, optimistic delete).
- **`/wishlist` page:** add/edit inline via `WishlistForm`, priority (`Must visit / Interested / Someday`) and status (`Idea / Planned / Visited`) as pill selectors, "Mark as Planned" and "Mark as Visited" actions, converted items shown in a separate "Already visited" section linking to their new Collection entry.

### Running the Phase 6 migration

Run `supabase/migrations/003_wishlist_schema.sql` in the Supabase SQL Editor — it depends on `set_updated_at()` from `001_cafes_schema.sql` and the `cafes` table itself, so run those first if you haven't already.

## Phase 7 — Random Date Generator (this phase)

- **No new tables** — this phase reads entirely from existing `cafes` and `wishlist_cafes` data via `useCafes()`/`useWishlist()`.
- **`lib/randomDatePool.ts`** — pure function mapping the four modes to a candidate pool:
  - **Favorite** — your favorited cafes (revisit somewhere you already love)
  - **Wishlist** — unvisited wishlist entries (try somewhere new)
  - **Budget** — either pool, capped at a budget you set (₱)
  - **Challenge** — wishlist entries marked "Someday" (the ones you keep putting off)
- **`SpinWheel`** — a real conic-gradient wheel that always lands exactly on a pre-chosen winner (picked randomly before the spin starts, not guessed at afterward), with a decelerating 3.2s spin and a small random jitter so it doesn't always land dead-center.
- **`ResultCard`** — reveals the winner with a photo, links straight to its real Collection or Wishlist entry.
- Each mode has its own empty-state message (e.g. "mark a cafe as favorite first") rather than just showing a blank wheel.

## Getting started

```bash
npm install
npm run dev
```

## Folder structure

```
src/
  components/
    layout/    # Navbar, AppLayout, PageContainer, ComingSoon, Footer
    ui/        # Button, Card, Badge, StarRating, SectionHeading, TextField, TagInput, FadeIn
    home/      # Landing page sections (Hero, FeaturedMemories, StatsPreview, RandomDateCTA)
    cafe/      # CafeForm, CafeDetail pieces, MemoryCard, RatingInput, PhotoUploader
    auth/      # ProtectedRoute, PublicOnlyRoute, AuthLayout
  context/
    AuthContext.tsx  # Session state + signIn/signUp/signOut
  services/
    cafeService.ts   # Only file that talks to the cafes/cafe_photos tables
  hooks/
    useCafes.ts, useCafe.ts
  lib/
    supabase/client.ts, supabase/storage.ts
    cn.ts, placeholderPhoto.ts
  pages/       # One file per route
  types/       # Domain types (Cafe, CafeInput, CafePhoto, Wishlist, ...)
  index.css    # Design tokens + Tailwind v4 theme
supabase/
  migrations/  # SQL to run in the Supabase SQL Editor
```
