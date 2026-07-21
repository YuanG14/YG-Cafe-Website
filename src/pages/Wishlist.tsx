import { PageContainer } from '../components/layout/PageContainer';
import { ComingSoon } from '../components/layout/ComingSoon';

export function Wishlist() {
  return (
    <PageContainer>
      <ComingSoon
        eyebrow="The Wishlist"
        title="Places we're saving for later."
        description="Somewhere to keep the cafes we've spotted but haven't tried yet, ranked by how badly we want to go."
        phase="Phase 4"
      />
    </PageContainer>
  );
}
