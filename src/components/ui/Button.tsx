import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-ink hover:bg-primary-deep shadow-soft hover:shadow-lift',
  secondary:
    'bg-white text-ink border border-hairline hover:border-accent/40 hover:bg-sky-tint/60',
  ghost: 'bg-transparent text-ink-soft hover:text-ink hover:bg-blush',
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
};

/**
 * Shared style builder so non-<button> elements (e.g. a router Link that
 * should *look* like a button) can reuse the exact same visual treatment
 * instead of duplicating class strings.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
): string {
  return cn(
    'inline-flex items-center justify-center rounded-pill font-medium',
    'transition-all duration-200 ease-out active:scale-[0.97]',
    'disabled:opacity-50 disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonStyles(variant, size, className)} {...props}>
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
