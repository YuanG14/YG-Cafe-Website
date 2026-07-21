# Our Cafe Journal

A private, romantic little archive of every cafe we've visited together — built phase by phase.

## Phase 1 — Foundation (this phase)

- Vite + React + TypeScript + Tailwind CSS v4
- React Router route skeleton (Home, Collection, Wishlist, Pick for Us, Our Story)
- Design system: color tokens, type scale (Cormorant Garamond + Inter), shadows, radii
- Reusable UI primitives: Button, Card, Badge, StarRating, SectionHeading
- No backend yet — Supabase (auth, database, storage) arrives in Phase 2

## Getting started

```bash
npm install
npm run dev
```

## Folder structure

```
src/
  components/
    layout/    # Navbar, AppLayout, PageContainer, ComingSoon
    ui/        # Button, Card, Badge, StarRating, SectionHeading
  pages/       # One file per route
  lib/         # Shared utilities (cn helper)
  types/       # Domain types shared across future phases
  index.css    # Design tokens + Tailwind v4 theme
```
