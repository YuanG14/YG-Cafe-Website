export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-soft">
        <p className="flex items-center gap-1.5">
          <span aria-hidden="true">☕</span>
          Our Cafe Journal — just for us.
        </p>
        <p>&copy; {year}</p>
      </div>
    </footer>
  );
}
