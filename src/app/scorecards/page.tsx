import { Suspense } from "react"
import { ScorecardsSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { getLivePulseData, getSnapshotLedger } from "@/lib/db/services"
import { ScorecardsPageContent } from "@/components/scorecards-page-content"

export default async function ScorecardsPage() {
  const [livePulse, ledgerEntries] = await Promise.all([
    getLivePulseData(),
    getSnapshotLedger(),
  ])

  return (
    <Suspense fallback={<ScorecardsSkeleton />}>
      <ScorecardsPageContent livePulse={livePulse} ledgerEntries={ledgerEntries} />
    </Suspense>
  )
}
