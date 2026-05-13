"use client"

import { Search, Sparkles, User, Bell, Lock, Users, CreditCard, LogOut } from "lucide-react"
import { useQueryState } from "nuqs"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

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
          className="relative hover:bg-brand-500/10 p-2 rounded-full cursor-pointer transition-colors"
        >
          <Sparkles className="h-4 w-4 text-brand-500" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 cursor-pointer transition-colors hover:bg-primary/20">
              DA
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-3 px-2 py-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-brand-500/15 text-brand-500 flex items-center justify-center text-xs font-bold border border-brand-500/25">
                    DA
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">David Aleckson</span>
                    <span className="text-xs text-muted-foreground">david@agencybooks.io</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem><User />Profile & Preferences</DropdownMenuItem>
              <DropdownMenuItem><Bell />Notifications</DropdownMenuItem>
              <DropdownMenuItem><Lock />Security</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem><Users />Team & Access</DropdownMenuItem>
              <DropdownMenuItem><CreditCard />Billing & Plan</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive"><LogOut />Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
