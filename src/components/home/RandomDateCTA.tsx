import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buttonStyles } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';

export function RandomDateCTA() {
  return (
    <section className="py-20">
      <FadeIn>
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary via-primary/70 to-secondary/70 px-8 sm:px-16 py-16 text-center shadow-lift">
          {/* Quiet ambient blooms, consistent with the rest of the site */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />

          <motion.span
            className="inline-block text-5xl"
            aria-hidden="true"
            whileHover={{ rotate: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            🎲
          </motion.span>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium text-ink text-balance max-w-lg mx-auto">
            Can't decide where to go next?
          </h2>
          <p className="mt-3 text-ink/80 max-w-md mx-auto">
            Let us choose for you — a favorite, a wishlist pick, or somewhere
            neither of you has tried.
          </p>

          <div className="mt-8">
            <Link to="/random" className={buttonStyles('secondary', 'lg')}>
              Take me to Pick for Us
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
