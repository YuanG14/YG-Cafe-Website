import { useCallback, useEffect, useState } from 'react';
import {
  listWishlist,
  deleteWishlistItem,
  convertWishlistItemToCafe,
} from '../services/wishlistService';
import { getErrorMessage } from '../lib/errors';
import type { WishlistCafe } from '../types/wishlist';

interface UseWishlistResult {
  items: WishlistCafe[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  /** Converts to a real Cafe Collection entry and returns the new cafe's id. */
  convertToCollection: (item: WishlistCafe, userId: string) => Promise<string>;
}

export function useWishlist(): UseWishlistResult {
  const [items, setItems] = useState<WishlistCafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWishlist();
      setItems(result);
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong loading the wishlist.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function removeItem(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteWishlistItem(id);
    } catch {
      setItems(previous);
    }
  }

  async function convertToCollection(item: WishlistCafe, userId: string) {
    const cafe = await convertWishlistItemToCafe(item, userId);
    await refetch();
    return cafe.id;
  }

  return { items, loading, error, refetch, removeItem, convertToCollection };
}
