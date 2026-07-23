import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { RandomDateCandidate } from '../../types/randomDate';

const WEDGE_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-gold)',
  'var(--color-accent)',
  'var(--color-blush)',
  'var(--color-sky-tint)',
];

interface SpinWheelProps {
  candidates: RandomDateCandidate[];
  /** Index into `candidates` the wheel should land on. Changing this (with a new spinToken) triggers a spin. */
  winningIndex: number;
  /** Increment this to trigger a new spin, even if winningIndex repeats. */
  spinToken: number;
  onLanded: () => void;
}

function buildWheelBackground(count: number): string {
  const segment = 360 / count;
  const stops = Array.from({ length: count }, (_, i) => {
    const color = WEDGE_COLORS[i % WEDGE_COLORS.length];
    return `${color} ${i * segment}deg ${(i + 1) * segment}deg`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

export function SpinWheel({ candidates, winningIndex, spinToken, onLanded }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const count = candidates.length;

  useEffect(() => {
    if (count === 0 || spinToken === 0) return;

    const segment = 360 / count;
    const targetCenter = winningIndex * segment + segment / 2;
    // Small jitter so it doesn't always land dead-center of the wedge.
    const jitter = (Math.random() - 0.5) * segment * 0.5;

    setRotation((current) => {
      const neededDelta = (((-(targetCenter + jitter) - current) % 360) + 360) % 360;
      const extraSpins = 6 * 360;
      return current + neededDelta + extraSpins;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  if (count === 0) return null;

  return (
    <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
      {/* Pointer */}
      <div
        className="absolute left-1/2 -top-2 -translate-x-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '18px solid var(--color-accent-deep)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="h-full w-full rounded-full shadow-lift border-4 border-white"
        style={{ background: buildWheelBackground(count) }}
        animate={{ rotate: rotation }}
        transition={{ duration: 3.2, ease: [0.15, 0.7, 0.2, 1] }}
        onAnimationComplete={() => {
          if (spinToken > 0) onLanded();
        }}
      />

      {/* Center hub */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-soft text-2xl">
          ☕
        </div>
      </div>
    </div>
  );
}
