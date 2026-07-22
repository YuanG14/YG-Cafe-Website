import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../ui/FadeIn';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function AuthLayout({ eyebrow, title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas grid place-items-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />
      </div>

      <FadeIn className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm" aria-hidden="true">
              ☕
            </span>
            <span className="font-display text-lg font-semibold text-ink">Our Cafe Journal</span>
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">
            {eyebrow}
          </p>
          <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
        </div>

        <div className="bg-card rounded-card border border-hairline shadow-soft p-7 sm:p-8">
          {children}
        </div>
      </FadeIn>
    </div>
  );
}
