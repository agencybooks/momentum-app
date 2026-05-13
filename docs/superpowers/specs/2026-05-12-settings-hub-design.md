# Settings & Administration Hub — Design Spec

## Context

The dashboard currently has a minimal `/settings` page showing QuickBooks sync status and basic profile info. Users need a centralized, predictable hub for managing personal preferences and agency-wide administration. The goal is "Jakob's Law" — feel completely standard so users accomplish their task and leave.

QuickBooks/integration content lives under `/calibration` and will not be duplicated here.

## Architecture

**Approach:** Nested layout with sub-routes (Next.js App Router).

### File Structure

```
src/app/settings/
├── layout.tsx              # SettingsLayout — nav rail + content wrapper
├── page.tsx                # redirect() to /settings/profile
├── profile/page.tsx        # Server component → ProfileContent
├── notifications/page.tsx  # Server component → NotificationsContent
├── security/page.tsx       # Server component → SecurityContent
├── team/page.tsx           # Server component → TeamContent
└── billing/page.tsx        # Server component → BillingContent

src/components/settings/
├── settings-nav.tsx         # Left nav rail (client component)
├── settings-section.tsx     # Reusable Card wrapper for config blocks
├── profile-content.tsx      # Client component — profile form
├── notifications-content.tsx
├── security-content.tsx
├── team-content.tsx
└── billing-content.tsx

src/lib/db/settings-data.ts  # Mock data for team, billing, user profile
```

### New shadcn Components Required

- `switch.tsx` — toggle switches for notifications, 2FA, etc.
- `dialog.tsx` — confirmation modals for destructive actions

Install via: `npx shadcn add switch dialog`

## Layout & Spatial Rules

### Settings Layout (`settings/layout.tsx`)

Two-column flex layout nested inside the existing root layout:

```
┌─────────────────────────────────────────────────────┐
│ [Root layout: sidebar + header already rendered]     │
│                                                     │
│  ┌──────────┬──────────────────────────────────┐    │
│  │ Nav Rail │  Content Area                    │    │
│  │ (w-60)   │  (flex-1, max-w-4xl, gap-8)     │    │
│  │          │                                  │    │
│  │ PERSONAL │  [Card blocks with forms/tables] │    │
│  │ ──────── │                                  │    │
│  │ Profile  │                                  │    │
│  │ Notifs   │                                  │    │
│  │ Security │                                  │    │
│  │          │                                  │    │
│  │ ADMIN    │                                  │    │
│  │ ──────── │                                  │    │
│  │ Team     │                                  │    │
│  │ Billing  │                                  │    │
│  └──────────┴──────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

- Nav rail: `w-60`, border-r, sticky top-0, self-start
- Content area: `flex-1 max-w-4xl py-2`
- Card spacing: `gap-8` (vertical rhythm between settings blocks)
- Form density: `text-sm` labels and helper text

### Nav Rail (`settings-nav.tsx`)

- Client component using `usePathname()` for active state
- Two category headers: "Personal Workspace" and "Agency Administration" (text-xs uppercase tracking-wide text-muted-foreground, with mt-6 between groups)
- Active link: `bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium` with rounded-md px-3 py-2
- Inactive link: `text-muted-foreground hover:text-foreground hover:bg-muted` with same padding
- Icons: User, Bell, Shield, Users, CreditCard (from lucide-react)

### Mobile Responsive

- Below `md` breakpoint: nav rail collapses into a horizontal scrollable row (`flex overflow-x-auto`) rendered above the content area
- Category headers hidden on mobile; all links in a single row
- Content area becomes full-width with standard padding

## Data Layer

### Types (add to `src/lib/db/types.ts`)

```typescript
export interface TeamMember {
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
  team: TeamMember[]
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

### Mock Data (`src/lib/db/settings-data.ts`)

Pre-seeded with:
- **Profile**: David Aleckson, david@agencybooks.io, theme: "system", timezone: "America/Chicago"
- **Team** (5 members):
  - David Aleckson — Admin, Active
  - Sarah Chen — Manager, Active
  - Marcus Johnson — Viewer, Active
  - Emily Rodriguez — Manager, Invited
  - Jake Thompson — Viewer, Active
- **Billing**:
  - Plan: "Pro Tier", $299/mo
  - Payment: Visa ending 4242, exp 12/27
  - 3 invoices (Paid, Paid, Pending)
- **Notifications**: daily digest on, weekly off, Slack not connected
- **Security**: 2FA disabled

### Service Functions (add to `src/lib/db/services.ts`)

```typescript
export async function getSettingsData(): Promise<SettingsData>
export async function getTeamMembers(): Promise<TeamMember[]>
export async function getBillingData(): Promise<SettingsData["billing"]>
```

Each wraps mock data with the existing `delay()` pattern.

## Page Content Specifications

### Profile (`/settings/profile`)

**Cards:**

1. **Profile Details** — First Name + Last Name inputs (side by side), Email input (full width), "Save Changes" button (disabled until dirty)
2. **Appearance** — Theme select (System/Light/Dark) — autosaves via `next-themes` `setTheme()`
3. **Timezone** — Select dropdown with common timezone options, explicit save

### Notifications (`/settings/notifications`)

**Cards:**

1. **Email Digest** — Two rows: "Daily Summary" switch + description, "Weekly Report" switch + description. Switches autosave with toast.
2. **Slack Integration** — Status badge (Connected/Not Connected) + "Connect Slack" button (or "Disconnect" if connected). Helper text explaining what notifications go to Slack.

### Security (`/settings/security`)

**Cards:**

1. **Change Password** — Three inputs: Current Password, New Password, Confirm Password. "Update Password" button. All mock — no real validation beyond matching confirm.
2. **Two-Factor Authentication** — Switch toggle + description text: "Add an extra layer of security to your account." Helper text under Admin role explanation.

### Team & Access (`/settings/team`)

**Layout:**

- Page header: "Team & Access" title + "Invite User" primary button (top-right)
- Table columns: Name (with avatar placeholder), Email, Role (Badge), Status (Badge), Actions (dropdown: "Change Role", "Revoke Access")
- Role badges: Admin = default variant, Manager = secondary, Viewer = outline
- Status badges: Active = default, Invited = secondary with italic
- "Revoke Access" triggers a Dialog: "Are you sure you want to revoke access for {name}? They will immediately lose access to all agency data." + Cancel/Revoke buttons (revoke is destructive variant)
- "Invite User" button opens Dialog with Name + Email + Role select + "Send Invite" button

### Billing & Plan (`/settings/billing`)

**Cards:**

1. **Current Plan** — Card showing plan name ("Pro Tier"), price ("$299/month"), and "Manage Plan" outline button
2. **Payment Method** — Card icon + "Visa ending in 4242" + expiry + "Update" outline button
3. **Invoice History** — Table: Date, Amount (font-mono), Status badge (Paid=default, Pending=secondary, Failed=destructive), Download icon button

## Interaction Patterns

### Save Workflows

| Type | Trigger | Feedback |
|------|---------|----------|
| Autosave toggle | Switch change | Toast: "Preferences saved" (2s auto-dismiss) |
| Autosave select | Theme/select change | Instant visual change + toast |
| Explicit save | "Save Changes" button | Button shows loading state → toast: "Changes saved" |
| Destructive | Dialog confirm | Toast: "Access revoked for {name}" + row removed from table |

### Toast Implementation

Use `sonner` (already compatible with shadcn patterns). Install via `npm install sonner`, add `<Toaster />` to settings layout. Lightweight, no extra state management needed.

### Role-Based Access (Mocked)

- A `CURRENT_USER_ROLE` constant defaults to `"Admin"` in settings-data.ts
- Team and Billing pages check this value
- If not Admin: content replaced with a centered empty state — Lock icon + "Admin Access Required" + "Contact your administrator to manage team and billing settings." in muted text
- Nav rail still shows both sections regardless of role (user can see where things are)

## Constraints

- **No Drawers** — all settings UI is route-based page content
- **No real auth/billing** — purely visual mock with toast feedback
- **No new global state** — forms use local useState, theme uses next-themes
- **Matches existing patterns** — server page → client content component, service functions with delay()

## Verification Plan

1. `npm run build` — ensure no type errors or build failures
2. `npm run dev` — navigate to each settings sub-route
3. Verify nav rail active states work correctly on each page
4. Test mobile responsive breakpoint (nav rail → horizontal row)
5. Test theme toggle actually switches theme
6. Test destructive dialog flow on Team page
7. Verify dark mode renders correctly across all pages
8. Check that `/settings` redirects to `/settings/profile`
