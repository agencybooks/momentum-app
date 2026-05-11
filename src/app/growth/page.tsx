import { Suspense } from "react"
import { GrowthPageContent } from "@/components/growth-page-content"

export default function GrowthPage() {
  return (
    <Suspense>
      <GrowthPageContent />
    </Suspense>
  )
}
