import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeTone = 'pink' | 'sky' | 'gold' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, string> = {
  pink: 'bg-primary/25 text-primary-deep',
  sky: 'bg-secondary/25 text-accent-deep',
  gold: 'bg-gold-soft text-gold',
  neutral: 'bg-blush text-ink-soft',
};

export function Badge({ className, children, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium tracking-wide',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
