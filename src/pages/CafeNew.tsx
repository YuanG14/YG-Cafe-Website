import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CafeForm } from '../components/cafe/CafeForm';
import { createCafe } from '../services/cafeService';
import { EMPTY_CAFE_INPUT } from '../types/cafe';
import { useAuth } from '../context/AuthContext';
import type { CafeInput } from '../types/cafe';

export function CafeNew() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleSubmit(input: CafeInput) {
    if (!user) return;
    const cafe = await createCafe(input, user.id);
    navigate(`/collection/${cafe.id}`);
  }

  return (
    <PageContainer className="max-w-2xl">
      <SectionHeading
        eyebrow="New memory"
        title="Add a cafe."
        description="You can always come back and add photos once it's saved."
        className="mb-10"
      />
      <CafeForm
        initialValue={EMPTY_CAFE_INPUT}
        submitLabel="Save cafe"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/collection')}
      />
    </PageContainer>
  );
}
