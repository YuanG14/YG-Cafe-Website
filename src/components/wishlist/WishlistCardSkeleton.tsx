import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export function WishlistCardSkeleton() {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-20 rounded-pill" />
      </div>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-3 pt-2 border-t border-hairline mt-1">
        <Skeleton className="h-9 w-28 rounded-pill" />
        <Skeleton className="h-4 w-12" />
      </div>
    </Card>
  );
}
