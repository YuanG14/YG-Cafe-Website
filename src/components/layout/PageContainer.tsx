import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16', className)}>
      {children}
    </main>
  );
}
