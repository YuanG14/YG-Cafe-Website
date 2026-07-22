import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbox } from '../ui/Lightbox';
import { PhotoUploader } from './PhotoUploader';
import { placeholderPhoto } from '../../lib/placeholderPhoto';
import type { CafePhoto } from '../../types/cafe';

interface CafeGalleryProps {
  cafeId: string;
  cafeName: string;
  photos: CafePhoto[];
  onPhotosChange: (photos: CafePhoto[]) => void;
}

/**
 * The details-page hero: a large lead photo with a thumbnail strip beneath
 * it, both of which open the shared Lightbox for a fullscreen look. Falls
 * back to a deterministic placeholder when the cafe has no photos yet.
 * Photo management (add/remove) lives behind a toggle so the default view
 * stays purely a gallery, not an editing surface.
 */
export function CafeGallery({ cafeId, cafeName, photos, onPhotosChange }: CafeGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [managing, setManaging] = useState(false);

  const hasPhotos = photos.length > 0;
  const displayPhotos = hasPhotos
    ? photos
    : [{ id: 'placeholder', cafeId, url: placeholderPhoto(cafeId, 1200, 900), storagePath: '' }];

  const lightboxPhotos = displayPhotos.map((p) => ({ id: p.id, url: p.url, alt: cafeName }));

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-card overflow-hidden shadow-lift cursor-pointer group aspect-[16/10] sm:aspect-[16/9]"
        onClick={() => setLightboxIndex(0)}
      >
        <img
          src={displayPhotos[0].url}
          alt={cafeName}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </motion.div>

      {displayPhotos.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {displayPhotos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="shrink-0 h-20 w-24 rounded-lg overflow-hidden border border-hairline hover:border-accent/50 transition-colors"
              aria-label={`View photo ${i + 1} of ${cafeName}`}
            >
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-ink-faint">
          {hasPhotos
            ? `${photos.length} photo${photos.length === 1 ? '' : 's'}`
            : 'No photos yet — showing a placeholder'}
        </p>
        <button
          type="button"
          onClick={() => setManaging((v) => !v)}
          className="text-xs font-medium text-accent-deep hover:text-accent transition-colors"
        >
          {managing ? 'Done' : hasPhotos ? 'Manage photos' : 'Add photos'}
        </button>
      </div>

      {managing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 rounded-card bg-blush border border-hairline p-4"
        >
          <PhotoUploader cafeId={cafeId} photos={photos} onPhotosChange={onPhotosChange} />
        </motion.div>
      )}

      <Lightbox
        photos={lightboxPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
