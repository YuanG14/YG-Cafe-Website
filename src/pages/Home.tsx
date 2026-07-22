import { PageContainer } from '../components/layout/PageContainer';
import { Hero } from '../components/home/Hero';
import { FeaturedMemories } from '../components/home/FeaturedMemories';
import { StatsPreview } from '../components/home/StatsPreview';
import { RandomDateCTA } from '../components/home/RandomDateCTA';

export function Home() {
  return (
    <PageContainer>
      <Hero />
      <FeaturedMemories />
      <StatsPreview />
      <RandomDateCTA />
    </PageContainer>
  );
}
