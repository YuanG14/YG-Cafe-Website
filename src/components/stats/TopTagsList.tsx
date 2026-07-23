import { Badge } from '../ui/Badge';
import type { TagFrequency } from '../../lib/stats';

interface TopTagsListProps {
  tags: TagFrequency[];
}

/** The most-used tags across the collection — what we keep coming back to. */
export function TopTagsList({ tags }: TopTagsListProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-ink-faint">No tags logged yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <Badge key={tag} tone="sky" className="gap-1.5">
          {tag}
          <span className="text-accent-deep/60">×{count}</span>
        </Badge>
      ))}
    </div>
  );
}
