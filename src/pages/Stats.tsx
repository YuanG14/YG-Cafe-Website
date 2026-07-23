import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Card } from '../components/ui/Card';
import { buttonStyles } from '../components/ui/Button';
import { StatCard } from '../components/stats/StatCard';
import { MonthlySpendingChart } from '../components/stats/MonthlySpendingChart';
import { VisitTimelineChart } from '../components/stats/VisitTimelineChart';
import { RatingsRadarChart } from '../components/stats/RatingsRadarChart';
import { TopCafesList } from '../components/stats/TopCafesList';
import { TopTagsList } from '../components/stats/TopTagsList';
import { useStats } from '../hooks/useStats';
import { formatCurrency } from '../lib/currency';

const statsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const statItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function Stats() {
  const {
    loading,
    error,
    hasData,
    summary,
    monthlySpending,
    visitTimeline,
    topCafes,
    ratingBreakdown,
    topTags,
  } = useStats();

  return (
    <PageContainer>
      <SectionHeading
        eyebrow="Our story"
        title="The numbers behind us."
        description="Every cafe, every rating, every peso — the trail we've left behind so far."
        className="mb-12"
      />

      {loading && <p className="text-sm text-ink-soft">Loading the numbers…</p>}

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && !hasData && (
        <div className="rounded-card border border-dashed border-hairline px-8 py-20 text-center">
          <p className="text-ink-soft mb-5">
            There's nothing to chart yet — add a cafe and this page fills itself in.
          </p>
          <Link to="/collection/new" className={buttonStyles('primary', 'lg')}>
            Add our first cafe
          </Link>
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="flex flex-col gap-8">
          {/* Summary row */}
          <Card className="px-6 sm:px-12 py-12">
            <motion.div
              variants={statsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
            >
              <StatCard variants={statItem} value={String(summary.totalCafes)} label="Cafes explored" />
              <StatCard variants={statItem} value={summary.avgOverall.toFixed(1)} label="Average rating" />
              <StatCard variants={statItem} value={String(summary.favoritesCount)} label="Favorites saved" />
              <StatCard
                variants={statItem}
                value={formatCurrency(summary.totalSpent)}
                label="Spent chasing good coffee"
              />
            </motion.div>
          </Card>

          {/* Timeline */}
          <motion.div {...sectionMotion}>
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium text-ink mb-1">Timeline</h2>
              <p className="text-sm text-ink-soft mb-6">
                How the collection has grown, month by month.
              </p>
              <VisitTimelineChart data={visitTimeline} />
            </Card>
          </motion.div>

          {/* Monthly spending */}
          <motion.div {...sectionMotion}>
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium text-ink mb-1">Monthly spending</h2>
              <p className="text-sm text-ink-soft mb-6">What each month of cafe dates has cost us.</p>
              <MonthlySpendingChart data={monthlySpending} />
            </Card>
          </motion.div>

          {/* Analytics + Top cafes */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div {...sectionMotion}>
              <Card className="p-6 sm:p-8 h-full">
                <h2 className="font-display text-2xl font-medium text-ink mb-1">Analytics</h2>
                <p className="text-sm text-ink-soft mb-6">
                  Where our ratings lean, and the tags we reach for most.
                </p>
                <RatingsRadarChart data={ratingBreakdown} />
                <div className="mt-6 pt-6 border-t border-hairline">
                  <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-faint mb-3">
                    Top tags
                  </h3>
                  <TopTagsList tags={topTags} />
                </div>
              </Card>
            </motion.div>

            <motion.div {...sectionMotion}>
              <Card className="p-6 sm:p-8 h-full">
                <h2 className="font-display text-2xl font-medium text-ink mb-1">Top cafes</h2>
                <p className="text-sm text-ink-soft mb-4">Our highest-rated spots, ranked.</p>
                <TopCafesList cafes={topCafes} />
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
