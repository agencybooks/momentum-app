# Dark Mode Remediation — Phased Handoff for Gemini

One phase per session, in order. Commit after each. Verify visually before moving to the next. Each phase builds on the previous.

Before each session, tell Gemini to read `CLAUDE.md` and `audit/DARK-MODE-AUDIT-FINDINGS.md` for full context.

---

## Phase 1: Token Foundation

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

The dark mode CSS token system in src/app/globals.css has several critical problems that need to be fixed before anything else. This phase is globals.css ONLY — do not touch component files.

Problems to solve:

1. Chart color tokens (--chart-1 through --chart-5) are identical in light and dark mode. Chart-3 through chart-5 are invisible on dark backgrounds (measured contrast ratios: 2.55:1, 1.92:1, 1.31:1). The dark mode values need to be inverted so the lightest chart color becomes the darkest and vice versa.

2. The --ring token is too dim in dark mode. Focus rings use ring-ring/50 (50% opacity), and at the current value the effective contrast drops below the WCAG 3:1 minimum for UI components. The dark mode ring token needs to be brighter.

3. The --sidebar-primary token (the only chromatic/hued color in the dark palette) achieves only 2.91:1 contrast against the sidebar background, failing the 3:1 minimum. It needs to be lightened while keeping its hue.

4. There is no prefers-reduced-motion media query anywhere in the codebase. 40+ components use transitions and animations, including an infinite pulse animation. Add a global reduced-motion guard.

5. There is no CSS variable for nested/inset surfaces (detail rows, expanded sections). Components currently hardcode dark:bg-zinc-900/* for this. Add a --surface-inset token to both :root and .dark, and register it in the @theme inline block.

Run npm run build when done to verify.
```

---

## Phase 2: Surface Hierarchy

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

The biggest visual problem in dark mode: cards, sidebar, and header are all indistinguishable from the page background. Measured contrast between card background and page background is 1.00:1 — literally identical.

The root cause is that multiple components hardcode dark:bg-zinc-950 (rgb 9,9,11) instead of using the CSS variable system. The --card variable is defined correctly at oklch(0.205 0 0) (rgb 23,23,23) but gets overridden.

Problems to solve:

1. The Card component in src/components/ui/card.tsx hardcodes dark:bg-zinc-950, ignoring the --card CSS variable. Fix it so the card uses the token system.

2. The GlobalSidebar in src/components/global-sidebar.tsx hardcodes dark:bg-zinc-950 and dark:border-white/10 instead of using the sidebar tokens defined in globals.css. It also hardcodes dark:bg-zinc-800 on the logo icon. Fix these to use the token system.

3. The TopHeader in src/components/top-header.tsx hardcodes dark:bg-zinc-950 and dark:border-white/10. Fix to use tokens.

4. Multiple components use dark:bg-zinc-900/* at various opacities for nested/inset surfaces (expanded table rows, detail sections). In Phase 1 we added a --surface-inset token. Replace these hardcoded values with that token. The affected files are listed in findings F-05 in the audit document.

5. The math-equation and anti-pnl-snapshot drawer components hardcode dark:bg-black/* and dark:bg-zinc-800/*. Replace with appropriate token references.

After fixing, the visual hierarchy should be: page background (darkest) → cards/sidebar (slightly lighter) → popovers/drawers (same as cards or slightly lighter). Run npm run build and verify visually.
```

---

## Phase 3: Accessibility

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

There are several accessibility failures that need fixing. Focus on these problems:

1. Focus rings across all UI components use ring-ring/50 (50% opacity). At the measured dark mode ring value, this fails the WCAG 3:1 minimum for UI component boundaries. Increase the opacity so focus indicators are clearly visible on dark backgrounds. Check all shadcn UI components in src/components/ui/.

2. There is no skip-to-content link in the layout. Keyboard users must tab through the entire sidebar (10+ items) before reaching page content. Add one to src/app/layout.tsx.

3. Sidebar nav items have touch targets of approximately 30-32px height, below the 44px WCAG 2.5.5 recommendation. Increase the vertical padding to achieve adequate touch targets.

4. Multiple icon-only buttons across the app have no aria-label — the fullscreen toggle in drawers, download buttons in settings/billing, and more-menu buttons in settings/team. Find and fix all icon-only buttons that lack accessible labels.

5. Every chart component in the app (ChartContainer, cash-forecast-chart, unit-economics-chart, oracle-chart, waterfall charts, treemaps) lacks role="img", aria-label, or any screen reader description. Add appropriate accessibility markup to the chart system.

Run npm run build when done.
```

---

## Phase 4: Border & Hover Standardization

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

Two categories of inconsistency need standardizing:

BORDERS: The codebase uses border-border/40, /50, and /60 seemingly at random with no semantic hierarchy. Some components also use dark:border-white/10 which bypasses the token system (the --border token already resolves to white at 10% opacity in dark mode). Audit all border usage and standardize to a consistent two-tier system — one opacity for primary structural dividers, one for subtle secondary dividers. Remove all dark:border-white/* overrides since the token handles this.

HOVER STATES: Dark hover backgrounds use at least 7 different patterns ranging from dark:hover:bg-white/[0.02] to dark:hover:bg-brand-400. There's no consistency. Standardize to 2-3 hover patterns: a subtle one for nav/list items, a standard one for buttons/cards, and an accent one for brand-colored interactions. The hover should be visible but not overwhelming on dark backgrounds.

The files affected are spread across the entire src/components/ directory. Search broadly.

Run npm run build when done.
```

---

## Phase 5: Typography & Spacing

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

The dashboard has a consistent spacing and typography system on most pages, but several pages deviate:

1. The Trends page uses a smaller page title size than every other page and doesn't use the standard flex flex-col gap-8 outer container pattern.

2. The Dashboard page section titles are missing tracking-tight that all other pages use.

3. The Profitability page has a section title using a much smaller text size than other pages, and uses split/asymmetric card padding instead of the uniform pattern used elsewhere.

4. The Settings sub-pages (profile, team, billing, notifications, security) don't wrap their content in the standard gap container, so card spacing is inconsistent.

5. The Growth page uses gap-8 for its card grid while all other pages use gap-6 for 2-3 column grids.

6. Card titles alternate between two different typography patterns across pages. Pick one and standardize.

Audit all page content files and the page-header component. Make everything consistent with the dominant pattern.

Run npm run build when done.
```

---

## Phase 6: Text Size & Color Cleanup

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

Two problems to address:

SMALL TEXT: There are 26 instances of text-[10px] across the codebase, mostly paired with text-muted-foreground. At 10px, readability on dark backgrounds is marginal even when contrast ratios technically pass. Audit each instance — upgrade to text-xs (12px) wherever the layout allows it. For any that truly must stay at 10px, ensure they use a higher-contrast color than muted-foreground.

HARDCODED TEXT COLORS: Several components use text-white directly instead of semantic tokens like text-primary-foreground or text-foreground. While text-white works in both modes, it bypasses the token system. Find and replace these with appropriate semantic tokens. The audit document lists the specific files in finding F-26.

Also: several components use inline style={{ backgroundColor: ... }} with hardcoded color values that don't respond to dark mode. Flag these with TODO comments for the future component consolidation pass — don't try to fix them now as they may break chart rendering.

Run npm run build when done.
```

---

## Phase 7: Polish

```
Read CLAUDE.md and audit/DARK-MODE-AUDIT-FINDINGS.md.

Final polish:

1. The drawer overlay in dark mode is 80% opacity, making the background content nearly invisible. Reduce it so users retain some context of what's behind the drawer.

2. Shadows (shadow-sm through shadow-2xl) are invisible on dark backgrounds. For interactive cards that rely on shadow changes for hover feedback, add a complementary dark mode hover treatment (like subtle border brightening) so the hover state is visible.

3. KPI card titles are truncating on multiple pages ("TOTA...", "NET R...", "OPERATING M..."). Evaluate whether the MetricAnchor component's fixed height and layout can accommodate the title lengths better — either through allowing two-line titles, reducing the competing elements, or abbreviating intelligently.

4. Do a final visual walkthrough of every route in dark mode:
   /dashboard, /scorecards, /clients, /profitability, /cash, /growth, /trends, /scenarios, /calibration, /settings/profile, /settings/team, /settings/billing
   
   Open a drawer. Tab through the sidebar. Check that charts are readable. Fix anything that looks off.

Run npm run build when done.
```

---

## After All Phases

Once all 7 phases are complete and committed, the next pass would be a **component consolidation audit** — checking whether custom-built components should be replaced with shadcn primitives for better dark mode theming consistency. That's a separate effort.
