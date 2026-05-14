# Component Consolidation — Phased Handoff for Gemini

This is a follow-up to the dark mode visual audit. It focuses on replacing custom components with shadcn/ui primitives where doing so fixes dark mode theming or accessibility problems. One phase per session, in order.

Before each session, tell Gemini to read `CLAUDE.md` and `audit/DARK-MODE-AUDIT-FINDINGS.md` for context.

---

## Phase 1: Install shadcn Progress Component & Replace Custom Progress Bars

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

The codebase has 15+ files that implement custom progress/bar visualizations using raw divs with inline style={{ width: `${percent}%` }}. These custom bars lack consistent dark mode styling (each file picks its own background colors), and they have no accessibility attributes (no role="progressbar", no aria-valuenow, etc.).

Install the shadcn Progress component via `npx shadcn add progress`.

Then audit every custom progress bar in the codebase. For each one, determine whether it's a true progress bar (a single deterministic value from 0-100%) or a proportional data visualization bar (like the concentration risk segments or stacked bars where multiple segments have different colors).

For true progress bars: replace with the shadcn Progress component.

For proportional/visualization bars that need per-segment coloring: keep the custom implementation but standardize the pattern — make sure they all use consistent height, border-radius, and token-based colors instead of ad-hoc styling.

Files to audit:
- src/components/open-invoices-widget.tsx
- src/components/pnl-table.tsx
- src/components/nrr-movers-list.tsx
- src/components/clients-page-content.tsx
- src/components/aging-buckets-summary.tsx
- src/components/concentration-risk-widget.tsx
- src/components/calibration/confidence-score.tsx
- src/components/drawers/anti-pnl-snapshot-drawer.tsx
- src/components/drawers/clients-kpi-drawers.tsx
- src/components/drawers/global-drawers.tsx

Do NOT force the shadcn Progress component onto data visualization bars that need custom per-segment colors. Those are not progress indicators.

Run npm run build when done.
```

---

## Phase 2: Fix Hardcoded Colors in financial-chart.tsx

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

The FinancialChart component at src/components/ui/custom/financial-chart.tsx is the only chart component with major dark mode theming gaps. It has approximately 11 hardcoded hex color values in its series configurations (#2AAADA, #a1a1aa, #f59e0b, #22c55e, #8b5cf6) that do not adapt to dark mode.

The component also has inline backgroundColor styles in its legend and tooltip rendering that bypass the theming system.

The shadcn chart system (in src/components/ui/chart.tsx) supports a ChartConfig object where each series can define colors as CSS variables or as { light: "#hex", dark: "#hex" } objects. All the other chart components in the project already use this correctly.

Fix the FinancialChart to use CSS variable references or the ChartConfig light/dark pattern instead of hardcoded hex values. Fix the legend and tooltip inline styles to use CSS variables or Tailwind classes.

After making changes, verify every page that uses FinancialChart still renders correctly — check /dashboard (Revenue vs. Expenses chart), and any drawer deep-dive charts that use it.

Run npm run build when done.
```

---

## Phase 3: Fix Remaining Hardcoded Chart Colors

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

Two more chart components have minor hardcoded color issues:

1. src/components/revenue-momentum-treemap.tsx has a hardcoded oklch color value used for the "Flat" status in its legend. This doesn't adapt to dark mode. Replace it with a CSS variable reference or Tailwind class.

2. src/components/trends/correlation-tooltip.tsx uses inline backgroundColor from a colors map passed as props. Trace the color source back to the parent components (correlation-chart.tsx and trends-page-content.tsx) and verify whether the colors in the map are theme-aware CSS variables or hardcoded hex values. If hardcoded, convert them to CSS variables.

Run npm run build when done.
```

---

## Phase 4: Standardize Custom Chart Tooltips

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

There are 5 custom chart tooltip implementations in the codebase. Custom tooltips are appropriate for Recharts (the library requires them for chart-specific formatting), but they should all use consistent dark mode styling.

The shadcn ChartTooltipContent in src/components/ui/chart.tsx establishes the standard: rounded-lg, border border-border/50, bg-background, text-foreground, shadow, with px-2.5 py-1.5 padding. Each custom tooltip should match this styling pattern.

Audit these tooltip implementations:
- src/components/cash-forecast-chart.tsx — custom CashTooltipContent
- src/components/margin-treemap.tsx — custom TreemapTooltipContent
- src/components/revenue-momentum-treemap.tsx — custom MomentumTooltipContent
- src/components/client-health-matrix.tsx — custom HealthTooltipContent
- src/components/trends/correlation-tooltip.tsx — custom CorrelationTooltip

For each one, check:
- Does the tooltip container use bg-background or bg-popover? (not hardcoded colors)
- Does the text use text-foreground / text-muted-foreground? (not hardcoded)
- Does it have border-border styling?
- Does the sizing and rounding match the shadcn tooltip pattern?

Fix any that deviate. The goal is that all chart tooltips look consistent in dark mode.

Run npm run build when done.
```

---

## Phase 5: Visual Verification

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

Do a final visual walkthrough of the entire app in dark mode, focusing specifically on the components changed in the previous phases:

1. Check all progress bars across the app — they should have consistent height, border-radius, and colors. Visit /clients, /cash, /profitability, /calibration, and open drawers to see bars in context.

2. Check all charts — every data series should be visible and readable on the dark background. Visit /dashboard (Revenue vs. Expenses), /profitability (waterfall), /cash (forecast chart), /growth (MRR Movement), /scenarios (Cash Trajectory), /trends (correlation chart with metrics selected), /clients (health matrix scatter).

3. Check chart tooltips — hover over chart data points and verify the tooltips have consistent dark mode styling (dark background, light text, visible border).

4. Open several drawers (click KPI cards on the dashboard) — check that any charts and progress bars inside drawers also render correctly.

Fix anything that looks wrong. Run npm run build when done.
```

---

## What This Does NOT Cover

- The HTML waterfall charts (bridge-waterfall, premium-waterfall) — they already use Tailwind classes correctly
- Adding shadcn components that aren't needed yet (Avatar, Skeleton, Breadcrumb)
- Refactoring the base-ui vs radix-ui primitive layer
- Changing the chart library
- Any non-dark-mode improvements
