# Settings & Administration Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page Settings & Administration hub with left nav rail, mock data layer, and interactive forms/tables.

**Architecture:** Nested App Router layout at `/settings` with sub-routes for each section (profile, notifications, security, team, billing). Server components fetch mock data via service functions; client components handle interactivity. Left nav rail provides two-section navigation (Personal Workspace + Agency Administration).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Base UI React, shadcn/ui components, lucide-react icons, next-themes, sonner (toasts)

---

## Task 1: Install Dependencies & Add shadcn Components

**Files:**
- Modify: `package.json`
- Create: `src/components/ui/switch.tsx` (via shadcn CLI)
- Create: `src/components/ui/dialog.tsx` (via shadcn CLI)

- [ ] **Step 1: Install sonner for toast notifications**

Run: `npm install sonner`
Expected: Package added to dependencies in package.json

- [ ] **Step 2: Add shadcn switch component**

Run: `npx shadcn@latest add switch`
Expected: `src/components/ui/switch.tsx` created

- [ ] **Step 3: Add shadcn dialog component**

Run: `npx shadcn@latest add dialog`
Expected: `src/components/ui/dialog.tsx` created

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/ui/switch.tsx src/components/ui/dialog.tsx
git commit -m "feat(settings): add sonner, switch, and dialog dependencies"
```

---

## Task 2: Data Layer — Types, Mock Data, Service Functions

**Files:**
- Modify: `src/lib/db/types.ts`
- Create: `src/lib/db/settings-data.ts`
- Modify: `src/lib/db/services.ts`

- [ ] **Step 1: Add settings types to types.ts**

Append to the end of `src/lib/db/types.ts`:

```typescript
// ---------------------------------------------------------------------------
// Settings & Administration
// ---------------------------------------------------------------------------

export interface SettingsTeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Viewer"
  status: "Active" | "Invited"
  avatarUrl?: string
}

export interface BillingInvoice {
  id: string
  date: string
  amount: number
  status: "Paid" | "Pending" | "Failed"
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  theme: "light" | "dark" | "system"
  timezone: string
}

export interface SettingsData {
  profile: UserProfile
  team: SettingsTeamMember[]
  billing: {
    plan: { name: string; price: number; interval: string }
    paymentMethod: { last4: string; brand: string; expiry: string }
    invoices: BillingInvoice[]
  }
  notifications: {
    emailDigestDaily: boolean
    emailDigestWeekly: boolean
    slackConnected: boolean
  }
  security: {
    twoFactorEnabled: boolean
  }
}
```

Note: Named `SettingsTeamMember` to avoid conflict with existing `TeamMember` interface used by calibration page (which has different fields: `monthlyCost`, `allocations`, etc.).

- [ ] **Step 2: Create settings mock data file**

Create `src/lib/db/settings-data.ts`:

```typescript
import type { SettingsData } from "./types"

export const CURRENT_USER_ROLE: "Admin" | "Manager" | "Viewer" = "Admin"

export const settingsData: SettingsData = {
  profile: {
    firstName: "David",
    lastName: "Aleckson",
    email: "david@agencybooks.io",
    theme: "system",
    timezone: "America/Chicago",
  },
  team: [
    {
      id: "tm-1",
      name: "David Aleckson",
      email: "david@agencybooks.io",
      role: "Admin",
      status: "Active",
    },
    {
      id: "tm-2",
      name: "Sarah Chen",
      email: "sarah@agencybooks.io",
      role: "Manager",
      status: "Active",
    },
    {
      id: "tm-3",
      name: "Marcus Johnson",
      email: "marcus@agencybooks.io",
      role: "Viewer",
      status: "Active",
    },
    {
      id: "tm-4",
      name: "Emily Rodriguez",
      email: "emily@agencybooks.io",
      role: "Manager",
      status: "Invited",
    },
    {
      id: "tm-5",
      name: "Jake Thompson",
      email: "jake@agencybooks.io",
      role: "Viewer",
      status: "Active",
    },
  ],
  billing: {
    plan: { name: "Pro Tier", price: 299, interval: "month" },
    paymentMethod: { last4: "4242", brand: "Visa", expiry: "12/27" },
    invoices: [
      { id: "inv-1", date: "2026-05-01", amount: 299, status: "Pending" },
      { id: "inv-2", date: "2026-04-01", amount: 299, status: "Paid" },
      { id: "inv-3", date: "2026-03-01", amount: 299, status: "Paid" },
    ],
  },
  notifications: {
    emailDigestDaily: true,
    emailDigestWeekly: false,
    slackConnected: false,
  },
  security: {
    twoFactorEnabled: false,
  },
}
```

- [ ] **Step 3: Add service functions to services.ts**

Append to `src/lib/db/services.ts`:

```typescript
import type { SettingsData } from './types';
import { settingsData } from './settings-data';

export async function getSettingsData(): Promise<SettingsData> {
  return delay(settingsData);
}
```

Note: The `SettingsData` import should be added to the existing import statement at the top of services.ts. The `settingsData` import is a new import line.

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/types.ts src/lib/db/settings-data.ts src/lib/db/services.ts
git commit -m "feat(settings): add settings data types, mock data, and service functions"
```

---

## Task 3: Settings Layout & Nav Rail

**Files:**
- Create: `src/app/settings/layout.tsx`
- Create: `src/components/settings/settings-nav.tsx`
- Modify: `src/app/settings/page.tsx` (replace with redirect)

- [ ] **Step 1: Create the settings nav rail component**

Create `src/components/settings/settings-nav.tsx`:

```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Bell, Shield, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const personalItems = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Security", href: "/settings/security", icon: Shield },
] as const

const adminItems = [
  { label: "Team & Access", href: "/settings/team", icon: Users },
  { label: "Billing & Plan", href: "/settings/billing", icon: CreditCard },
] as const

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-60 shrink-0 border-r border-border/40 dark:border-white/10 pr-6 sticky top-0 self-start">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-3">
          Personal Workspace
        </p>
        {personalItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-brand-600 dark:text-brand-400")} />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-3">
          Agency Administration
        </p>
        {adminItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-brand-600 dark:text-brand-400")} />
              {label}
            </Link>
          )
        })}
      </div>

      {/* Mobile: horizontal scrollable row */}
      <style>{`
        @media (max-width: 767px) {
          nav[class*="hidden md:block"] { display: none; }
        }
      `}</style>
    </nav>
  )
}

export function SettingsNavMobile() {
  const pathname = usePathname()
  const allItems = [...personalItems, ...adminItems]

  return (
    <nav className="md:hidden flex overflow-x-auto gap-1 border-b border-border/40 dark:border-white/10 pb-3 mb-6 -mx-2 px-2">
      {allItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors shrink-0",
              isActive
                ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Create the settings layout**

Create `src/app/settings/layout.tsx`:

```typescript
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
```

- [ ] **Step 3: Replace settings page.tsx with redirect**

Replace `src/app/settings/page.tsx`:

```typescript
import { redirect } from "next/navigation"

export default function SettingsPage() {
  redirect("/settings/profile")
}
```

- [ ] **Step 4: Verify build passes and redirect works**

Run: `npm run build`
Expected: Build succeeds. Navigating to `/settings` redirects to `/settings/profile`.

- [ ] **Step 5: Commit**

```bash
git add src/app/settings/layout.tsx src/app/settings/page.tsx src/components/settings/settings-nav.tsx
git commit -m "feat(settings): add settings layout with nav rail and redirect"
```

---

## Task 4: Profile Page

**Files:**
- Create: `src/app/settings/profile/page.tsx`
- Create: `src/components/settings/profile-content.tsx`

- [ ] **Step 1: Create the profile server page**

Create `src/app/settings/profile/page.tsx`:

```typescript
import { getSettingsData } from "@/lib/db/services"
import { ProfileContent } from "@/components/settings/profile-content"

export default async function ProfilePage() {
  const data = await getSettingsData()
  return <ProfileContent profile={data.profile} />
}
```

- [ ] **Step 2: Create the profile client component**

Create `src/components/settings/profile-content.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { UserProfile } from "@/lib/db/types"

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
]

export function ProfileContent({ profile }: { profile: UserProfile }) {
  const { setTheme, theme } = useTheme()
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [email, setEmail] = useState(profile.email)
  const [timezone, setTimezone] = useState(profile.timezone)
  const [saving, setSaving] = useState(false)

  const isDirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    email !== profile.email

  const isTimezoneDirty = timezone !== profile.timezone

  function handleSaveProfile() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Changes saved")
    }, 600)
  }

  function handleSaveTimezone() {
    toast.success("Timezone updated")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your personal information visible to your team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveProfile} disabled={!isDirty || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Momentum OS looks for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={theme}
              onValueChange={(val) => {
                setTheme(val)
                toast.success("Theme updated")
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timezone</CardTitle>
          <CardDescription>Used for scheduling and report timestamps.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Your Timezone</label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveTimezone} disabled={!isTimezoneDirty}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. `/settings/profile` renders the profile form.

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/profile/page.tsx src/components/settings/profile-content.tsx
git commit -m "feat(settings): add profile page with details, theme, and timezone"
```

---

## Task 5: Notifications Page

**Files:**
- Create: `src/app/settings/notifications/page.tsx`
- Create: `src/components/settings/notifications-content.tsx`

- [ ] **Step 1: Create the notifications server page**

Create `src/app/settings/notifications/page.tsx`:

```typescript
import { getSettingsData } from "@/lib/db/services"
import { NotificationsContent } from "@/components/settings/notifications-content"

export default async function NotificationsPage() {
  const data = await getSettingsData()
  return <NotificationsContent notifications={data.notifications} />
}
```

- [ ] **Step 2: Create the notifications client component**

Create `src/components/settings/notifications-content.tsx`:

```typescript
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SettingsData } from "@/lib/db/types"

export function NotificationsContent({
  notifications,
}: {
  notifications: SettingsData["notifications"]
}) {
  const [daily, setDaily] = useState(notifications.emailDigestDaily)
  const [weekly, setWeekly] = useState(notifications.emailDigestWeekly)
  const [slackConnected, setSlackConnected] = useState(notifications.slackConnected)

  function handleToggle(setter: (v: boolean) => void, value: boolean) {
    setter(value)
    toast.success("Preferences saved")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email Digest</CardTitle>
          <CardDescription>Control which summary emails you receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Summary</p>
              <p className="text-sm text-muted-foreground">
                A morning email with yesterday&apos;s key metrics and alerts.
              </p>
            </div>
            <Switch
              checked={daily}
              onCheckedChange={(val) => handleToggle(setDaily, val)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Report</p>
              <p className="text-sm text-muted-foreground">
                A Monday email summarizing the prior week&apos;s performance.
              </p>
            </div>
            <Switch
              checked={weekly}
              onCheckedChange={(val) => handleToggle(setWeekly, val)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
          <CardDescription>Receive real-time alerts in your Slack workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={slackConnected ? "default" : "secondary"}>
                {slackConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <Button
              variant={slackConnected ? "outline" : "default"}
              size="sm"
              onClick={() => {
                setSlackConnected(!slackConnected)
                toast.success(slackConnected ? "Slack disconnected" : "Slack connected")
              }}
            >
              {slackConnected ? "Disconnect" : "Connect Slack"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Critical alerts and cash flow warnings will be sent to your connected Slack channel.
          </p>
        </CardContent>
      </Card>
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. `/settings/notifications` renders toggle switches and Slack card.

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/notifications/page.tsx src/components/settings/notifications-content.tsx
git commit -m "feat(settings): add notifications page with email digest and slack"
```

---

## Task 6: Security Page

**Files:**
- Create: `src/app/settings/security/page.tsx`
- Create: `src/components/settings/security-content.tsx`

- [ ] **Step 1: Create the security server page**

Create `src/app/settings/security/page.tsx`:

```typescript
import { getSettingsData } from "@/lib/db/services"
import { SecurityContent } from "@/components/settings/security-content"

export default async function SecurityPage() {
  const data = await getSettingsData()
  return <SecurityContent security={data.security} />
}
```

- [ ] **Step 2: Create the security client component**

Create `src/components/settings/security-content.tsx`:

```typescript
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { SettingsData } from "@/lib/db/types"

export function SecurityContent({
  security,
}: {
  security: SettingsData["security"]
}) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled)
  const [saving, setSaving] = useState(false)

  const canSubmitPassword =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    newPassword === confirmPassword

  function handleUpdatePassword() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated")
    }, 600)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="max-w-sm"
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleUpdatePassword} disabled={!canSubmitPassword || saving}>
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Require a verification code in addition to your password when signing in.
              </p>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={(val) => {
                setTwoFactor(val)
                toast.success(val ? "Two-factor authentication enabled" : "Two-factor authentication disabled")
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. `/settings/security` renders password form and 2FA toggle.

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/security/page.tsx src/components/settings/security-content.tsx
git commit -m "feat(settings): add security page with password and 2FA"
```

---

## Task 7: Team & Access Page

**Files:**
- Create: `src/app/settings/team/page.tsx`
- Create: `src/components/settings/team-content.tsx`

- [ ] **Step 1: Create the team server page**

Create `src/app/settings/team/page.tsx`:

```typescript
import { getSettingsData } from "@/lib/db/services"
import { TeamContent } from "@/components/settings/team-content"
import { CURRENT_USER_ROLE } from "@/lib/db/settings-data"

export default async function TeamPage() {
  const data = await getSettingsData()
  return <TeamContent team={data.team} currentUserRole={CURRENT_USER_ROLE} />
}
```

- [ ] **Step 2: Create the team client component**

Create `src/components/settings/team-content.tsx`:

```typescript
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Lock, MoreHorizontal, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { SettingsTeamMember } from "@/lib/db/types"

const roleBadgeVariant: Record<SettingsTeamMember["role"], "default" | "secondary" | "outline"> = {
  Admin: "default",
  Manager: "secondary",
  Viewer: "outline",
}

export function TeamContent({
  team: initialTeam,
  currentUserRole,
}: {
  team: SettingsTeamMember[]
  currentUserRole: string
}) {
  const [team, setTeam] = useState(initialTeam)
  const [revokeTarget, setRevokeTarget] = useState<SettingsTeamMember | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<SettingsTeamMember["role"]>("Viewer")

  if (currentUserRole !== "Admin") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">Admin Access Required</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Contact your administrator to manage team and billing settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  function handleRevoke() {
    if (!revokeTarget) return
    setTeam((prev) => prev.filter((m) => m.id !== revokeTarget.id))
    toast.success(`Access revoked for ${revokeTarget.name}`)
    setRevokeTarget(null)
  }

  function handleInvite() {
    if (!inviteName || !inviteEmail) return
    const newMember: SettingsTeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "Invited",
    }
    setTeam((prev) => [...prev, newMember])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteName("")
    setInviteEmail("")
    setInviteRole("Viewer")
    setInviteOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team & Access</h2>
          <p className="text-sm text-muted-foreground">Manage who has access to your agency workspace.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant[member.role]}>{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setRevokeTarget(member)}
                        >
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access for {revokeTarget?.name}? They will immediately lose access to all agency data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevoke}>Revoke Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your agency workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as SettingsTeamMember["role"])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admins have full access to billing, team management, and all financial data.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteName || !inviteEmail}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. `/settings/team` renders team table with invite and revoke actions.

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/team/page.tsx src/components/settings/team-content.tsx
git commit -m "feat(settings): add team page with table, invite dialog, and revoke flow"
```

---

## Task 8: Billing & Plan Page

**Files:**
- Create: `src/app/settings/billing/page.tsx`
- Create: `src/components/settings/billing-content.tsx`

- [ ] **Step 1: Create the billing server page**

Create `src/app/settings/billing/page.tsx`:

```typescript
import { getSettingsData } from "@/lib/db/services"
import { BillingContent } from "@/components/settings/billing-content"
import { CURRENT_USER_ROLE } from "@/lib/db/settings-data"

export default async function BillingPage() {
  const data = await getSettingsData()
  return <BillingContent billing={data.billing} currentUserRole={CURRENT_USER_ROLE} />
}
```

- [ ] **Step 2: Create the billing client component**

Create `src/components/settings/billing-content.tsx`:

```typescript
"use client"

import { Lock, CreditCard, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SettingsData } from "@/lib/db/types"

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Paid: "default",
  Pending: "secondary",
  Failed: "destructive",
}

export function BillingContent({
  billing,
  currentUserRole,
}: {
  billing: SettingsData["billing"]
  currentUserRole: string
}) {
  if (currentUserRole !== "Admin") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">Admin Access Required</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Contact your administrator to manage team and billing settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active Momentum OS subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{billing.plan.name}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono tabular-nums">${billing.plan.price}</span>/{billing.plan.interval}
              </p>
            </div>
            <Button variant="outline">Manage Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>The card used for automatic billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {billing.paymentMethod.brand} ending in {billing.paymentMethod.last4}
                </p>
                <p className="text-xs text-muted-foreground">Expires {billing.paymentMethod.expiry}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Download past invoices for your records.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {billing.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[invoice.status]}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-xs">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. `/settings/billing` renders plan, payment, and invoice cards.

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/billing/page.tsx src/components/settings/billing-content.tsx
git commit -m "feat(settings): add billing page with plan, payment method, and invoices"
```

---

## Task 9: Final Verification & Polish

**Files:**
- All files from Tasks 1-8

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors. Fix any warnings if present.

- [ ] **Step 3: Manual verification in dev mode**

Run: `npm run dev`

Verify each of these:
1. `/settings` redirects to `/settings/profile`
2. Nav rail shows all 5 links with correct active states
3. Profile: name/email inputs work, Save Changes enables on edit, theme select switches theme, toast appears
4. Notifications: switches toggle with toast, Slack connect/disconnect works
5. Security: password form validates matching confirm, 2FA switch toggles with toast
6. Team: table renders 5 members, "Invite User" opens dialog, "Revoke Access" shows confirmation, member removed on confirm
7. Billing: plan/payment info displays, invoice table renders with status badges
8. Dark mode works across all pages
9. Mobile (< 768px): nav rail becomes horizontal scrollable row

- [ ] **Step 4: Fix any issues found**

Address any rendering or interaction bugs discovered during manual testing.

- [ ] **Step 5: Final commit (if fixes were needed)**

```bash
git add -A
git commit -m "fix(settings): address post-review polish issues"
```
