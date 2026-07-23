import { PageContainer } from '../components/layout/PageContainer';
import { Hero } from '../components/home/Hero';
import { FeaturedMemories } from '../components/home/FeaturedMemories';
import { StatsPreview } from '../components/home/StatsPreview';
import { RandomDateCTA } from '../components/home/RandomDateCTA';
import { usePageMeta } from '../lib/seo';

export function Home() {
  usePageMeta({
    title: 'Home',
    description: "Our private journal of every cafe we've shared together.",
  });
  return (
    <PageContainer>
      <Hero />
      <FeaturedMemories />
      <StatsPreview />
      <RandomDateCTA />
    </PageContainer>
  );
}
