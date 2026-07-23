import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

/** Mirrors MemoryCard's proportions so the grid doesn't jump on load. */
export function MemoryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  );
}
