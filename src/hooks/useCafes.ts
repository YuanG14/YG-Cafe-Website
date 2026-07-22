import { useCallback, useEffect, useState } from 'react';
import { listCafes, toggleFavorite as toggleFavoriteRequest } from '../services/cafeService';
import type { Cafe } from '../types/cafe';

interface UseCafesResult {
  cafes: Cafe[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleFavorite: (cafeId: string) => Promise<void>;
}

export function useCafes(): UseCafesResult {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCafes();
      setCafes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong loading your cafes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function toggleFavorite(cafeId: string) {
    const target = cafes.find((c) => c.id === cafeId);
    if (!target) return;

    const nextValue = !target.isFavorite;
    // Optimistic update — the toggle should feel instant.
    setCafes((prev) => prev.map((c) => (c.id === cafeId ? { ...c, isFavorite: nextValue } : c)));

    try {
      await toggleFavoriteRequest(cafeId, nextValue);
    } catch {
      // Roll back on failure.
      setCafes((prev) => prev.map((c) => (c.id === cafeId ? { ...c, isFavorite: !nextValue } : c)));
    }
  }

  return { cafes, loading, error, refetch, toggleFavorite };
}
