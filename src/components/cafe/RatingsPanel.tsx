import { StarRating } from '../ui/StarRating';
import type { RatingCategory, Ratings } from '../../types/cafe';

interface RatingsPanelProps {
  ratings: Ratings;
}

const RATING_META: Record<RatingCategory, { label: string; glyph: string }> = {
  overall: { label: 'Overall', glyph: '⭐' },
  coffee: { label: 'Coffee', glyph: '☕' },
  food: { label: 'Food', glyph: '🥐' },
  ambiance: { label: 'Ambiance', glyph: '✨' },
  service: { label: 'Service', glyph: '🛎️' },
  value: { label: 'Value', glyph: '💰' },
};

const SUB_CATEGORIES: RatingCategory[] = ['coffee', 'food', 'ambiance', 'service', 'value'];

/**
 * The ratings section of the details page: overall score called out on its
 * own, the five sub-ratings laid out in a supporting grid beneath it.
 */
export function RatingsPanel({ ratings }: RatingsPanelProps) {
  return (
    <div className="rounded-card bg-blush border border-hairline p-6 sm:p-8">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-hairline">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-1">
            Overall
          </p>
          <StarRating value={ratings.overall} size="md" />
        </div>
        <span className="text-3xl" aria-hidden="true">
          {RATING_META.overall.glyph}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        {SUB_CATEGORIES.map((category) => (
          <div key={category} className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-soft flex items-center gap-1.5">
              <span aria-hidden="true">{RATING_META[category].glyph}</span>
              {RATING_META[category].label}
            </span>
            <StarRating value={ratings[category]} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
