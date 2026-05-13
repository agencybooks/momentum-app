import { Suspense } from "react"
import { TrendsPageContent } from "@/components/trends-page-content"

export default function TrendsPage() {
  return (
    <Suspense>
      <TrendsPageContent />
    </Suspense>
  )
}
