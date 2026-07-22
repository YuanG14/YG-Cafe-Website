import { useState } from 'react';
import { cn } from '../../lib/cn';

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function RatingInput({ label, value, onChange, max = 5 }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-ink">{label}</span>
      <div className="flex gap-1" onMouseLeave={() => setHovered(null)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star === value ? 0 : star)}
            aria-label={`${label}: ${star} out of ${max}`}
            className="p-0.5"
          >
            <svg
              viewBox="0 0 20 20"
              className={cn('w-5 h-5 transition-colors', star <= display ? 'fill-gold' : 'fill-hairline')}
            >
              <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
