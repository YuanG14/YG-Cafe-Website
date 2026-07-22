import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

const STATS = [
  { value: '12', label: 'Cafes explored' },
  { value: '4.7', label: 'Average rating' },
  { value: '3', label: 'Favorites saved' },
  { value: '$286', label: 'Spent chasing good coffee' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function StatsPreview() {
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
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={item} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-medium text-primary-deep">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-xs text-ink-faint">
          Illustrative numbers — the real dashboard arrives in Phase 6.
        </p>
      </div>
    </section>
  );
}
