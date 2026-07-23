import { placeholderPhoto } from './placeholderPhoto';
import type { Cafe } from '../types/cafe';
import type { WishlistCafe } from '../types/wishlist';
import type { RandomDateCandidate, RandomDateMode } from '../types/randomDate';

function fromCafe(cafe: Cafe): RandomDateCandidate {
  return {
    id: cafe.id,
    name: cafe.name,
    kind: 'cafe',
    subtitle: new Date(cafe.dateVisited).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    }),
    photoUrl: cafe.photos[0]?.url ?? placeholderPhoto(cafe.id),
  };
}

const WISHLIST_PRIORITY_LABEL: Record<WishlistCafe['priority'], string> = {
  'must-visit': 'Must visit',
  interested: 'Interested',
  someday: 'Someday',
};

function fromWishlist(item: WishlistCafe): RandomDateCandidate {
  return {
    id: item.id,
    name: item.name,
    kind: 'wishlist',
    subtitle: WISHLIST_PRIORITY_LABEL[item.priority],
    photoUrl: placeholderPhoto(item.id),
  };
}

/**
 * Builds the pool of candidates the wheel can land on, per mode:
 * - favorite: your favorited cafes, for revisiting somewhere you already love
 * - wishlist: unvisited wishlist entries, for trying somewhere new
 * - budget: either pool, capped at the given budget
 * - challenge: wishlist entries marked "someday" — the ones you keep putting off
 */
export function buildCandidatePool(
  mode: RandomDateMode,
  cafes: Cafe[],
  wishlist: WishlistCafe[],
  budget: number
): RandomDateCandidate[] {
  switch (mode) {
    case 'favorite':
      return cafes.filter((c) => c.isFavorite).map(fromCafe);

    case 'wishlist':
      return wishlist.filter((w) => w.status !== 'visited').map(fromWishlist);

    case 'challenge':
      return wishlist.filter((w) => w.priority === 'someday' && w.status !== 'visited').map(fromWishlist);

    case 'budget': {
      const cafeMatches = cafes.filter((c) => c.totalSpent != null && c.totalSpent <= budget).map(fromCafe);
      const wishlistMatches = wishlist
        .filter((w) => w.status !== 'visited' && w.estimatedBudget != null && w.estimatedBudget <= budget)
        .map(fromWishlist);
      return [...cafeMatches, ...wishlistMatches];
    }
  }
}

export const MODE_COPY: Record<
  RandomDateMode,
  { label: string; description: string; emptyState: string }
> = {
  favorite: {
    label: 'Favorite',
    description: "Pulls from cafes you've already marked as favorites.",
    emptyState: 'No favorites yet — mark a cafe as a favorite in the Collection first.',
  },
  wishlist: {
    label: 'Wishlist',
    description: "Pulls from wishlist cafes you haven't visited yet.",
    emptyState: 'Your wishlist is empty — add somewhere you want to try.',
  },
  budget: {
    label: 'Budget',
    description: 'Pulls from anywhere — visited or wishlist — at or under your budget.',
    emptyState: "Nothing fits that budget yet — try raising it, or add spending info to a cafe or wishlist entry.",
  },
  challenge: {
    label: 'Challenge',
    description: 'Pulls from the "someday" pile — the ones you keep putting off.',
    emptyState: 'No "someday" wishlist entries yet — mark something as Someday priority first.',
  },
};
