import { Skeleton } from "@/components/ui/skeleton"

export function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
      ))}
    </div>
  )
}
