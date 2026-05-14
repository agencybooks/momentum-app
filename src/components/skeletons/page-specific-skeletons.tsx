import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
    </div>
  )
}

export function MetricsGridSkeleton({ count = 5, columns = 5 }: { count?: number; columns?: number }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5")}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <MetricsGridSkeleton count={5} columns={5} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
        <Skeleton className="lg:col-span-1 h-[400px] w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function CashSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <MetricsGridSkeleton count={4} columns={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
        <Skeleton className="lg:col-span-1 h-[400px] w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function ClientsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <MetricsGridSkeleton count={4} columns={4} />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  )
}

export function ProfitabilitySkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <MetricsGridSkeleton count={4} columns={4} />
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function GrowthSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <MetricsGridSkeleton count={4} columns={4} />
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
        <Skeleton className="lg:col-span-1 h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function ScenariosSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function ScorecardsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Skeleton key="0" className="h-[250px] w-full rounded-xl" />
        <Skeleton key="1" className="h-[250px] w-full rounded-xl" />
        <Skeleton key="2" className="h-[250px] w-full rounded-xl" />
        <Skeleton key="3" className="h-[250px] w-full rounded-xl" />
        <Skeleton key="4" className="h-[250px] w-full rounded-xl" />
        <Skeleton key="5" className="h-[250px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export function TrendsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <div className="flex gap-6 w-full">
        <Skeleton className="w-[280px] h-[600px] shrink-0 rounded-xl" />
        <Skeleton className="flex-1 h-[600px] rounded-xl" />
      </div>
    </div>
  )
}

export function CalibrationSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <HeaderSkeleton />
      <Skeleton className="h-10 w-[400px] rounded-md" />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  )
}
