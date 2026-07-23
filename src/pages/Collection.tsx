import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { buttonStyles } from '../components/ui/Button';
import { MemoryCard } from '../components/cafe/MemoryCard';
import { MemoryCardSkeleton } from '../components/cafe/MemoryCardSkeleton';
import { useCafes } from '../hooks/useCafes';
import { usePageMeta } from '../lib/seo';

export function Collection() {
  usePageMeta({
    title: 'Collection',
    description: 'Every cafe we have visited together, remembered.',
  });
  const { cafes, loading, error, toggleFavorite } = useCafes();

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <SectionHeading
          eyebrow="The collection"
          title="Every cafe, remembered."
          description="Every place we've sat in together — tap in to see the photos, the ratings, the story."
        />
        <Link to="/collection/new" className={buttonStyles('primary', 'md', 'shrink-0')}>
          + Add a cafe
        </Link>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading your cafes">
          {Array.from({ length: 6 }, (_, i) => (
            <MemoryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && cafes.length === 0 && (
        <div className="rounded-card border border-dashed border-hairline px-8 py-20 text-center">
          <p className="text-ink-soft mb-5">
            Nothing here yet — add the first cafe to start the collection.
          </p>
          <Link to="/collection/new" className={buttonStyles('primary', 'lg')}>
            Add our first cafe
          </Link>
        </div>
      )}

      {!loading && !error && cafes.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cafes.map((cafe, i) => (
            <MemoryCard key={cafe.id} cafe={cafe} onToggleFavorite={toggleFavorite} index={i} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
