import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';
import { placeholderPhoto } from '../../lib/placeholderPhoto';

const STAMPS = ['☕', '🥐', '📖', '❤️', '📍'];

export function Hero() {
  return (
    <section className="grid gap-12 lg:grid-cols-2 lg:items-center pt-6 sm:pt-10 pb-20">
      {/* Text column */}
      <FadeIn className="flex flex-col items-start text-left order-2 lg:order-1">
        <Badge tone="pink" className="mb-6">A journal for two</Badge>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium text-ink text-balance">
          Every cup,
          <br />
          <span className="italic text-primary-deep">remembered.</span>
        </h1>
        <p className="mt-5 text-ink-soft text-lg max-w-md">
          A quiet little archive of every cafe we've shared — the good coffee,
          the long conversations, the ones we'd go back to in a heartbeat.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button size="lg" disabled title="Arrives in Phase 3">
            Add our first cafe
          </Button>
          <Button size="lg" variant="secondary" disabled title="Arrives in Phase 5">
            Pick a date for us
          </Button>
        </div>
      </FadeIn>

      {/* Photo collage column */}
      <FadeIn delay={0.1} className="relative order-1 lg:order-2">
        <div className="grid grid-cols-5 grid-rows-5 gap-4 h-[420px] sm:h-[480px]">
          <div className="col-span-3 row-span-5 rounded-card overflow-hidden shadow-lift">
            <img
              src={placeholderPhoto('hero-main', 700, 900)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-2 row-span-3 rounded-card overflow-hidden shadow-soft translate-y-4">
            <img
              src={placeholderPhoto('hero-side-1', 500, 600)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-2 row-span-2 rounded-card overflow-hidden shadow-soft translate-y-4 bg-primary/30 grid place-items-center">
            <span className="text-4xl" aria-hidden="true">
              ❤️
            </span>
          </div>
        </div>

        {/* Passport stamp — signature element, floats over the collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-full glass-panel border border-white/60 px-5 py-3 shadow-lift"
        >
          {STAMPS.map((glyph, i) => (
            <span key={i} className="text-lg" aria-hidden="true" style={{ transform: `rotate(${(i - 2) * 6}deg)` }}>
              {glyph}
            </span>
          ))}
        </motion.div>
      </FadeIn>
    </section>
  );
}
