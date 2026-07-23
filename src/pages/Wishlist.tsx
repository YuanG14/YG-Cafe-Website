import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { WishlistForm } from '../components/wishlist/WishlistForm';
import { WishlistCard } from '../components/wishlist/WishlistCard';
import { WishlistCardSkeleton } from '../components/wishlist/WishlistCardSkeleton';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createWishlistItem } from '../services/wishlistService';
import { usePageMeta } from '../lib/seo';
import { EMPTY_WISHLIST_INPUT } from '../types/wishlist';
import type { WishlistCafe, WishlistInput } from '../types/wishlist';

export function Wishlist() {
  usePageMeta({
    title: 'Wishlist',
    description: 'Cafes we have spotted but have not tried yet.',
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, loading, error, refetch, removeItem, convertToCollection } = useWishlist();
  const { success, error: toastError } = useToast();
  const [adding, setAdding] = useState(false);

  async function handleCreate(input: WishlistInput) {
    if (!user) return;
    await createWishlistItem(input, user.id);
    setAdding(false);
    success('Added to your wishlist.');
    refetch();
  }

  async function handleDelete(id: string) {
    const removed = await removeItem(id);
    if (removed) {
      success('Removed from your wishlist.');
    } else {
      toastError("Couldn't remove that — try again.");
    }
  }

  async function handleConvert(item: WishlistCafe) {
    if (!user) return;
    // Errors are surfaced inline on the specific WishlistCard (it already
    // shows a contextual message there) — this only reports success.
    const cafeId = await convertToCollection(item, user.id);
    success(`${item.name} is now in your collection.`);
    navigate(`/collection/${cafeId}`);
  }

  const active = items.filter((i) => i.status !== 'visited');
  const visited = items.filter((i) => i.status === 'visited');

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <SectionHeading
          eyebrow="The wishlist"
          title="Places we're saving for later."
          description="Cafes we've spotted but haven't tried yet — ranked from someday to must-visit."
        />
        {!adding && <Button onClick={() => setAdding(true)} className="shrink-0">+ Add to wishlist</Button>}
      </div>

      {adding && (
        <Card className="p-6 sm:p-8 mb-8 max-w-xl">
          <WishlistForm
            initialValue={EMPTY_WISHLIST_INPUT}
            submitLabel="Add to wishlist"
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2" aria-busy="true" aria-label="Loading your wishlist">
          {Array.from({ length: 4 }, (_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && !adding && (
        <div className="rounded-card border border-dashed border-hairline px-8 py-20 text-center">
          <p className="text-ink-soft mb-5">
            Nothing saved yet — add somewhere you're curious about trying.
          </p>
          <Button onClick={() => setAdding(true)}>Add your first wishlist cafe</Button>
        </div>
      )}

      {active.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {active.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onChanged={refetch}
              onDelete={handleDelete}
              onConvert={handleConvert}
            />
          ))}
        </div>
      )}

      {visited.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-4">
            Already visited
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visited.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onChanged={refetch}
                onDelete={handleDelete}
                onConvert={handleConvert}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
