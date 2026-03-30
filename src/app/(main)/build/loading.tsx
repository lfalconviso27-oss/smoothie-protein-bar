import { Skeleton } from "@/components/ui/skeleton";

export default function BuildLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <Skeleton className="h-1 w-full rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Nutrition summary */}
      <Skeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}
