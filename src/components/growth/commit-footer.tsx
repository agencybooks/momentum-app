interface CommitFooterProps {
  totalLift: number
}

export function CommitFooter({ totalLift }: CommitFooterProps) {
  return (
    <div className="-mx-6 -mb-6 px-6 py-6 rounded-b-xl bg-muted/10 border-t border-border/50 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">
          Total Projected Impact
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Estimated net-new MRR based on active lever adjustments.
        </p>
      </div>
      {/* mr-10 = 2.5rem offset to align with col-4 right edge */}
      <div className="shrink-0 mr-10 text-right text-3xl font-bold tracking-tight text-success font-mono tabular-nums">
        +${totalLift.toLocaleString()} / mo
      </div>
    </div>
  )
}
