import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { placeholderPhoto } from '../../lib/placeholderPhoto';
import { cn } from '../../lib/cn';
import type { Cafe } from '../../types/cafe';

interface MemoryCardProps {
  cafe: Cafe;
  onToggleFavorite?: (cafeId: string) => void;
  className?: string;
  /** Position in the grid — used to stagger the entrance animation. */
  index?: number;
}

/**
 * A single cafe preview in the collection grid. Falls back to a placeholder
 * photo when the cafe has none uploaded yet. Memoized since it renders in a
 * list where sibling re-renders (e.g. another card's favorite toggle)
 * shouldn't force every card to re-render.
 */
export const MemoryCard = memo(function MemoryCard({
  cafe,
  onToggleFavorite,
  className,
  index = 0,
}: MemoryCardProps) {
  const coverPhoto = cafe.photos[0]?.url ?? placeholderPhoto(cafe.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card interactive className={cn('group overflow-hidden relative', className)}>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(cafe.id);
            }}
            aria-label={cafe.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-soft text-sm transition-transform active:scale-90"
          >
            {cafe.isFavorite ? '❤️' : '🤍'}
          </button>
        )}

        <Link to={`/collection/${cafe.id}`}>
          <div className="aspect-[4/5] w-full overflow-hidden rounded-t-card">
            <ImageWithFallback
              src={coverPhoto}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              fallbackClassName="h-full w-full"
            />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-medium text-ink">{cafe.name}</h3>
              {cafe.tags[0] && <Badge tone="pink">{cafe.tags[0]}</Badge>}
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              {new Date(cafe.dateVisited).toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <StarRating value={cafe.ratings.overall} size="sm" className="mt-3" />
          </div>
        </Link>
      </Card>
    </motion.div>
  );
});
