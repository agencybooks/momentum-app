import { Suspense } from "react"
import { GrowthSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { GrowthPageContent } from "@/components/growth-page-content"

export default function GrowthPage() {
  return (
    <Suspense fallback={<GrowthSkeleton />}>
      <GrowthPageContent />
    </Suspense>
  )
}
