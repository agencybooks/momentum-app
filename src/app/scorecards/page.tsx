import { Suspense } from "react"
import { getLivePulseData, getSnapshotLedger } from "@/lib/db/services"
import { ScorecardsPageContent } from "@/components/scorecards-page-content"

export default async function ScorecardsPage() {
  const [livePulse, ledgerEntries] = await Promise.all([
    getLivePulseData(),
    getSnapshotLedger(),
  ])

  return (
    <Suspense>
      <ScorecardsPageContent livePulse={livePulse} ledgerEntries={ledgerEntries} />
    </Suspense>
  )
}
