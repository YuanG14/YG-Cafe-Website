import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { placeholderPhoto } from '../../lib/placeholderPhoto';
import { cn } from '../../lib/cn';

interface MemoryCardProps {
  seed: string;
  name: string;
  dateVisited: string;
  rating: number;
  tag: string;
  className?: string;
}

/**
 * A single "memory" preview — placeholder photo + name + date + rating.
 * Purely presentational: no click-through, no data fetching. The real
 * version (with photos, journal entry, full ratings) arrives in the
 * Cafe Collection phase.
 */
export function MemoryCard({ seed, name, dateVisited, rating, tag, className }: MemoryCardProps) {
  return (
    <Card interactive className={cn('group overflow-hidden', className)}>
      <div className="aspect-[4/5] w-full overflow-hidden rounded-t-card">
        <img
          src={placeholderPhoto(seed)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-medium text-ink">{name}</h3>
          <Badge tone="pink">{tag}</Badge>
        </div>
        <p className="mt-1 text-xs text-ink-soft">{dateVisited}</p>
        <StarRating value={rating} size="sm" className="mt-3" />
      </div>
    </Card>
  );
}
