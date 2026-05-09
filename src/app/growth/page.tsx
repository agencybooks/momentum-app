import React from "react"
import { TrendingUp } from "lucide-react"

export default function GrowthPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Growth Analytics</h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Advanced LTV:CAC and cohort analysis will be deployed in v2.0.
      </p>
    </div>
  )
}
