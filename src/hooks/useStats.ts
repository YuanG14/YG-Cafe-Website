import { useMemo } from 'react';
import { useCafes } from './useCafes';
import {
  computeSummary,
  computeMonthlySpending,
  computeVisitTimeline,
  computeTopCafes,
  computeRatingBreakdown,
  computeTopTags,
} from '../lib/stats';

/**
 * All derived Statistics Dashboard data in one place. Thin wrapper around
 * `useCafes` — components stay declarative and never touch raw cafe rows.
 */
export function useStats() {
  const { cafes, loading, error } = useCafes();

  const summary = useMemo(() => computeSummary(cafes), [cafes]);
  const monthlySpending = useMemo(() => computeMonthlySpending(cafes), [cafes]);
  const visitTimeline = useMemo(() => computeVisitTimeline(cafes), [cafes]);
  const topCafes = useMemo(() => computeTopCafes(cafes), [cafes]);
  const ratingBreakdown = useMemo(() => computeRatingBreakdown(cafes), [cafes]);
  const topTags = useMemo(() => computeTopTags(cafes), [cafes]);

  return {
    loading,
    error,
    hasData: cafes.length > 0,
    summary,
    monthlySpending,
    visitTimeline,
    topCafes,
    ratingBreakdown,
    topTags,
  };
}
