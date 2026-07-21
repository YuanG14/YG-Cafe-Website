import { PageContainer } from '../components/layout/PageContainer';
import { ComingSoon } from '../components/layout/ComingSoon';

export function RandomDate() {
  return (
    <PageContainer>
      <ComingSoon
        eyebrow="Pick for Us"
        title="Let us decide, for once."
        description="A spin to choose our next cafe date — from a favorite, the wishlist, a tight budget, or somewhere neither of us has heard of."
        phase="Phase 5"
      />
    </PageContainer>
  );
}
