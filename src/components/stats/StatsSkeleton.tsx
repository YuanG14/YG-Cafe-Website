import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="px-6 sm:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-56 mb-6" />
        <Skeleton className="h-64 w-full" />
      </Card>

      <Card className="p-6 sm:p-8">
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-56 mb-6" />
        <Skeleton className="h-56 w-full" />
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 sm:p-8 h-full">
          <Skeleton className="h-6 w-28 mb-1" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-48 w-full" />
        </Card>
        <Card className="p-6 sm:p-8 h-full">
          <Skeleton className="h-6 w-28 mb-1" />
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-48 w-full" />
        </Card>
      </div>
    </div>
  );
}
