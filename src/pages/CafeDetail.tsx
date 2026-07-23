import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { FadeIn } from '../components/ui/FadeIn';
import { buttonStyles } from '../components/ui/Button';
import { CafeGallery } from '../components/cafe/CafeGallery';
import { CafeDetailSkeleton } from '../components/cafe/CafeDetailSkeleton';
import { RatingsPanel } from '../components/cafe/RatingsPanel';
import { CafeTimeline } from '../components/cafe/CafeTimeline';
import { useCafe } from '../hooks/useCafe';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../lib/seo';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency } from '../lib/currency';
import { deleteCafe, toggleFavorite as toggleFavoriteRequest } from '../services/cafeService';

export function CafeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cafe, loading, error, refetch } = useCafe(id);
  const { success, error: toastError } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  usePageMeta({
    title: cafe?.name ?? 'Cafe',
    description: cafe?.journalEntry ?? 'A cafe memory from our collection.',
  });

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteCafe(id);
      success('Cafe deleted.');
      navigate('/collection');
    } catch (err) {
      setDeleting(false);
      toastError(getErrorMessage(err, "Couldn't delete this cafe — try again."));
    }
  }

  async function handleToggleFavorite() {
    if (!cafe) return;
    try {
      await toggleFavoriteRequest(cafe.id, !cafe.isFavorite);
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, "Couldn't update that — try again."));
    }
  }

  if (loading) {
    return (
      <PageContainer className="max-w-4xl">
        <CafeDetailSkeleton />
      </PageContainer>
    );
  }

  if (error || !cafe) {
    return (
      <PageContainer className="max-w-4xl">
        <p role="alert" className="text-sm text-red-500 mb-4">
          {error ?? "Couldn't find that cafe."}
        </p>
        <Link to="/collection" className={buttonStyles('secondary', 'md')}>
          Back to collection
        </Link>
      </PageContainer>
    );
  }

  const hasOrderDetails =
    cafe.drinksOrdered.length > 0 || cafe.foodOrdered.length > 0 || cafe.totalSpent != null;

  return (
    <PageContainer className="max-w-4xl">
      <FadeIn>
        <Link
          to="/collection"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-6"
        >
          ← Back to collection
        </Link>
      </FadeIn>

      {/* Gallery */}
      <FadeIn>
        <CafeGallery
          cafeId={cafe.id}
          cafeName={cafe.name}
          photos={cafe.photos}
          onPhotosChange={() => refetch()}
        />
      </FadeIn>

      {/* Header */}
      <FadeIn delay={0.1} className="mt-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink text-balance">
            {cafe.name}
          </h1>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={cafe.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            className="shrink-0 grid h-11 w-11 place-items-center rounded-full bg-blush text-xl mt-1 transition-transform active:scale-90"
          >
            {cafe.isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-soft">
          <span>
            {new Date(cafe.dateVisited).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {cafe.address && (
            <>
              <span aria-hidden="true">·</span>
              <span>{cafe.address}</span>
            </>
          )}
          {cafe.googleMapsUrl && (
            <>
              <span aria-hidden="true">·</span>
              <a
                href={cafe.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-deep hover:text-accent transition-colors"
              >
                View on Google Maps →
              </a>
            </>
          )}
        </div>

        {cafe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {cafe.tags.map((tag) => (
              <Badge key={tag} tone="pink">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </FadeIn>

      {/* Content grid: primary column + sidebar */}
      <div className="mt-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Orders */}
          {hasOrderDetails && (
            <FadeIn delay={0.15}>
              <div className="rounded-card bg-card border border-hairline p-6 sm:p-8">
                <h2 className="font-display text-xl font-medium text-ink mb-5">Orders</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {cafe.drinksOrdered.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                        Drinks
                      </h3>
                      <p className="text-sm text-ink leading-relaxed">
                        {cafe.drinksOrdered.join(', ')}
                      </p>
                    </div>
                  )}
                  {cafe.foodOrdered.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                        Food
                      </h3>
                      <p className="text-sm text-ink leading-relaxed">
                        {cafe.foodOrdered.join(', ')}
                      </p>
                    </div>
                  )}
                  {cafe.totalSpent != null && (
                    <div>
                      <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                        Total spent
                      </h3>
                      <p className="text-sm text-ink leading-relaxed">
                        {formatCurrency(cafe.totalSpent)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Journal */}
          {cafe.journalEntry && (
            <FadeIn delay={0.2}>
              <div className="rounded-card bg-card border border-hairline p-6 sm:p-8">
                <h2 className="font-display text-xl font-medium text-ink mb-4">Journal</h2>
                <p className="text-ink-soft leading-relaxed whitespace-pre-wrap">
                  {cafe.journalEntry}
                </p>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Sidebar: Ratings + Timeline */}
        <div className="flex flex-col gap-8">
          <FadeIn delay={0.15}>
            <RatingsPanel ratings={cafe.ratings} />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-card bg-card border border-hairline p-6 sm:p-8">
              <CafeTimeline
                dateVisited={cafe.dateVisited}
                createdAt={cafe.createdAt}
                updatedAt={cafe.updatedAt}
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Actions */}
      <FadeIn delay={0.25}>
        <div className="mt-12 flex items-center gap-3 border-t border-hairline pt-6">
          <Link to={`/collection/${cafe.id}/edit`} className={buttonStyles('secondary', 'md')}>
            Edit
          </Link>

          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-soft">Delete this cafe for good?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="text-sm text-ink-soft hover:text-ink"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-medium text-ink-soft hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </FadeIn>
    </PageContainer>
  );
}
