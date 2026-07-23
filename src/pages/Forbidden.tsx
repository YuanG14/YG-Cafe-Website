import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageMeta } from '../lib/seo';

/** For signed-in users who reach something they don't have the role for. */
export function Forbidden() {
  usePageMeta({ title: 'Access restricted' });
  return (
    <PageContainer>
      <div className="flex flex-col items-center text-center py-16 sm:py-24">
        <SectionHeading
          eyebrow="403"
          title="This one isn't yours to open."
          description="You're signed in, but this page is restricted."
          align="center"
        />
        <Link
          to="/"
          className="mt-8 text-sm font-medium text-accent-deep hover:text-accent transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </PageContainer>
  );
}
