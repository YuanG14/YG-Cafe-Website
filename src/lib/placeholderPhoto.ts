/**
 * Deterministic placeholder photo URL, keyed by a seed string so the same
 * "memory" always shows the same image across renders. Swapped for real
 * Supabase Storage URLs once photo upload ships (Cafe Collection phase).
 */
export function placeholderPhoto(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
