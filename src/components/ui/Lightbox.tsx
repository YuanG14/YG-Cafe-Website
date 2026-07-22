import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LightboxPhoto {
  id: string;
  url: string;
  alt?: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Fullscreen image viewer used by CafeGallery. Fully self-contained —
 * pass `index={null}` to keep it unmounted/closed. Handles arrow-key and
 * on-screen navigation, escape-to-close, and backdrop click-to-close.
 */
export function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const isOpen = index !== null;
  const total = photos.length;

  const goTo = useCallback(
    (next: number) => {
      onIndexChange((next + total) % total);
    },
    [onIndexChange, total]
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo((index ?? 0) + 1);
      if (e.key === 'ArrowLeft') goTo((index ?? 0) - 1);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, index, goTo, onClose]);

  return (
    <AnimatePresence>
      {isOpen && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/90 backdrop-blur-sm px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
          >
            ×
          </button>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
            >
              ‹
            </button>
          )}

          <motion.div
            key={photos[index].id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[index].url}
              alt={photos[index].alt ?? ''}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-lift"
            />
          </motion.div>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
            >
              ›
            </button>
          )}

          {total > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-pill transition-all ${
                    i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
