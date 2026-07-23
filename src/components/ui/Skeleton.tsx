import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Set false for skeletons composed inside an already-labelled loading region. */
  ariaHidden?: boolean;
}

/**
 * Base shimmer block. Compose with width/height/rounded classes to match
 * whatever it's standing in for (a photo, a line of text, a stat number).
 * Respects prefers-reduced-motion globally via index.css.
 */
export function Skeleton({ className, ariaHidden = true, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn('skeleton-shimmer rounded-lg', className)}
      {...props}
    />
  );
}
