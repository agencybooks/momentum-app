# Momentum OS — Dark Mode Visual Audit Findings

**Date:** 2026-05-13
**Auditor:** Claude (acting as Senior SaaS UI/UX Designer)
**Scope:** Dark mode only — all 17 routes, 95+ components, drawer system
**Method:** Automated contrast measurement, Playwright screenshots, code-level component sweep, accessibility scan

---

## Executive Summary

The dark mode implementation is **functional and largely readable**, with strong primary text contrast (18-19:1) and semantic colors (destructive, success, warning) that all pass WCAG AA. However, the audit uncovered **4 critical issues**, **12 major issues**, and **15 minor issues** across six categories. The most impactful problems are:

1. A nearly invisible surface hierarchy (cards and page background are ~1:1 contrast)
2. Chart colors 3-5 that fail WCAG entirely (1.3-2.5:1)
3. Zero `prefers-reduced-motion` handling across the entire codebase
4. 16 locations bypassing the CSS variable system with hardcoded zinc/black values

Estimated remediation: **7 focused PRs, ~12-20 hours of implementation.**

---

## Measured Surface RGB Values (Dark Mode)

| Surface | CSS Source | Computed RGB | Hex |
|---------|-----------|-------------|-----|
| Body background | `--background: oklch(0.145 0 0)` | `rgb(10,10,10)` | `#0a0a0a` |
| Card (CSS var) | `--card: oklch(0.205 0 0)` | `rgb(23,23,23)` | `#171717` |
| Card (actual) | `dark:bg-zinc-950` in card.tsx | `rgb(9,9,11)` | `#09090b` |
| Main area | `dark:bg-black` in layout.tsx | `rgb(0,0,0)` | `#000000` |
| Muted (hover fills) | `--muted: oklch(0.269 0 0)` | `rgb(38,38,38)` | `#262626` |
| Sidebar / Header | `dark:bg-zinc-950` | `rgb(9,9,11)` | `#09090b` |

| Text | CSS Source | Computed RGB | Hex |
|------|-----------|-------------|-----|
| Foreground | `--foreground: oklch(0.985 0 0)` | `rgb(250,250,250)` | `#fafafa` |
| Muted foreground | `--muted-foreground: oklch(0.708 0 0)` | `rgb(161,161,161)` | `#a1a1a1` |
| Brand-500 | `#2AAADA` | `rgb(42,170,218)` | `#2aaada` |

---

## Contrast Ratio Measurements

### Text on Backgrounds (WCAG AA = 4.5:1, AAA = 7:1)

| Combination | Ratio | AA | AAA | Verdict |
|-------------|-------|----|----|---------|
| Foreground on body bg | 18.97:1 | PASS | PASS | Excellent |
| Foreground on card (var) | 17.18:1 | PASS | PASS | Excellent |
| Foreground on zinc-950 (actual card) | 19.06:1 | PASS | PASS | Excellent |
| Foreground on black (main area) | 20.12:1 | PASS | PASS | Excellent |
| Muted-fg on body bg | 7.66:1 | PASS | PASS | Good |
| Muted-fg on card (var) | 6.94:1 | PASS | Near | Acceptable |
| Muted-fg on zinc-950 | 7.70:1 | PASS | PASS | Good |
| Muted-fg on black | 8.13:1 | PASS | PASS | Good |
| Muted-fg on muted (hover bg) | 5.86:1 | PASS | FAIL | Watch |

### Brand & Semantic Colors on Backgrounds

| Combination | Ratio | AA | AAA | Verdict |
|-------------|-------|----|----|---------|
| Brand-500 on body bg | 7.41:1 | PASS | PASS | Excellent |
| Brand-500 on card (var) | 6.71:1 | PASS | Near | Good |
| Brand-500 on zinc-950 | 7.45:1 | PASS | PASS | Good |
| Brand-300 on zinc-950 | 11.66:1 | PASS | PASS | Excellent |
| Brand-600 on zinc-950 | 4.93:1 | PASS | FAIL | Caution |
| **Brand-700 on zinc-950** | **3.42:1** | **FAIL** | **FAIL** | **Not usable for text** |
| Destructive on card (var) | 6.21:1 | PASS | Near | Good |
| Destructive on zinc-950 | 6.89:1 | PASS | Near | Good |
| Success on card (var) | 7.51:1 | PASS | PASS | Excellent |
| Success on zinc-950 | 8.33:1 | PASS | PASS | Excellent |
| Warning on card (var) | 8.10:1 | PASS | PASS | Excellent |
| Warning on zinc-950 | 8.99:1 | PASS | PASS | Excellent |
| Emerald-400 on zinc-950 | 10.35:1 | PASS | PASS | Excellent |
| Amber-500 on zinc-950 | 9.26:1 | PASS | PASS | Excellent |

### Chart Colors on Dark Backgrounds (CRITICAL)

| Combination | Ratio | AA | Verdict |
|-------------|-------|----|---------|
| Chart-1 on zinc-950 | 13.42:1 | PASS | Fine (but very light gray, unusual) |
| Chart-2 on zinc-950 | 4.20:1 | FAIL normal, PASS large | Borderline |
| **Chart-3 on zinc-950** | **2.55:1** | **FAIL** | **Hard to see** |
| **Chart-4 on zinc-950** | **1.92:1** | **FAIL** | **Nearly invisible** |
| **Chart-5 on zinc-950** | **1.31:1** | **FAIL** | **Invisible** |

### Surface-to-Surface Contrast (Elevation Hierarchy)

| Combination | Ratio | Verdict |
|-------------|-------|---------|
| Card (var) vs body bg | 1.10:1 | Barely distinguishable |
| **Zinc-950 vs body bg** | **1.00:1** | **Indistinguishable** |
| Zinc-950 vs black | 1.06:1 | Barely distinguishable |
| Muted vs card (var) | 1.18:1 | Barely visible hover state |
| Muted vs zinc-950 | 1.31:1 | Marginal |

### Focus/Ring Visibility

| Combination | Ratio | Verdict |
|-------------|-------|---------|
| Ring on body bg | 4.18:1 | Meets 3:1 at full opacity |
| Ring on zinc-950 | 4.20:1 | Meets 3:1 at full opacity |
| **Ring at 50% opacity (actual)** | **~2.1:1** | **FAILS 3:1 minimum for UI components** |
| **Sidebar-primary on zinc-950** | **2.91:1** | **FAILS 3:1 minimum** |

---

## Findings by Category

### CRITICAL (Fix before any release)

---

#### F-01: Surface Hierarchy is Flat — Cards Indistinguishable from Background

**Severity:** CRITICAL
**Category:** Surfaces
**Location:** `src/components/ui/card.tsx:15`, `src/app/layout.tsx` (main bg)

**Issue:** The card component uses `dark:bg-zinc-950` (rgb 9,9,11) which is essentially identical to the body `--background` (rgb 10,10,10) — contrast ratio of 1.00:1. Cards don't visually float above the page. The CSS variable `--card: oklch(0.205 0 0)` (rgb 23,23,23) is defined correctly but completely ignored because the hardcoded `dark:bg-zinc-950` override takes precedence.

**Impact:** Cards blend into the page background. The entire visual hierarchy collapses in dark mode — every card, table wrapper, and content container is invisible against the page.

**Fix:** Remove `dark:bg-zinc-950` from card.tsx. The CSS variable `--card` will automatically apply. Alternatively, if `--background` needs to stay at oklch(0.145), adjust `--card` to oklch(0.22-0.25) for visible elevation. Target at minimum 1.15:1 surface contrast (Material Design recommends 1.12:1 minimum).

---

#### F-02: Chart Colors 3-5 Invisible in Dark Mode

**Severity:** CRITICAL
**Category:** Color
**Location:** `src/app/globals.css:121-125`

**Issue:** Chart color tokens are identical in light and dark mode. Chart-3 through chart-5 have contrast ratios of 2.55:1, 1.92:1, and 1.31:1 against dark backgrounds — effectively invisible. Even chart-2 at 4.20:1 fails AA for normal text.

**Impact:** Any chart using the default chart color palette has invisible data series in dark mode.

**Fix:** Add dark-mode-specific chart tokens in the `.dark` block:
```css
--chart-1: oklch(0.269 0 0);  /* invert: dark first */
--chart-2: oklch(0.371 0 0);
--chart-3: oklch(0.556 0 0);
--chart-4: oklch(0.708 0 0);
--chart-5: oklch(0.87 0 0);   /* lightest last */
```

---

#### F-03: No `prefers-reduced-motion` Handling

**Severity:** CRITICAL
**Category:** Accessibility
**Location:** `src/app/globals.css` (global), all components with `transition-*` and `animate-*`

**Issue:** Zero instances of `@media (prefers-reduced-motion)` in the entire codebase. The `.pulse-dot` keyframe animation (globals.css:167-173) runs infinitely. 40+ components use `transition-all`, `transition-colors`, or `duration-200/300`. Drawer slide animations, card hover transitions, and accordion animations all ignore this setting.

**Impact:** Users with vestibular disorders or motion sensitivity cannot use the app comfortably. This is a WCAG 2.1 SC 2.3.3 failure.

**Fix:** Add to globals.css:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

#### F-04: Focus Ring Fails 3:1 Minimum at Applied Opacity

**Severity:** CRITICAL
**Category:** States / Accessibility
**Location:** `src/components/ui/button.tsx`, all interactive components

**Issue:** Focus rings use `focus-visible:ring-ring/50` — the ring token is oklch(0.556) in dark mode, which achieves 4.20:1 at full opacity. But at 50% opacity the effective contrast drops to approximately 2.1:1, failing the WCAG 2.1 SC 1.4.11 minimum of 3:1 for UI component boundaries.

**Impact:** Keyboard-only users cannot reliably see which element is focused in dark mode.

**Fix:** Either increase ring opacity to 75% (`ring-ring/75`) or brighten the `--ring` token in dark mode to oklch(0.75 0 0) or higher.

---

### MAJOR (Fix in current sprint)

---

#### F-05: 16 Hardcoded Background Overrides Bypass Token System

**Severity:** MAJOR
**Category:** Color
**Locations:**
- `ui/card.tsx:15` — `dark:bg-zinc-950`
- `global-sidebar.tsx:42` — `dark:bg-zinc-950`
- `top-header.tsx:19` — `dark:bg-zinc-950`
- `global-sidebar.tsx:45` — `dark:bg-zinc-800`
- `drawers/math-equation.tsx:23,32,39` — `dark:bg-black/40`, `dark:bg-zinc-800/50` (2x)
- `drawers/anti-pnl-snapshot-drawer.tsx:116,130` — `dark:bg-black/20` (2x)
- `cash-page-content.tsx:299,421` — `dark:bg-zinc-900/30` (2x)
- `client-diagnostic-expanded.tsx:141` — `dark:bg-zinc-900/50`
- `client-shock-test.tsx:27` — `dark:bg-zinc-900/20`
- `recent-scorecards-list.tsx:84` — `dark:bg-zinc-900/40`
- `drawers/action-insight-drawer.tsx:75,79,83,87` — `dark:bg-zinc-900/40` (4x)

**Fix:** Replace with CSS variable references. For nested/inset surfaces, introduce a new token `--surface-inset` for the zinc-900/* pattern.

---

#### F-06: 26 Instances of 10px Text with Muted Foreground

**Severity:** MAJOR
**Category:** Typography / Contrast
**Key Locations:** `metric-anchor.tsx:97`, `cash-page-content.tsx:287,313,397`, `payable-action-group.tsx:29,40,50`, `aging-buckets-summary.tsx:54`, `spend-vector-card.tsx:89,92`, `drawers/global-drawers.tsx:86,93,700,721,946`

**Issue:** `text-[10px]` paired with `text-muted-foreground` at rgb(161,161,161). While muted-fg passes AA at normal size (6.94-7.70:1), WCAG requires 4.5:1 for text below 18px/14px bold. At 10px, readability is marginal even with passing contrast ratios — the glyphs become too small for comfortable reading on dark backgrounds.

**Fix:** Increase minimum text size to `text-xs` (12px) across the board, or ensure 10px text uses `text-foreground` instead of `text-muted-foreground`.

---

#### F-07: Sidebar Primary Blue Fails 3:1 Minimum

**Severity:** MAJOR
**Category:** Color
**Location:** `src/app/globals.css:128`

**Issue:** `--sidebar-primary: oklch(0.488 0.243 264.376)` is the only chromatic (hued) token unique to dark mode. It achieves only 2.91:1 against the sidebar background (zinc-950). This fails the WCAG 3:1 minimum for UI components.

**Fix:** Lighten to oklch(0.55-0.60 0.2 264) to achieve 3:1+.

---

#### F-08: Brand-700 Fails AA on Dark Backgrounds

**Severity:** MAJOR
**Category:** Color
**Location:** `src/app/globals.css:54` (theme definition)

**Issue:** `brand-700` (#166d8d) achieves only 3.42:1 on zinc-950. It fails AA for normal text and barely passes the 3:1 UI minimum. This color is too dark for dark mode use.

**Fix:** Add dark mode brand color overrides. In dark mode, invert the brand scale — use brand-300 where brand-700 would be in light mode, brand-400 where brand-600 would be.

---

#### F-09: Border Opacity Has No Semantic Hierarchy

**Severity:** MAJOR
**Category:** Color
**Locations:** 35+ files

**Issue:** Four different border opacity values are used interchangeably — `border-border/40` (~15 uses), `border-border/50` (~12 uses), `border-border/60` (~3 uses), and `dark:border-white/10` (~5 uses) — with no clear semantic meaning. The sidebar and header use `dark:border-white/10` (bypassing the `--border` token), while cards use `border-border/60`.

**Fix:** Standardize to two tiers: `border-border` (full token, 10% white in dark mode) for primary dividers, and `border-border/50` for subtle/secondary dividers. Remove all `dark:border-white/*` overrides.

---

#### F-10: Shadows Invisible on Dark Backgrounds

**Severity:** MAJOR
**Category:** Surfaces
**Locations:** 30+ component files

**Issue:** 18 instances of `shadow-sm`, 7 of `shadow-md`, 2 of `shadow-lg/xl`, and 1 of `shadow-2xl`. Default Tailwind shadows use `rgba(0,0,0,0.05-0.25)` — on a near-black background, these are completely invisible. Card hover `shadow-md` provides no visual feedback. Tooltip `shadow-xl` adds no depth.

**Fix:** Either (a) add dark-mode-specific shadow values using lighter colors (e.g., `rgba(255,255,255,0.05)`), or (b) replace shadow-based elevation with border brightening in dark mode (`dark:hover:border-border`).

---

#### F-11: No Skip-to-Content Link

**Severity:** MAJOR
**Category:** Accessibility
**Location:** `src/app/layout.tsx`

**Issue:** No skip-to-content link exists. Keyboard users must tab through the entire 10-item sidebar before reaching page content.

**Fix:** Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` before GlobalSidebar, and `id="main-content"` on the `<main>` element.

---

#### F-12: Chart Components Lack All Accessibility Markup

**Severity:** MAJOR
**Category:** Accessibility
**Locations:** `ui/chart.tsx`, `cash-forecast-chart.tsx`, `unit-economics-chart.tsx`, `scenarios/oracle-chart.tsx`, `trends/correlation-chart.tsx`, all waterfall and treemap components

**Issue:** No chart has `role="img"`, `aria-label`, or `aria-describedby`. Screen reader users receive no information about chart content. There are no fallback data tables.

**Fix:** Add `role="img"` and `aria-label` describing the chart title and key insight to each ChartContainer. Consider adding `<details><summary>View data table</summary>...</details>` for accessibility.

---

#### F-13: Sidebar Nav Touch Targets Below 44px Minimum

**Severity:** MAJOR
**Category:** Spacing / Accessibility
**Location:** `src/components/global-sidebar.tsx:62`

**Issue:** Nav items use `py-2 px-3` (8px vertical + ~14-16px text height) producing approximately 30-32px tall touch targets. WCAG 2.5.5 (Enhanced) requires 44x44px minimum. Even WCAG 2.5.8 (Level AA in 2.2) requires 24x24px with sufficient spacing.

**Fix:** Increase to `py-2.5` or `py-3` to achieve minimum 40-44px height. The `mb-1` gap is too small — increase to `gap-1` (4px) on the parent flex container.

---

#### F-14: Inconsistent Hover State Opacity in Dark Mode

**Severity:** MAJOR
**Category:** States
**Locations:** Multiple component files

**Issue:** Dark hover states use wildly different opacity values with no semantic meaning:
- `dark:hover:bg-white/5` (sidebar, some lists)
- `dark:hover:bg-white/[0.02]` (spend vector)
- `dark:hover:bg-white/[0.03]` (anti-pnl drawer)
- `dark:hover:bg-zinc-900/40` (spend vector)
- `dark:hover:bg-muted/50` (button ghost)
- `dark:hover:bg-input/50` (select)
- `dark:hover:bg-brand-400` (locked margin, action insight)

**Fix:** Standardize to 2-3 hover patterns: `hover:bg-accent/50` for subtle (replaces white/5, white/[0.02]), `hover:bg-muted/50` for standard, `hover:bg-brand-500/15` for accent.

---

#### F-15: 6+ Icon-Only Buttons Missing aria-label

**Severity:** MAJOR
**Category:** Accessibility
**Locations:**
- `global-drawer.tsx:79-85` — fullscreen toggle
- `drawers/global-drawers.tsx` — fullscreen toggle
- `settings/billing-content.tsx` — download button
- `settings/team-content.tsx` — more menu (MoreHorizontal icon)

**Fix:** Add `aria-label` describing the action to each icon-only button.

---

#### F-16: Inline Styles with Hardcoded Colors Ignore Dark Mode

**Severity:** MAJOR
**Category:** Color
**Locations:**
- `revenue-momentum-treemap.tsx:507` — `style={{ backgroundColor: item.colorStyle }}`
- `ui/chart.tsx:318` — `backgroundColor: item.color`
- `ui/custom/financial-chart.tsx:132,189` — `backgroundColor` from `s.color`
- `client-health-matrix.tsx:195` — `style={{ backgroundColor: "var(--color-brand-500)" }}`
- `trends/correlation-tooltip.tsx:51` — `backgroundColor` from `colors.get()`

**Issue:** Inline styles don't respond to dark mode class changes. If the source colors are light-mode-appropriate hex values, they'll be wrong in dark mode.

**Fix:** Use CSS variables in inline styles, or conditionally select dark/light colors via `useTheme()`.

---

### MINOR (Fix in next sprint)

---

#### F-17: Trends Page Uses text-2xl Instead of text-3xl for Title
**Location:** `src/components/trends-page-content.tsx:57`
**Fix:** Change to `text-3xl font-semibold tracking-tight` to match all other pages.

#### F-18: Dashboard Section Titles Missing tracking-tight
**Location:** `src/app/dashboard/page.tsx:88,99`
**Fix:** Add `tracking-tight` to "Revenue vs. Expenses" and "Worth Doing This Week" titles.

#### F-19: Profitability Section Title Undersized
**Location:** `src/components/profitability-content.tsx:160`
**Issue:** Uses `text-sm font-semibold` instead of `text-lg font-medium tracking-tight`.

#### F-20: Trends Page Missing gap-8 Outer Container
**Location:** `src/components/trends-page-content.tsx:55`
**Issue:** Uses `<div>` with `mb-6` instead of `flex flex-col gap-8` pattern.

#### F-21: Growth Page Uses gap-8 Instead of gap-6 for Card Grid
**Location:** `src/components/growth-page-content.tsx:75`
**Issue:** 3-column grid uses `gap-8` instead of the standard `gap-6`.

#### F-22: Settings Pages Lack Standard Container Structure
**Locations:** All `src/components/settings/*-content.tsx` files
**Issue:** No `flex flex-col gap-8` wrapper. Cards are direct children without standardized spacing.

#### F-23: Profitability Cards Use Split Padding
**Location:** `src/components/profitability-content.tsx:132,135,159`
**Issue:** Uses `px-6 pt-6 pb-2`, `px-6 pb-6`, `px-6 pt-5 pb-3` instead of uniform `p-6`.

#### F-24: Drawer Overlay May Be Too Opaque
**Location:** `src/components/ui/sheet.tsx`
**Issue:** `dark:bg-background/80` — 80% opacity makes background content nearly invisible. Consider 60-70% for better context awareness.

#### F-25: KPI Card Titles Truncating Across Multiple Pages
**Observed on:** Dashboard, Clients, Profitability, Cash, Growth
**Issue:** MetricAnchor titles truncate ("TOTA...", "NET R...", "OPERATING M...", "NET BURN/...") due to fixed 140px card height + competing trend/goal text. The `truncate` class cuts titles that are longer than the available space.
**Fix:** Consider two-line titles, or abbreviate the titles in the data layer.

#### F-26: `text-white` Used Without Dark Mode Consideration
**Locations:** `locked-margin-cell.tsx:84`, `concentration-risk-widget.tsx:44,46`, `drawers/action-insight-drawer.tsx:124`, `drawers/global-drawers.tsx:853`
**Issue:** `text-white` is used for text on colored backgrounds (brand buttons, concentration risk bars). While this works in both modes, it bypasses the semantic token system.

#### F-27: Focus Trap Lacks Explicit Focus Restoration
**Location:** `src/components/global-drawer.tsx`
**Issue:** No explicit `onOpenChange` handling to restore focus to the trigger element after drawer closes. Relies on base-ui defaults.

#### F-28: Card Title Typography Inconsistent
**Issue:** Card titles alternate between `text-lg font-medium text-foreground tracking-tight` (dashboard, cash) and `text-sm font-semibold` (profitability). Standardize to one pattern.

#### F-29: `bg-success` and `bg-destructive` Used as Solid Fills Without Dark Override
**Locations:** `margin-treemap.tsx:193,205`, `scorecards-page-content.tsx:31`, `cash-forecast-chart.tsx:36,47`
**Issue:** These rely on CSS variable adaptation which works, but should be verified visually since the dark mode values have different chroma/hue than light mode.

#### F-30: Scorecards Hero Card Uses Responsive Padding md:p-8
**Location:** `src/components/scorecards-page-content.tsx:28`
**Issue:** `p-6 md:p-8` diverges from the standard `p-6` pattern used elsewhere. Minor inconsistency.

#### F-31: "Connected" Status Text in Calibration Very Faint
**Location:** `src/components/calibration/data-sync-tab.tsx`
**Issue:** Status text uses `text-muted-foreground` at a small size, appearing very faint in dark mode screenshots.

---

## Remediation Roadmap

### PR 1: Token Foundation (Critical — 2-3 hours)
- [ ] Remove `dark:bg-zinc-950` from `ui/card.tsx` (let `--card` apply)
- [ ] Add dark-specific chart color tokens to globals.css
- [ ] Add dark-specific brand color overrides (invert scale)
- [ ] Brighten `--ring` in dark mode for focus visibility
- [ ] Lighten `--sidebar-primary` for 3:1 minimum
- [ ] Standardize border tokens — remove `dark:border-white/10` overrides

### PR 2: Surface Hierarchy (Critical — 1-2 hours)
- [ ] Remove `dark:bg-zinc-950` from sidebar, header (use `--sidebar`, `--background`)
- [ ] Introduce `--surface-inset` token for nested/detail rows (replacing `dark:bg-zinc-900/*`)
- [ ] Verify 3-tier surface stack: page bg → card → popover
- [ ] Address shadow invisibility (border brightening or light shadow values)

### PR 3: Accessibility (Critical — 2-3 hours)
- [ ] Add `@media (prefers-reduced-motion: reduce)` to globals.css
- [ ] Increase focus ring opacity to `ring-ring/75`
- [ ] Add skip-to-content link in layout.tsx
- [ ] Add `aria-label` to all icon-only buttons (6+ locations)
- [ ] Add `role="img"` + `aria-label` to all chart containers
- [ ] Increase sidebar nav touch targets to 44px minimum

### PR 4: Hardcoded Color Cleanup (Major — 3-4 hours)
- [ ] Replace 16 `dark:bg-zinc-*` overrides with token references
- [ ] Replace `dark:border-white/10` with `border-border`
- [ ] Replace `text-white` in buttons/widgets with `text-primary-foreground`
- [ ] Standardize hover states to 2-3 patterns
- [ ] Audit inline styles for dark mode compatibility

### PR 5: Typography & Spacing (Minor — 1-2 hours)
- [ ] Fix trends page title (text-2xl → text-3xl)
- [ ] Add tracking-tight to dashboard section titles
- [ ] Fix profitability section title size
- [ ] Wrap settings pages in standard gap-8 container
- [ ] Standardize card title typography
- [ ] Fix growth page gap-8 → gap-6

### PR 6: Text Size & Contrast (Major — 1-2 hours)
- [ ] Audit 26 instances of text-[10px] — upgrade to text-xs where possible
- [ ] Ensure remaining 10px text uses foreground color, not muted
- [ ] Verify MetricAnchor target label readability

### PR 7: Polish (Minor — 1-2 hours)
- [ ] Reduce drawer overlay opacity (80% → 65-70%)
- [ ] Address KPI card title truncation
- [ ] Standardize card padding patterns
- [ ] Verify focus restoration on drawer close

---

## Scoring Summary

| Category | Score (1-5) | Notes |
|----------|-------------|-------|
| **Text Contrast** | 4.5 | Primary text excellent. Muted-fg on muted is borderline. 10px text risky. |
| **Color Token Consistency** | 2.0 | 157 dark: overrides, 16 hardcoded backgrounds, inline styles |
| **Semantic Color Accuracy** | 4.0 | Success/destructive/warning all well-differentiated and passing |
| **Brand Color Rendering** | 3.5 | Brand-500 is strong. Brand-600/700 too dark. No dark scale inversion. |
| **Chart Legibility** | 1.5 | Chart colors 3-5 invisible. Charts lack accessibility. |
| **Vertical Rhythm** | 4.0 | Most pages follow gap-8 pattern. Trends, settings deviate. |
| **Card Padding** | 3.5 | Mostly p-6. Profitability uses split padding. |
| **Typography Hierarchy** | 3.5 | Title scale consistent except trends. Section titles vary. |
| **Surface Elevation** | 1.5 | Cards indistinguishable from background. Shadows invisible. |
| **Hover Affordance** | 2.5 | Inconsistent opacity. Many too subtle (white/[0.02]). |
| **Focus Indicators** | 2.0 | Ring at 50% opacity fails 3:1. Sidebar-primary fails. |
| **Active/Pressed** | 4.0 | scale-[0.98] and translate-y-px work well. |
| **Disabled States** | 3.5 | opacity-50 on light text is adequate in dark mode. |
| **Color-Blind Safety** | 3.5 | Most status indicators use icons + color. Charts rely on color alone. |
| **Motion Sensitivity** | 1.0 | Zero prefers-reduced-motion handling. |
| **Screen Reader** | 2.0 | Charts inaccessible. Missing aria-labels. No skip-to-content. |
| **Overall Dark Mode** | **2.8/5** | Functional but needs systematic remediation |

---

## Screenshots Reference

Baseline screenshots captured at 1440x900 in dark mode are stored in `audit/screenshots/baseline/`:

| File | Route |
|------|-------|
| 01-dashboard.png | /dashboard |
| 02-scorecards.png | /scorecards |
| 03-clients.png | /clients |
| 04-profitability.png | /profitability |
| 05-cash.png | /cash |
| 06-growth.png | /growth |
| 07-trends.png | /trends |
| 08-scenarios.png | /scenarios |
| 09-calibration.png | /calibration |
| 10-settings-profile.png | /settings/profile |
| 11-settings-team.png | /settings/team |
| 12-settings-billing.png | /settings/billing |
| 13-drawer-copilot-feed.png | Copilot Insights drawer |
| 14-drawer-metric-m1.png | Cash Runway Trend deep-dive |
| 15-drawer-ar-intelligence.png | AR Intelligence (loading state) |
