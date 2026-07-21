import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
}

/**
 * Placeholder route content, styled to match the design system rather than
 * a bare "TODO" — each real feature page will replace this in its own phase.
 */
export function ComingSoon({ eyebrow, title, description, phase }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24">
      <Badge tone="gold" className="mb-6">{phase}</Badge>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
    </div>
  );
}
