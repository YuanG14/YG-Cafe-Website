import type { Cafe, RatingCategory } from '../types/cafe';

/** Shared month-key helper — groups by calendar month regardless of day. */
function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7); // 'yyyy-mm'
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  });
}

export interface StatsSummary {
  totalCafes: number;
  avgOverall: number;
  favoritesCount: number;
  totalSpent: number;
}

/** Headline numbers used by both the dashboard and the home page preview. */
export function computeSummary(cafes: Cafe[]): StatsSummary {
  const totalCafes = cafes.length;
  const favoritesCount = cafes.filter((c) => c.isFavorite).length;
  const totalSpent = cafes.reduce((sum, c) => sum + (c.totalSpent ?? 0), 0);
  const avgOverall =
    totalCafes === 0
      ? 0
      : Math.round(
          (cafes.reduce((sum, c) => sum + c.ratings.overall, 0) / totalCafes) * 10
        ) / 10;

  return { totalCafes, avgOverall, favoritesCount, totalSpent };
}

export interface MonthlySpendingPoint {
  key: string;
  month: string;
  total: number;
}

/** Chronological spend-per-month, based on each cafe's `dateVisited`. */
export function computeMonthlySpending(cafes: Cafe[]): MonthlySpendingPoint[] {
  const totals = new Map<string, number>();

  for (const cafe of cafes) {
    const key = monthKey(cafe.dateVisited);
    totals.set(key, (totals.get(key) ?? 0) + (cafe.totalSpent ?? 0));
  }

  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => ({ key, month: monthLabel(key), total }));
}

export interface VisitTimelinePoint {
  key: string;
  month: string;
  visits: number;
  cumulative: number;
}

/** Visits-per-month plus a running cumulative total, for a growth-over-time chart. */
export function computeVisitTimeline(cafes: Cafe[]): VisitTimelinePoint[] {
  const counts = new Map<string, number>();

  for (const cafe of cafes) {
    const key = monthKey(cafe.dateVisited);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const sortedKeys = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));

  let cumulative = 0;
  return sortedKeys.map((key) => {
    const visits = counts.get(key) ?? 0;
    cumulative += visits;
    return { key, month: monthLabel(key), visits, cumulative };
  });
}

export interface TopCafe {
  id: string;
  name: string;
  overall: number;
  dateVisited: string;
}

/** Highest-rated cafes, most recent visit first as the tiebreaker. */
export function computeTopCafes(cafes: Cafe[], limit = 5): TopCafe[] {
  return [...cafes]
    .sort((a, b) => {
      if (b.ratings.overall !== a.ratings.overall) return b.ratings.overall - a.ratings.overall;
      return b.dateVisited.localeCompare(a.dateVisited);
    })
    .slice(0, limit)
    .map((c) => ({ id: c.id, name: c.name, overall: c.ratings.overall, dateVisited: c.dateVisited }));
}

export interface RatingBreakdownPoint {
  category: RatingCategory;
  label: string;
  value: number;
}

const RATING_LABELS: Record<RatingCategory, string> = {
  overall: 'Overall',
  coffee: 'Coffee',
  food: 'Food',
  ambiance: 'Ambiance',
  service: 'Service',
  value: 'Value',
};

/** Average rating per category, for the radar chart. */
export function computeRatingBreakdown(cafes: Cafe[]): RatingBreakdownPoint[] {
  const categories = Object.keys(RATING_LABELS) as RatingCategory[];

  return categories.map((category) => {
    const value =
      cafes.length === 0
        ? 0
        : Math.round((cafes.reduce((sum, c) => sum + c.ratings[category], 0) / cafes.length) * 10) / 10;
    return { category, label: RATING_LABELS[category], value };
  });
}

export interface TagFrequency {
  tag: string;
  count: number;
}

/** Most-used tags across the collection, for a quick "what we're drawn to" read. */
export function computeTopTags(cafes: Cafe[], limit = 6): TagFrequency[] {
  const counts = new Map<string, number>();

  for (const cafe of cafes) {
    for (const tag of cafe.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}
