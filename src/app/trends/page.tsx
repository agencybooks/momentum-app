import { Suspense } from "react"
import { TrendsSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { TrendsPageContent } from "@/components/trends-page-content"

export default function TrendsPage() {
  return (
    <Suspense fallback={<TrendsSkeleton />}>
      <TrendsPageContent />
    </Suspense>
  )
}
