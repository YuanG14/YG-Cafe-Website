import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  variants?: Variants;
}

/** A single headline number in the summary row (cafes visited, avg rating, etc). */
export function StatCard({ value, label, variants }: StatCardProps) {
  return (
    <motion.div variants={variants} className="text-center">
      <p className="font-display text-4xl sm:text-5xl font-medium text-primary-deep">{value}</p>
      <p className="mt-2 text-sm text-ink-soft">{label}</p>
    </motion.div>
  );
}
