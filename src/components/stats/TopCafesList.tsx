import { Link } from 'react-router-dom';
import { StarRating } from '../ui/StarRating';
import type { TopCafe } from '../../lib/stats';

interface TopCafesListProps {
  cafes: TopCafe[];
}

/** Ranked leaderboard of the highest-rated cafes in the collection. */
export function TopCafesList({ cafes }: TopCafesListProps) {
  return (
    <ol className="flex flex-col gap-1">
      {cafes.map((cafe, i) => (
        <li key={cafe.id}>
          <Link
            to={`/collection/${cafe.id}`}
            className="flex items-center gap-4 rounded-xl px-3 py-3 -mx-3 hover:bg-blush transition-colors"
          >
            <span className="font-display text-2xl text-primary-deep w-7 shrink-0 text-center">
              {i + 1}
            </span>
            <span className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{cafe.name}</p>
              <StarRating value={cafe.overall} size="sm" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
