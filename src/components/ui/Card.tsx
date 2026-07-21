import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

/**
 * Base card surface. `interactive` adds the lift-on-hover treatment used for
 * clickable cafe/wishlist cards; leave it off for static panels (stats, forms).
 */
export function Card({ className, children, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-card border border-hairline shadow-soft',
        interactive &&
          'transition-all duration-300 ease-out hover:shadow-lift hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
