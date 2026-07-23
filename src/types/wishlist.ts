export type WishlistPriority = 'must-visit' | 'interested' | 'someday';

export type WishlistStatus = 'idea' | 'planned' | 'visited';

export interface WishlistCafe {
  id: string;
  createdBy: string;
  name: string;
  priority: WishlistPriority;
  status: WishlistStatus;
  notes: string | null;
  estimatedBudget: number | null;
  googleMapsUrl: string | null;
  /** Set once "Mark as Visited" has converted this into a real cafes row. */
  convertedCafeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistInput {
  name: string;
  priority: WishlistPriority;
  status: WishlistStatus;
  notes: string;
  estimatedBudget: number | null;
  googleMapsUrl: string;
}

export const EMPTY_WISHLIST_INPUT: WishlistInput = {
  name: '',
  priority: 'interested',
  status: 'idea',
  notes: '',
  estimatedBudget: null,
  googleMapsUrl: '',
};
