export type RandomDateMode = 'favorite' | 'budget' | 'challenge' | 'wishlist';

/** A candidate the wheel can land on — normalized from either a Cafe or a WishlistCafe. */
export interface RandomDateCandidate {
  id: string;
  name: string;
  kind: 'cafe' | 'wishlist';
  subtitle: string;
  photoUrl: string | null;
}
