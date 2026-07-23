/**
 * Supabase (and Postgrest) errors aren't always real `Error` instances — some
 * are plain objects shaped like `{ message, details, hint, code }`. Using
 * `err instanceof Error` alone silently swallows those and shows a generic
 * fallback instead of the actual reason. This checks for a `.message` on
 * anything error-shaped before giving up and using the fallback.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const message = (err as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}
