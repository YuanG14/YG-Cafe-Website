import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageMeta } from '../lib/seo';

/** Shown when a session has expired or isn't recognized — distinct from the
 *  ordinary "please log in" redirect that ProtectedRoute does silently. */
export function Unauthorized() {
  usePageMeta({ title: 'Session expired' });
  return (
    <PageContainer>
      <div className="flex flex-col items-center text-center py-16 sm:py-24">
        <SectionHeading
          eyebrow="401"
          title="You've been signed out."
          description="Your session ended — log back in to pick up where you left off."
          align="center"
        />
        <Link
          to="/login"
          className="mt-8 text-sm font-medium text-accent-deep hover:text-accent transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    </PageContainer>
  );
}
