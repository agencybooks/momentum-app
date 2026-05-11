"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-full justify-start gap-3 h-auto px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 mx-2"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      <span className="dark:hidden">Light Mode</span>
      <span className="hidden dark:inline">Dark Mode</span>
    </Button>
  )
}
