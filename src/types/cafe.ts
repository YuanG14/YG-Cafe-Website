/**
 * Domain types used throughout the app (camelCase). The database uses
 * snake_case columns — src/services/cafeService.ts maps between the two so
 * no component ever has to know the DB shape.
 */

export type RatingCategory = 'overall' | 'coffee' | 'food' | 'ambiance' | 'service' | 'value';

export type Ratings = Record<RatingCategory, number>;

export interface CafePhoto {
  id: string;
  cafeId: string;
  /** Public URL, already resolved — components never build storage paths themselves. */
  url: string;
  storagePath: string;
}

export interface Cafe {
  id: string;
  createdBy: string;
  name: string;
  address: string | null;
  googleMapsUrl: string | null;
  dateVisited: string; // ISO date (yyyy-mm-dd)
  isFavorite: boolean;
  tags: string[];
  journalEntry: string | null;
  drinksOrdered: string[];
  foodOrdered: string[];
  totalSpent: number | null;
  ratings: Ratings;
  photos: CafePhoto[];
  createdAt: string;
  updatedAt: string;
}

/** Fields the user actually fills in — everything else is server-assigned. */
export interface CafeInput {
  name: string;
  address: string;
  googleMapsUrl: string;
  dateVisited: string;
  isFavorite: boolean;
  tags: string[];
  journalEntry: string;
  drinksOrdered: string[];
  foodOrdered: string[];
  totalSpent: number | null;
  ratings: Ratings;
}

export const EMPTY_RATINGS: Ratings = {
  overall: 0,
  coffee: 0,
  food: 0,
  ambiance: 0,
  service: 0,
  value: 0,
};

export const EMPTY_CAFE_INPUT: CafeInput = {
  name: '',
  address: '',
  googleMapsUrl: '',
  dateVisited: new Date().toISOString().slice(0, 10),
  isFavorite: false,
  tags: [],
  journalEntry: '',
  drinksOrdered: [],
  foodOrdered: [],
  totalSpent: null,
  ratings: EMPTY_RATINGS,
};

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
