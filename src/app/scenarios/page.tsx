import { Suspense } from "react"
import { ScenariosSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { ScenariosPageContent } from "@/components/scenarios-page-content"

export default function ScenariosPage() {
  return (
    <Suspense fallback={<ScenariosSkeleton />}>
      <ScenariosPageContent />
    </Suspense>
  )
}
