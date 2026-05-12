import { Toaster } from "sonner"
import { SettingsNav, SettingsNavMobile } from "@/components/settings/settings-nav"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your workspace and account preferences.</p>
      </div>
      <SettingsNavMobile />
      <div className="flex gap-8">
        <SettingsNav />
        <div className="flex-1 max-w-4xl space-y-8">
          {children}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}
