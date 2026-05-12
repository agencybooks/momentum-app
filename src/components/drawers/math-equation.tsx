import { Fragment } from "react"

export interface MathStep {
  left: { value: string; label: string }
  operator: "plus" | "minus" | "times" | "divided by"
  right: { value: string; label: string }
  result: { value: string; label: string }
}

const OPERATOR_SYMBOL: Record<MathStep["operator"], string> = {
  plus: "+",
  minus: "−",
  times: "×",
  "divided by": "÷",
}

export function MathEquation({ steps, label }: { steps: MathStep[]; label: string }) {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {label}
      </h3>
      <div className="rounded-xl border border-border/40 bg-zinc-100/60 dark:bg-black/40 px-5 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {steps.map((step, i) => (
            <Fragment key={i}>
              {i > 0 && <hr className="col-span-full border-border/40 my-4" />}
              <div className="text-center justify-self-center">
                <div className="text-xs text-muted-foreground mb-0.5">{step.left.label}</div>
                <div className="text-lg font-medium font-mono tabular-nums whitespace-nowrap">{step.left.value}</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800/50 flex items-center justify-center justify-self-center shrink-0">
                <span className="text-xs text-muted-foreground">{OPERATOR_SYMBOL[step.operator]}</span>
              </div>
              <div className="text-center justify-self-center">
                <div className="text-xs text-muted-foreground mb-0.5">{step.right.label}</div>
                <div className="text-lg font-medium font-mono tabular-nums whitespace-nowrap">{step.right.value}</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800/50 flex items-center justify-center justify-self-center shrink-0">
                <span className="text-xs text-muted-foreground">=</span>
              </div>
              <div className="text-center justify-self-center">
                <div className="text-xs text-muted-foreground mb-0.5">{step.result.label}</div>
                <div className="text-lg font-medium font-mono tabular-nums text-brand-500 whitespace-nowrap">{step.result.value}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
