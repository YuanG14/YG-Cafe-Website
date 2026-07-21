/**
 * Domain types for the app. These are shaped ahead of time so later phases
 * (Cafe Collection, Wishlist, Stats) can build against a stable contract.
 * No data-fetching or persistence logic lives here yet — that arrives with
 * the Supabase phase.
 */

export type RatingCategory = 'overall' | 'coffee' | 'food' | 'ambiance' | 'service' | 'value';

export type Ratings = Record<RatingCategory, number>;

export interface Cafe {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  photos: string[];
  ratings: Ratings;
  dateVisited: string;
  isFavorite: boolean;
  tags: string[];
  journalEntry?: string;
  drinksOrdered: string[];
  foodOrdered: string[];
  totalSpent: number;
}

export type WishlistPriority = 'must-visit' | 'interested' | 'someday';

export type WishlistStatus = 'idea' | 'planned' | 'visited';

export interface WishlistCafe {
  id: string;
  name: string;
  priority: WishlistPriority;
  notes?: string;
  estimatedBudget?: number;
  googleMapsUrl?: string;
  status: WishlistStatus;
}

export type RandomDateMode =
  | 'favorite-cafe'
  | 'wishlist-cafe'
  | 'budget-date'
  | 'challenge-mode'
  | 'hidden-gem';
