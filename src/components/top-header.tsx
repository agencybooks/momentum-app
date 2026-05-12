"use client"

import { Search, Sparkles } from "lucide-react"
import { useQueryState } from "nuqs"

export function TopHeader() {
  const [, setDrawer] = useQueryState("drawer")

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-zinc-950 dark:border-white/10 flex h-14 items-center justify-between px-4 sm:px-6">
      <button
        onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        className="group relative flex h-9 w-full max-w-sm items-center justify-between rounded-md border border-border/50 bg-muted/40 px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted/80 hover:text-foreground cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <span>Search or jump to...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDrawer("copilot-feed")}
          className="relative hover:bg-accent p-2 rounded-full cursor-pointer transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
          DA
        </div>
      </div>
    </header>
  )
}
