import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { buttonStyles } from '../ui/Button';
import type { RandomDateCandidate } from '../../types/randomDate';

interface ResultCardProps {
  candidate: RandomDateCandidate;
}

export function ResultCard({ candidate }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10 mx-auto max-w-sm rounded-card bg-card border border-hairline shadow-lift overflow-hidden"
    >
      {candidate.photoUrl && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img src={candidate.photoUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-6 text-center">
        <Badge tone={candidate.kind === 'cafe' ? 'pink' : 'sky'} className="mb-3">
          {candidate.kind === 'cafe' ? 'From your collection' : 'From your wishlist'}
        </Badge>
        <h3 className="font-display text-2xl font-medium text-ink">{candidate.name}</h3>
        <p className="text-sm text-ink-soft mt-1">{candidate.subtitle}</p>

        <Link
          to={candidate.kind === 'cafe' ? `/collection/${candidate.id}` : '/wishlist'}
          className={buttonStyles('primary', 'md', 'mt-5')}
        >
          {candidate.kind === 'cafe' ? 'View this memory' : 'View on wishlist'}
        </Link>
      </div>
    </motion.div>
  );
}
