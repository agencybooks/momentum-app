import { getProfitabilityData } from "@/lib/db/services"
import { MetricAnchor } from "@/components/metric-anchor"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default async function ProfitabilityPage() {
  const { metrics, pnl } = await getProfitabilityData()

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)
    
  const formatPercent = (val: number) => 
    `${(val * 100).toFixed(0)}%`

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profitability & Margins</h1>
        <p className="text-muted-foreground mt-1">Detailed breakdown of revenue, costs, and net income.</p>
      </div>

      {/* Top 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          let formattedValue = metric.value.toString()
          let formattedTarget = metric.target?.toString()
          
          if (metric.title.includes("%") || metric.title.includes("Growth")) {
            formattedValue = formatPercent(metric.value as number)
            if (metric.target) formattedTarget = formatPercent(metric.target as number)
          } else if (metric.title.includes("Income") || metric.title.includes("MRR")) {
            formattedValue = formatCurrency(metric.value as number)
            if (metric.target) formattedTarget = formatCurrency(metric.target as number)
          }

          return (
            <MetricAnchor
              key={metric.id}
              title={metric.title}
              value={formattedValue}
              target={formattedTarget}
              trendText={metric.trendText}
              isHealthy={metric.isHealthy}
            />
          )
        })}
      </div>

      {/* P&L Waterfall Layout */}
      <Card className="p-8 border-border bg-card shadow-sm">
        <h2 className="text-lg font-medium text-foreground tracking-tight mb-6">P&L Waterfall (Month-to-Date)</h2>
        <div className="flex flex-col">
          {pnl.map((item) => {
            const isNetIncome = item.name.includes("Net Income")
            const isPositiveNetIncome = isNetIncome && item.amount >= 0
            
            return (
              <div 
                key={item.id} 
                className="flex justify-between items-center py-4 border-b border-border last:border-0"
              >
                <span className={cn(
                  item.isTotal ? "font-semibold text-foreground text-base" : 
                  item.isSubItem ? "pl-6 text-muted-foreground text-sm font-normal" : 
                  "font-medium text-foreground text-sm"
                )}>
                  {item.name}
                </span>
                
                <span className={cn(
                  "font-mono tabular-nums tracking-tight text-right",
                  item.isTotal ? "font-semibold text-foreground text-base" : 
                  item.isSubItem ? "text-muted-foreground text-sm font-normal" : 
                  "font-medium text-foreground text-sm",
                  isPositiveNetIncome ? "text-success" : 
                  (isNetIncome && !isPositiveNetIncome) ? "text-destructive" : ""
                )}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
