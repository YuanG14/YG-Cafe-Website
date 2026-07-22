interface CafeTimelineProps {
  dateVisited: string;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEvent {
  label: string;
  date: string;
  glyph: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * A small vertical timeline of this memory's lifecycle — when it happened,
 * when it was logged, and (if different) when it was last touched up.
 * Keeps the "scrapbook" feeling of a dated trail rather than a bare list
 * of timestamps.
 */
export function CafeTimeline({ dateVisited, createdAt, updatedAt }: CafeTimelineProps) {
  const wasEdited = new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;

  const events: TimelineEvent[] = [
    { label: 'Visited', date: dateVisited, glyph: '📍' },
    { label: 'Added to the collection', date: createdAt, glyph: '📖' },
  ];

  if (wasEdited) {
    events.push({ label: 'Last updated', date: updatedAt, glyph: '✏️' });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-ink mb-5">Timeline</h2>
      <ol className="relative flex flex-col gap-6 pl-2">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-hairline" aria-hidden="true" />
        {events.map((event) => (
          <li key={event.label} className="relative flex items-start gap-4">
            <span
              className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush border border-hairline text-sm"
              aria-hidden="true"
            >
              {event.glyph}
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-ink">{event.label}</p>
              <p className="text-xs text-ink-soft">{formatDate(event.date)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
