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
    ui/        # Button, Card, Badge, StarRating, SectionHeading, TextField, FadeIn
    home/      # Landing page sections (Hero, FeaturedMemories, StatsPreview, RandomDateCTA)
    cafe/      # Domain components reused across phases (MemoryCard)
    auth/      # ProtectedRoute, PublicOnlyRoute, AuthLayout
  context/
    AuthContext.tsx  # Session state + signIn/signUp/signOut
  lib/
    supabase/client.ts  # Supabase client + remember-me storage adapter
    cn.ts, placeholderPhoto.ts
  pages/       # One file per route
  types/       # Domain types shared across future phases
  index.css    # Design tokens + Tailwind v4 theme
```
