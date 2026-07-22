import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { buttonStyles } from '../components/ui/Button';
import { PhotoUploader } from '../components/cafe/PhotoUploader';
import { useCafe } from '../hooks/useCafe';
import { deleteCafe, toggleFavorite as toggleFavoriteRequest } from '../services/cafeService';
import type { RatingCategory } from '../types/cafe';

const RATING_LABELS: Record<RatingCategory, string> = {
  overall: 'Overall',
  coffee: 'Coffee',
  food: 'Food',
  ambiance: 'Ambiance',
  service: 'Service',
  value: 'Value',
};

export function CafeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cafe, loading, error, refetch } = useCafe(id);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteCafe(id);
      navigate('/collection');
    } catch {
      setDeleting(false);
    }
  }

  async function handleToggleFavorite() {
    if (!cafe) return;
    await toggleFavoriteRequest(cafe.id, !cafe.isFavorite);
    refetch();
  }

  if (loading) {
    return (
      <PageContainer className="max-w-3xl">
        <p className="text-sm text-ink-soft">Loading…</p>
      </PageContainer>
    );
  }

  if (error || !cafe) {
    return (
      <PageContainer className="max-w-3xl">
        <p role="alert" className="text-sm text-red-500 mb-4">
          {error ?? "Couldn't find that cafe."}
        </p>
        <Link to="/collection" className={buttonStyles('secondary', 'md')}>
          Back to collection
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink text-balance">
          {cafe.name}
        </h1>
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={cafe.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          className="shrink-0 grid h-11 w-11 place-items-center rounded-full bg-blush text-xl mt-1"
        >
          {cafe.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <p className="text-ink-soft mb-1">
        {new Date(cafe.dateVisited).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      {cafe.address && <p className="text-ink-soft mb-1">{cafe.address}</p>}
      {cafe.googleMapsUrl && (
        <a
          href={cafe.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent-deep hover:text-accent"
        >
          View on Google Maps →
        </a>
      )}

      {cafe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {cafe.tags.map((tag) => (
            <Badge key={tag} tone="pink">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Photos */}
      <div className="mt-10">
        <PhotoUploader cafeId={cafe.id} photos={cafe.photos} onPhotosChange={() => refetch()} />
      </div>

      {/* Ratings */}
      <div className="mt-10 rounded-card bg-blush border border-hairline p-6">
        <h2 className="font-display text-xl font-medium text-ink mb-4">Ratings</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {(Object.keys(RATING_LABELS) as RatingCategory[]).map((category) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">{RATING_LABELS[category]}</span>
              <StarRating value={cafe.ratings[category]} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Order details */}
      {(cafe.drinksOrdered.length > 0 || cafe.foodOrdered.length > 0 || cafe.totalSpent) && (
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          {cafe.drinksOrdered.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                Drinks
              </h3>
              <p className="text-sm text-ink">{cafe.drinksOrdered.join(', ')}</p>
            </div>
          )}
          {cafe.foodOrdered.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                Food
              </h3>
              <p className="text-sm text-ink">{cafe.foodOrdered.join(', ')}</p>
            </div>
          )}
          {cafe.totalSpent != null && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-2">
                Total spent
              </h3>
              <p className="text-sm text-ink">${cafe.totalSpent.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {/* Journal */}
      {cafe.journalEntry && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-medium text-ink mb-2">Journal entry</h2>
          <p className="text-ink-soft leading-relaxed whitespace-pre-wrap">{cafe.journalEntry}</p>
        </div>
      )}

      {/* Actions */}
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
    </PageContainer>
  );
}
