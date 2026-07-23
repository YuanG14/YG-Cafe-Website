/**
 * Suspense fallback for lazy-loaded routes. Reuses the same spinner
 * treatment as ProtectedRoute's session check so the two loading moments
 * feel like one consistent language rather than two different spinners.
 */
export function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    </div>
  );
}
