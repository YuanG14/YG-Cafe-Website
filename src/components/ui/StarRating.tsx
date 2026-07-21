import { cn } from '../../lib/cn';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

/**
 * Read-only star display. An editable version (for the Add/Edit Cafe form)
 * will extend this in the Cafe Collection phase — kept presentational here
 * since Phase 1 is scaffold + design system only.
 */
export function StarRating({ value, max = 5, size = 'md', label, className }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i < Math.round(value));
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="img" aria-label={label ?? `${value} out of ${max} stars`}>
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn(starSize, filled ? 'fill-gold' : 'fill-hairline')}
            aria-hidden="true"
          >
            <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
          </svg>
        ))}
      </div>
      {label && <span className="text-xs text-ink-soft">{label}</span>}
    </div>
  );
}
