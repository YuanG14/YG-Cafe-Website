import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const PREVIEWS = [
  {
    to: '/collection',
    icon: '☕',
    title: 'The Collection',
    copy: 'Every cafe we\'ve sat in together — photos, ratings, what we ordered, what we paid.',
    phase: 'Phase 3',
  },
  {
    to: '/wishlist',
    icon: '📍',
    title: 'The Wishlist',
    copy: 'Places we\'ve spotted and saved, ranked from "someday" to "must visit."',
    phase: 'Phase 4',
  },
  {
    to: '/random',
    icon: '🎲',
    title: 'Pick for Us',
    copy: 'Can\'t decide where to go? Let the app choose our next date.',
    phase: 'Phase 5',
  },
];

export function Home() {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-6 sm:pt-10 pb-20">
        <Badge tone="pink" className="mb-6">A journal for two</Badge>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium text-ink text-balance max-w-3xl">
          Every cup,
          <span className="italic text-primary-deep"> remembered.</span>
        </h1>
        <p className="mt-5 text-ink-soft text-lg max-w-md">
          A quiet little archive of every cafe we've shared — one page at a time.
        </p>
        <div className="mt-9 flex items-center gap-3">
          <Button size="lg" disabled title="Arrives in Phase 3">
            Add our first cafe
          </Button>
          <Button size="lg" variant="secondary" disabled title="Arrives in Phase 5">
            Pick a date for us
          </Button>
        </div>
      </section>

      {/* Passport-style stamp strip — the signature element */}
      <section aria-hidden="true" className="mb-20 flex justify-center">
        <div className="flex items-center gap-6 rounded-card glass-panel border border-white/60 px-8 py-6 shadow-soft">
          {['☕', '🥐', '📖', '❤️', '📍'].map((glyph, i) => (
            <span
              key={i}
              className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-accent/30 text-2xl text-accent-deep/80"
              style={{ transform: `rotate(${(i - 2) * 4}deg)` }}
            >
              {glyph}
            </span>
          ))}
        </div>
      </section>

      {/* Roadmap preview */}
      <section>
        <div className="grid gap-6 sm:grid-cols-3">
          {PREVIEWS.map((preview) => (
            <Card key={preview.to} className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-xl">
                  {preview.icon}
                </span>
                <Badge tone="sky">{preview.phase}</Badge>
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-ink mb-1.5">
                  {preview.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">{preview.copy}</p>
              </div>
              <Link
                to={preview.to}
                className="mt-auto text-sm font-medium text-accent-deep hover:text-accent transition-colors"
              >
                Take a look →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
