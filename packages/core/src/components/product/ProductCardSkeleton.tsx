import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const ProductCardSkeleton = ({ viewMode = 'grid' }: ProductCardSkeletonProps) => {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 rounded-lg border bg-card p-4">
        <Skeleton className="h-32 w-32 shrink-0 rounded-md" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
