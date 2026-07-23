/**
 * Standard "skip to content" link for keyboard/screen-reader users to jump
 * past the sticky nav. Invisible until it receives focus (first Tab press).
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-pill focus:bg-primary focus:text-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:shadow-lift"
    >
      Skip to content
    </a>
  );
}
