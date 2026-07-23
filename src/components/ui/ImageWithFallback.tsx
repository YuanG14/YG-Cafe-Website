import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Wrapper class for the fallback state (the <img> itself may be styled via className as normal). */
  fallbackClassName?: string;
}

/**
 * Swaps to a quiet in-brand placeholder if the photo URL 404s or the
 * network drops mid-load, instead of showing a broken-image icon. Used
 * anywhere a cafe photo comes from Supabase Storage, where a deleted file
 * or a stale URL is always a possibility.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'Photo unavailable'}
        className={cn(
          'flex flex-col items-center justify-center gap-1.5 bg-blush text-ink-faint',
          fallbackClassName ?? className
        )}
      >
        <span aria-hidden="true" className="text-2xl">
          ☕
        </span>
        <span className="text-xs">Photo unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
