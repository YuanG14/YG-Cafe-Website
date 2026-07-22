import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../ui/SectionHeading';
import { buttonStyles } from '../ui/Button';
import { MemoryCard } from '../cafe/MemoryCard';
import { useCafes } from '../../hooks/useCafes';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function FeaturedMemories() {
  const { cafes, loading, toggleFavorite } = useCafes();

  const featured = cafes.filter((c) => c.isFavorite).slice(0, 4);
  const preview = featured.length > 0 ? featured : cafes.slice(0, 4);

  return (
    <section className="py-20">
      <SectionHeading
        eyebrow="From the collection"
        title="A few of our favorites."
        description="A preview of the full Collection — every cafe, in its own little frame."
        className="mb-10"
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading your memories…</p>
      ) : preview.length === 0 ? (
        <div className="rounded-card border border-dashed border-hairline px-8 py-14 text-center">
          <p className="text-ink-soft mb-5">Nothing added yet — your first cafe starts the collection.</p>
          <Link to="/collection/new" className={buttonStyles('primary', 'md')}>
            Add our first cafe
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {preview.map((cafe) => (
            <motion.div key={cafe.id} variants={item}>
              <MemoryCard cafe={cafe} onToggleFavorite={toggleFavorite} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
