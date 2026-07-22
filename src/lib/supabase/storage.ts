import { supabase } from './client';

const BUCKET = 'cafe-photos';

/** Builds a unique storage path so two photos with the same filename never collide. */
function buildStoragePath(cafeId: string, file: File): string {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const uniqueName = `${crypto.randomUUID()}.${ext}`;
  return `${cafeId}/${uniqueName}`;
}

export async function uploadCafePhoto(cafeId: string, file: File): Promise<string> {
  const path = buildStoragePath(cafeId, file);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteCafePhotoFile(storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}

export function getCafePhotoUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
