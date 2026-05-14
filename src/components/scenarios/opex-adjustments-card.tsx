"use client"

import { Settings, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OpExRow, SandboxAction } from "@/lib/scenarios/types"

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Month ${i + 1}`,
}))

interface OpExAdjustmentsCardProps {
  opex: OpExRow[]
  dispatch: React.Dispatch<SandboxAction>
}

export function OpExAdjustmentsCard({ opex, dispatch }: OpExAdjustmentsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold tracking-tight">OpEx Adjustments</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: 'ADD_OPEX' })}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>

      {opex.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No adjustments. Click &quot;Add Item&quot; to model operating expense changes.
        </p>
      ) : (
        <div className="space-y-3">
          {opex.map((row, idx) => (
            <div key={row.id}>
              {idx > 0 && <Separator className="mb-3" />}
              <div className="space-y-2">
                <Input
                  placeholder="Category (e.g. Marketing, Tools)..."
                  value={row.category}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_OPEX',
                      payload: { id: row.id, field: 'category', value: e.target.value },
                    })
                  }
                  className="h-8"
                />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="±  monthly change"
                      value={row.monthlyDelta || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        dispatch({
                          type: 'UPDATE_OPEX',
                          payload: { id: row.id, field: 'monthlyDelta', value: isNaN(val) ? 0 : val },
                        })
                      }}
                      className="pl-7 font-mono tabular-nums h-8"
                    />
                  </div>
                  <Select
                    value={String(row.startMonth)}
                    onValueChange={(val) =>
                      dispatch({
                        type: 'UPDATE_OPEX',
                        payload: { id: row.id, field: 'startMonth', value: parseInt(val as string) },
                      })
                    }
                  >
                    <SelectTrigger size="sm" className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch({ type: 'REMOVE_OPEX', payload: row.id })}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {row.monthlyDelta !== 0 && (
                  <p className="text-xs text-muted-foreground">
                    {row.monthlyDelta > 0 ? '+' : ''}${row.monthlyDelta.toLocaleString()}/mo
                    {row.monthlyDelta < 0 ? ' savings' : ' increase'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
