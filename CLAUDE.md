# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Always envoke superpower skills when needed.

## Next.js Version Warning

This project runs **Next.js 16.2.6** (React 19). APIs, conventions, and file structure may differ from training data. **Always read the relevant guide in `node_modules/next/dist/docs/` before writing any code.** Heed deprecation notices.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint (flat config, core-web-vitals + typescript)
```

No test framework is configured yet.

## What This Is

Momentum OS -- a financial operations dashboard for agency founders. Not a passive reporting tool; it surfaces critical alerts, proves the math behind metrics, and links data to actionable workflows. See `ARCHITECTURE.md` for the full product manifesto including page blueprints, drawer specs, and design laws.

## Architecture

- **Framework**: Next.js 16 App Router, all RSC by default
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`, theme tokens defined in `src/app/globals.css` using OKLCH color space with CSS variables
- **UI components**: shadcn/ui (`base-nova` style, Tailwind CSS variables, `@base-ui/react` primitives). Add components via `npx shadcn add <component>`. Existing: button, card, sheet, badge, table, dropdown-menu, select, input, slider, tabs, checkbox, chart
- **Icons**: `lucide-react`
- **Charts**: Always use shadcn/ui chart components (`ChartContainer`, `ChartTooltip`, `ChartLegend`, etc.) instead of raw Recharts — they handle theming and responsive sizing consistently. Recharts v3 is the underlying engine but should not be used directly.
- **Theming**: `next-themes` (system/light/dark), toggled in sidebar
- **URL state**: `nuqs` for query-string state management
- **Path alias**: `@/*` maps to `./src/*`

## Layout & Navigation

Root layout (`src/app/layout.tsx`) renders a fixed 256px left sidebar (`GlobalSidebar`) + scrollable main area with `p-8`. The root page (`/`) redirects to `/dashboard`.

8 top-level routes, each a folder under `src/app/` with a `page.tsx`:
`dashboard`, `scorecards`, `clients`, `profitability`, `cash`, `growth`, `scenarios`, `settings`

One sub-route: `scorecards/april-2026/` (monthly scorecard detail).

All pages are fully built with data, charts, tables, and drawer interactions. Server components fetch data via async service functions; client components handle interactivity and drawer triggers via `nuqs`. The sidebar nav items are defined inline in `src/components/global-sidebar.tsx`.

## Drawer System

Two drawer orchestrators render in `layout.tsx`, both wrapped in `<Suspense>`:

- **`GlobalDrawer`** (`src/components/global-drawer.tsx`) -- routes by `?drawer=` query param to three standalone drawer components in `src/components/drawers/`: `ar-intelligence-drawer`, `action-center-drawer`, `client-ledger-drawer`. Supports `?clientId=` for client-scoped drawers. Micro drawers = 30vw, Macro (client-ledger) = 50vw.
- **`GlobalDrawers`** (`src/components/drawers/global-drawers.tsx`) -- large switch statement containing inline drawer content for metric deep-dives (m1-m10), page-specific drawers (u1-u9), universal ledger, and action center. Supports fullscreen toggle.

Both use `nuqs` `useQueryState("drawer")` so drawer state is URL-driven and shareable. Arch debt: `global-drawers.tsx` is ~930 lines and should eventually be split into individual drawer components.

## Data Layer (Mock)

All data currently comes from a mock layer in `src/lib/db/`:

- **`types.ts`** -- 12 TypeScript interfaces: `Client`, `Invoice`, `Transaction`, `MetricAnchor`, `Alert`, `RevenueExpenseTimeline`, `CashFlowTimeline`, `PnLLineItem`, `ExpenseVariance`, `ProfitabilityData`, `CashForecastPoint`, `Payable`
- **`mock-db.ts`** -- seeded arrays (10 clients, 13 invoices, 12 transactions, 6 metric anchors, 4 alerts) with intentional anomalies for testing exception reporting (Cobalt Outdoor 75d overdue, Acme Co 33% concentration, AWS +40% spike)
- **`services.ts`** -- async functions wrapping mock-db with `delay(300ms)` to simulate network latency. Key exports: `getClients`, `getClient`, `getInvoices`, `getOverdueInvoices`, `getCashData`, `getDashboardMetrics`, `getProfitabilityData`, `getFinancialTimeline`, `getRevenueExpenseTimeline`
- **`src/lib/mock-data.ts`** -- static chart/display data: `mockChartData`, `cashForecastData`, `PAYROLL_FLOOR`, `payables`

When replacing with a real backend, swap the implementations in `services.ts` -- the async function signatures are already the correct shape.

## Key Patterns

- **`MetricAnchor`** -- reusable KPI card. Accepts `value`, `target`, `trendText`, `trendDirection` ("up-is-good"/"down-is-good"), `isHealthy`, optional `onClick` for drawer triggers. Used across dashboard, cash, profitability, growth, and scorecard pages.
- **`CoPilotAlert`** -- contextual alert banner (critical/warning/success). Renders at Zone 1 of each page per ARCHITECTURE.md.
- **`MetricsGrid`** -- responsive grid wrapper for `MetricAnchor` arrays.
- **Page content split** -- complex client pages use a server component (page.tsx fetches data) + client component for interactivity: `cash-page-content.tsx`, `profitability-page-content.tsx`.
- **`SandboxTakeover`** -- full-screen scenario modeler on `/scenarios`. Checkbox + Slider + recharts LineChart for what-if analysis. Activated via `?sandbox=active`.

## Design Principles (from ARCHITECTURE.md)

1. **Insights Command** -- critical alerts at the top of every page (Zone 1)
2. **Flat hierarchy** -- no nested sidebars; use slide-out Drawers for depth (Micro 30%, Macro 50-60%)
3. **Actionable data** -- every data point links to a workflow, not just a display
4. **Exception reporting** -- failures sort to top, not buried in lists
5. **Zero empty states** -- every page loads with computed defaults, never blank

## Key Conventions

- Fonts: Geist Sans (body) + Geist Mono (code), loaded via `next/font/google`
- `cn()` utility in `src/lib/utils.ts` for merging Tailwind classes (clsx + tailwind-merge)
- Client components must have `"use client"` directive; prefer server components where possible
- shadcn components live in `src/components/ui/`; app-level components in `src/components/`
- Financial values use `font-mono tabular-nums` for alignment; Lucide icons only (no unicode emoji/symbols)
