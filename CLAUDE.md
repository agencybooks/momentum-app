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
- **UI components**: shadcn/ui (`base-nova` style, Tailwind CSS variables, `@base-ui/react` primitives). Add components via `npx shadcn add <component>`. Existing: button, card, sheet, badge, table, dropdown-menu, select, input
- **Icons**: `lucide-react`
- **Charts**: `recharts` v3
- **Theming**: `next-themes` (system/light/dark), toggled in sidebar
- **URL state**: `nuqs` for query-string state management
- **Path alias**: `@/*` maps to `./src/*`

## Layout & Navigation

Root layout (`src/app/layout.tsx`) renders a fixed 256px left sidebar (`GlobalSidebar`) + scrollable main area with `p-8`. The root page (`/`) redirects to `/dashboard`.

8 top-level routes, each a folder under `src/app/` with a `page.tsx`:
`dashboard`, `scorecards`, `clients`, `profitability`, `cash`, `growth`, `scenarios`, `settings`

All page files are currently stubs (heading only). The sidebar nav items are defined inline in `src/components/global-sidebar.tsx`.

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
