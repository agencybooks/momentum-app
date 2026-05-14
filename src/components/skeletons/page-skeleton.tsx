import { Skeleton } from "@/components/ui/skeleton"
import { MetricsGridSkeleton } from "./metrics-grid-skeleton"
import { ChartSkeleton } from "./chart-skeleton"

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
      <MetricsGridSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
