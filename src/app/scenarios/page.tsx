import { Suspense } from "react"
import { ScenariosPageContent } from "@/components/scenarios-page-content"

export default function ScenariosPage() {
  return (
    <Suspense>
      <ScenariosPageContent />
    </Suspense>
  )
}
