import { PageContainer } from '../components/layout/PageContainer';
import { ComingSoon } from '../components/layout/ComingSoon';

export function Stats() {
  return (
    <PageContainer>
      <ComingSoon
        eyebrow="Our Story"
        title="The numbers behind us."
        description="Total cafes, favorite orders, how much we've spent chasing good coffee — once there's enough of a trail to look back on."
        phase="Phase 6"
      />
    </PageContainer>
  );
}
