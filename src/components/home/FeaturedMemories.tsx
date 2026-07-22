import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { MemoryCard } from '../cafe/MemoryCard';

const FEATURED = [
  { seed: 'memory-1', name: 'Marble & Bean', dateVisited: 'March 2025', rating: 5, tag: 'Favorite' },
  { seed: 'memory-2', name: 'The Reading Room', dateVisited: 'January 2025', rating: 4, tag: 'Cozy' },
  { seed: 'memory-3', name: 'Sundown Espresso', dateVisited: 'November 2024', rating: 4.5, tag: 'Date night' },
  { seed: 'memory-4', name: 'Kyoto Coffee Bar', dateVisited: 'September 2024', rating: 5, tag: 'Favorite' },
];

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
  return (
    <section className="py-20">
      <SectionHeading
        eyebrow="From the collection"
        title="A few of our favorites."
        description="A preview of what the full Collection will hold — every cafe, in its own little frame."
        className="mb-10"
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {FEATURED.map((memory) => (
          <motion.div key={memory.seed} variants={item}>
            <MemoryCard {...memory} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
