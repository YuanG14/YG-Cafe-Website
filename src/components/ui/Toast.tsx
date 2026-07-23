import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-primary/40 bg-white',
  error: 'border-red-200 bg-white',
  warning: 'border-gold-soft bg-white',
  info: 'border-secondary/40 bg-white',
};

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i',
};

const VARIANT_ICON_STYLES: Record<ToastVariant, string> = {
  success: 'bg-primary/25 text-primary-deep',
  error: 'bg-red-100 text-red-500',
  warning: 'bg-gold-soft text-gold',
  info: 'bg-secondary/25 text-accent-deep',
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lift max-w-sm w-full',
        VARIANT_STYLES[toast.variant]
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold mt-0.5',
          VARIANT_ICON_STYLES[toast.variant]
        )}
      >
        {VARIANT_ICON[toast.variant]}
      </span>
      <p className="text-sm text-ink leading-snug pt-0.5">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="ml-auto shrink-0 text-ink-faint hover:text-ink-soft transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

/**
 * Rendered via a portal so toasts always sit above route content regardless
 * of stacking contexts created by transforms elsewhere in the tree (the
 * blurred background blooms, Framer Motion animations, etc.).
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return createPortal(
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
