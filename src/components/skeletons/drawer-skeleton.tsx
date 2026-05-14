import { Skeleton } from "@/components/ui/skeleton"

export function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Skeleton className="h-[100px] w-full rounded-xl" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  )
}
