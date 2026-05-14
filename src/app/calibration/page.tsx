import { Suspense } from "react"
import { CalibrationSkeleton } from "@/components/skeletons/page-specific-skeletons"
import { getCalibrationData } from "@/lib/db/services"
import { CalibrationContent } from "@/components/calibration-content"

export default async function CalibrationPage() {
  const data = await getCalibrationData()

  return (
    <Suspense fallback={<CalibrationSkeleton />}>
      <CalibrationContent data={data} />
    </Suspense>
  )
}
