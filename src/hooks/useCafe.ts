import { useCallback, useEffect, useState } from 'react';
import { getCafe } from '../services/cafeService';
import type { Cafe } from '../types/cafe';

interface UseCafeResult {
  cafe: Cafe | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCafe(id: string | undefined): UseCafeResult {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getCafe(id);
      setCafe(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't find that cafe.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cafe, loading, error, refetch };
}
