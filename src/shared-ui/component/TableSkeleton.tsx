import { Skeleton } from "@/components/ui/skeleton";

export interface TableSkeletonProps {
  readonly rows?: number;
  readonly columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  const headerKeys = Array.from(
    { length: columns },
    (_, idx) => `col-${idx + 1}`,
  );
  const rowKeys = Array.from({ length: rows }, (_, idx) => `row-${idx + 1}`);

  return (
    <div className="w-full space-y-3">
      {/* Header skeleton */}
      <div className="flex space-x-4 border-b pb-3">
        {headerKeys.map((colKey) => (
          <Skeleton key={colKey} className="h-4 flex-1" />
        ))}
      </div>
      {/* Row skeletons */}
      {rowKeys.map((rowKey) => (
        <div key={rowKey} className="flex items-center space-x-4 py-2">
          {headerKeys.map((colKey) => (
            <Skeleton key={`${rowKey}-${colKey}`} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
