import { useRef, useState } from 'react';
import { addCafePhoto, deleteCafePhoto } from '../../services/cafeService';
import { getErrorMessage } from '../../lib/errors';
import type { CafePhoto } from '../../types/cafe';

interface PhotoUploaderProps {
  cafeId: string;
  photos: CafePhoto[];
  onPhotosChange: (photos: CafePhoto[]) => void;
}

/**
 * Uploads happen immediately on file selection (there's already a saved
 * cafe to attach photos to by the time this renders — see CafeForm, which
 * creates the cafe row before mounting this).
 */
export function PhotoUploader({ cafeId, photos, onPhotosChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => addCafePhoto(cafeId, file)));
      onPhotosChange([...photos, ...uploaded]);
    } catch (err) {
      setError(getErrorMessage(err, 'Some photos failed to upload.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(photo: CafePhoto) {
    onPhotosChange(photos.filter((p) => p.id !== photo.id));
    try {
      await deleteCafePhoto(photo);
    } catch {
      // Put it back if the delete failed server-side.
      onPhotosChange(photos);
      setError("Couldn't delete that photo — try again.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-ink">Photos</span>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-hairline">
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(photo)}
              aria-label="Delete photo"
              className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-xl border-2 border-dashed border-hairline hover:border-accent/40 text-ink-soft text-xs flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
        >
          <span className="text-xl" aria-hidden="true">
            {uploading ? '…' : '+'}
          </span>
          {uploading ? 'Uploading' : 'Add photos'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
