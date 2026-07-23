import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../ui/SectionHeading';
import { formatCurrency } from '../../lib/currency';
import { useStats } from '../../hooks/useStats';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function StatsPreview() {
  const { hasData, summary } = useStats();

  const stats = [
    { value: String(summary.totalCafes), label: 'Cafes explored' },
    { value: summary.avgOverall.toFixed(1), label: 'Average rating' },
    { value: String(summary.favoritesCount), label: 'Favorites saved' },
    { value: formatCurrency(summary.totalSpent), label: 'Spent chasing good coffee' },
  ];

  return (
    <section className="py-20">
      <div className="rounded-card bg-blush border border-hairline px-6 sm:px-12 py-14">
        <SectionHeading
          eyebrow="Our story so far"
          title="A peek at the numbers."
          align="center"
          className="mb-12"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={item} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-medium text-primary-deep">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {hasData && (
          <p className="mt-10 text-center text-xs text-ink-faint">
            <Link to="/stats" className="font-medium text-accent-deep hover:text-accent transition-colors">
              See the full dashboard →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
