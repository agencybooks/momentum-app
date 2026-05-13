import { Suspense } from "react"
import { getCalibrationData } from "@/lib/db/services"
import { CalibrationContent } from "@/components/calibration-content"

export default async function CalibrationPage() {
  const data = await getCalibrationData()

  return (
    <Suspense>
      <CalibrationContent data={data} />
    </Suspense>
  )
}
