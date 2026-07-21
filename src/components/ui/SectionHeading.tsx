import { cn } from '../../lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-medium text-ink text-balance">
        {title}
      </h2>
      {description && (
        <p className={cn('mt-3 text-ink-soft max-w-xl', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}
