"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

interface ConfidenceScoreProps {
  score: number
}

export function ConfidenceScore({ score }: ConfidenceScoreProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedWidth(score), 100)
    return () => clearTimeout(timeout)
  }, [score])

  const isFull = score >= 100

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
        Data Confidence
      </div>
      <div className="relative w-48 h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-800 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        {isFull ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-warning" />
        )}
        <span className="text-sm font-mono font-semibold tabular-nums">
          {Math.round(score)}/100
        </span>
      </div>
    </div>
  )
}
