import { Skeleton } from "@/components/ui/skeleton";

export default function OrderHistoryLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-8 w-36" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
