import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';

export function NotFound() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center text-center py-16 sm:py-24">
        <SectionHeading
          eyebrow="404"
          title="This page wandered off."
          description="Wherever it went, it isn't here. Let's head back."
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
