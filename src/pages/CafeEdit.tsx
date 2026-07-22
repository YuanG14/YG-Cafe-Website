import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CafeForm } from '../components/cafe/CafeForm';
import { useCafe } from '../hooks/useCafe';
import { updateCafe } from '../services/cafeService';
import type { Cafe, CafeInput } from '../types/cafe';

function toInput(cafe: Cafe): CafeInput {
  return {
    name: cafe.name,
    address: cafe.address ?? '',
    googleMapsUrl: cafe.googleMapsUrl ?? '',
    dateVisited: cafe.dateVisited,
    isFavorite: cafe.isFavorite,
    tags: cafe.tags,
    journalEntry: cafe.journalEntry ?? '',
    drinksOrdered: cafe.drinksOrdered,
    foodOrdered: cafe.foodOrdered,
    totalSpent: cafe.totalSpent,
    ratings: cafe.ratings,
  };
}

export function CafeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cafe, loading, error } = useCafe(id);

  async function handleSubmit(input: CafeInput) {
    if (!id) return;
    await updateCafe(id, input);
    navigate(`/collection/${id}`);
  }

  return (
    <PageContainer className="max-w-2xl">
      <SectionHeading eyebrow="Edit memory" title="Update this cafe." className="mb-10" />

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {cafe && (
        <CafeForm
          initialValue={toInput(cafe)}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/collection/${id}`)}
        />
      )}
    </PageContainer>
  );
}
