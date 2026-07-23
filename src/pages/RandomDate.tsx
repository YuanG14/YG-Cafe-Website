import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PillSelect } from '../components/ui/PillSelect';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { SpinWheel } from '../components/randomdate/SpinWheel';
import { ResultCard } from '../components/randomdate/ResultCard';
import { useCafes } from '../hooks/useCafes';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../lib/seo';
import { buildCandidatePool, MODE_COPY } from '../lib/randomDatePool';
import type { RandomDateMode, RandomDateCandidate } from '../types/randomDate';

const MODE_OPTIONS: { value: RandomDateMode; label: string }[] = (
  ['favorite', 'wishlist', 'budget', 'challenge'] as RandomDateMode[]
).map((mode) => ({ value: mode, label: MODE_COPY[mode].label }));

export function RandomDate() {
  usePageMeta({
    title: 'Pick for us',
    description: "Can't agree where to go? Let the wheel decide.",
  });
  const { cafes, loading: cafesLoading } = useCafes();
  const { items: wishlist, loading: wishlistLoading } = useWishlist();
  const { success } = useToast();

  const [mode, setMode] = useState<RandomDateMode>('favorite');
  const [budget, setBudget] = useState(500);
  const [spinToken, setSpinToken] = useState(0);
  const [winningIndex, setWinningIndex] = useState(0);
  const [pendingCandidate, setPendingCandidate] = useState<RandomDateCandidate | null>(null);
  const [revealedCandidate, setRevealedCandidate] = useState<RandomDateCandidate | null>(null);
  const [spinning, setSpinning] = useState(false);

  const loading = cafesLoading || wishlistLoading;

  const candidates = useMemo(
    () => buildCandidatePool(mode, cafes, wishlist, budget),
    [mode, cafes, wishlist, budget]
  );

  // Changing mode or budget invalidates whatever result is showing.
  useEffect(() => {
    setRevealedCandidate(null);
  }, [mode, budget]);

  function handleSpin() {
    if (candidates.length === 0 || spinning) return;
    const index = Math.floor(Math.random() * candidates.length);
    setWinningIndex(index);
    setPendingCandidate(candidates[index]);
    setRevealedCandidate(null);
    setSpinning(true);
    setSpinToken((t) => t + 1);
  }

  function handleLanded() {
    setSpinning(false);
    setRevealedCandidate(pendingCandidate);
    if (pendingCandidate) {
      success(`Tonight's pick: ${pendingCandidate.name}!`);
    }
  }

  const copy = MODE_COPY[mode];

  return (
    <PageContainer className="max-w-2xl">
      <SectionHeading
        eyebrow="Pick for us"
        title="Let the wheel decide."
        description="Can't agree where to go? Spin it out."
        align="center"
        className="mb-10"
      />

      <div className="flex flex-col items-center gap-6">
        <PillSelect label="Mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />

        {mode === 'budget' && (
          <div className="w-full max-w-xs">
            <TextField
              label="Max budget (₱)"
              type="number"
              min="0"
              step="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
            />
          </div>
        )}

        <p className="text-sm text-ink-soft text-center max-w-sm">{copy.description}</p>

        {loading ? (
          <p className="text-sm text-ink-soft">Loading your cafes…</p>
        ) : candidates.length === 0 ? (
          <div className="w-full rounded-card border border-dashed border-hairline px-8 py-14 text-center">
            <p className="text-ink-soft">{copy.emptyState}</p>
          </div>
        ) : (
          <>
            <SpinWheel
              candidates={candidates}
              winningIndex={winningIndex}
              spinToken={spinToken}
              onLanded={handleLanded}
            />

            <Button size="lg" onClick={handleSpin} disabled={spinning}>
              {spinning ? 'Spinning…' : revealedCandidate ? 'Spin again' : 'Spin the wheel'}
            </Button>
          </>
        )}

        {revealedCandidate && <ResultCard candidate={revealedCandidate} />}
      </div>
    </PageContainer>
  );
}
