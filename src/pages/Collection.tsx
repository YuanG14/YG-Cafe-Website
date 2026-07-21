import { PageContainer } from '../components/layout/PageContainer';
import { ComingSoon } from '../components/layout/ComingSoon';

export function Collection() {
  return (
    <PageContainer>
      <ComingSoon
        eyebrow="The Collection"
        title="Our cafes will live here."
        description="Every place we've visited, with photos, ratings, and the little details worth remembering — arriving once the Cafe Collection phase is built."
        phase="Phase 3"
      />
    </PageContainer>
  );
}
