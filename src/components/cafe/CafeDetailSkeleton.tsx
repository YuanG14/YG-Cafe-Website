import { Skeleton } from '../ui/Skeleton';

export function CafeDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-40 mb-6 rounded-pill" />
      <Skeleton className="rounded-card aspect-[16/10] sm:aspect-[16/9] w-full" />

      <div className="mt-8 flex items-start justify-between gap-4">
        <Skeleton className="h-11 w-2/3" />
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-4 w-1/3 mt-3" />

      <div className="mt-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Skeleton className="rounded-card h-40 w-full" />
          <Skeleton className="rounded-card h-32 w-full" />
        </div>
        <div className="flex flex-col gap-8">
          <Skeleton className="rounded-card h-48 w-full" />
          <Skeleton className="rounded-card h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
