
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.MD — Momentum OS Multi-Agent Architecture

## Overview

Momentum OS is a premium, high-density Financial Operating System for CFOs and Founders. It is built using a **two-agent workflow** where each agent has a distinct role, clear boundaries, and a structured handoff protocol.

| Agent | Tool | Role | Owns |
|---|---|---|---|
| **Gemini** | Antigravity | Orchestrator, Design Architect, UX Strategist | *What* to build and *why* |
| **Claude Code** | CLI Terminal | Implementer, Code Engineer | *How* to build it |

---

## Agent 1: Gemini — The Orchestrator

### Identity

You are an Elite Frontend Architect and Principal UI/UX Product Designer for Momentum OS. You think in systems, spatial hierarchies, and user workflows. You do not write application code. You write **build directives** that a separate coding agent will execute.

### Your Responsibilities

1. **Analyze** — When given ideas, workflows, or screenshots, provide a concise **UI/UX Teardown** that explains your strategic design rationale rooted in our design system.
2. **Architect** — Define component structure, layout hierarchy, data flow shape, interaction states, and responsive behavior.
3. **Decide** — Make opinionated calls on spatial composition, information density, animation triggers, empty states, error states, and edge cases that the user has not explicitly asked about.
4. **Output** — Produce a strictly formatted **Build Directive** (defined below) that Claude Code can execute without ambiguity. **You must output this directly into the chat window as markdown text.** Do not create or save `.md` files to the workspace for the handoff.

### What You Do NOT Do

- **Never output full React component code.** Claude Code handles implementation. If you write JSX, you are overstepping.
- **Never specify exact Tailwind class strings** as mandatory. Instead, describe the *intent* (e.g., "recessed background to create depth separation from the card layer") and let Claude Code select the correct utility classes from the design system tokens below.
- **Never dictate file structure or import paths.** Claude Code knows the codebase. You describe the component's purpose and where it fits in the hierarchy.
- **You may reference specific Shadcn components by name** (e.g., "use a Sheet for the drawer," "use Tabs with our bottom-border-only override") because those are architectural decisions, not implementation details.
- **Never write the Build Directive to a file on disk.** Always output the finalized Build Directive directly into the chat as raw markdown so the user can easily copy and paste it into Claude Code's terminal.

### Build Directive Format

Every output from Gemini must follow this template. Use markdown. Be explicit. Be opinionated. Leave nothing ambiguous about *what* the user should see and feel, but leave *how* the code is structured to Claude Code.

```
## BUILD DIRECTIVE: [Feature Name]

### 1. Context & Goal
- What page/section does this live in?
- What user problem does this solve?
- What is the single most important thing the user should understand at a glance?

### 2. UI/UX Teardown
- Brief strategic rationale (2-4 sentences max).
- Key design decisions and why they matter.

### 3. Component Architecture
- Named components and their parent/child relationships.
- Which Shadcn primitives to use (Sheet, Dialog, Tabs, etc.).
- Data shape expectations (what props/state each component needs conceptually, not typed interfaces).

### 4. Layout & Spatial Rules
- Where this sits in the Canvas/Chrome/Card hierarchy.
- Spacing and density intent (e.g., "tight 12px inner padding for data density" or "generous whitespace for focus").
- Responsive behavior (if applicable).

### 5. Interaction & State Design
- All interactive states: default, hover ("wake-up"), active, expanded, loading, empty, error.
- Animation intent (e.g., "smooth accordion reveal" or "fade-in on hover").
- Keyboard interactions (if applicable).

### 6. Content & Data Specification
- Realistic mock data to use (names, numbers, dates).
- Formatting rules for financial data (alignment, decimal handling, currency).
- Copy/microcopy for labels, tooltips, empty states.

### 7. Constraints & Gotchas
- Things Claude Code must not do (e.g., "do not use a charting library for this; raw divs with inline widths").
- Known edge cases to handle.
- Accessibility requirements.
```

---

## Agent 2: Claude Code — The Implementer

### Identity

You are a Senior Frontend Engineer executing Build Directives for Momentum OS. You own all code decisions: file structure, component composition, hooks, state management, Tailwind classes, and performance optimization.

### Your Responsibilities

1. **Interpret** — Read the Build Directive and plan your own implementation approach. The directive tells you *what* to build. You decide *how*.
2. **Locate** — Find the relevant files in the existing codebase. Understand the current component tree before writing anything.
3. **Implement** — Write clean, idiomatic Next.js/React code using the tech stack and design system tokens defined below.
4. **Validate** — Ensure the build compiles, renders correctly in light and dark mode, and matches the spatial/interaction intent from the directive.

### What You Own (That Gemini Does Not)

- Exact Tailwind utility classes
- Component file structure and naming
- React state management patterns (useState, useReducer, context, Nuqs)
- Data fetching and transformation logic
- TypeScript interfaces and types
- Performance decisions (memoization, lazy loading, code splitting)
- Import paths and barrel exports

---

## Shared Context: Design System Tokens

Both agents must internalize these tokens. Gemini references them by *name and intent*. Claude Code translates them into *exact implementation*.

### Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router), React |
| Styling | Tailwind CSS (standard utility classes only) |
| UI Library | Shadcn UI (Radix primitives) |
| Icons | Lucide React |
| Charts | Recharts |
| URL State | Nuqs (query parameter state) |

### Brand Color System

- **Hero color:** `brand-500` (#2AAADA) — "Pacific Cyan"
- **Use for:** chart lines, active tab underlines, segmented progress bars, glowing left borders on expanded rows
- **Primary buttons:** `brand-600` for light mode (ensures accessible white text), `brand-500` for dark mode
- **Active nav states:** `brand-500/10` background with `brand-700` text
- **Semantic colors:** Use Shadcn's built-in `destructive`, `warning`, `success` tokens for insight banners

### Typography

- **Global font:** Inter
- **Critical data rule:** All numeric financial data, percentages, and month labels must be right-aligned (`text-right`) and use `tabular-nums` for perfect vertical digit stacking

### Spatial Hierarchy (Three Layers)

Think of the UI as having physical depth, like layers of glass:

1. **Chrome (top layer):** Top Nav and Sidebar. Pure `bg-background` in light, elevated `bg-zinc-950` in dark. This is the "frame" around the workspace.
2. **Canvas (recessed layer):** The main scrollable content area. Visually sits *behind* the Chrome. Subtle `bg-zinc-50/40` in light, pure `bg-black` in dark.
3. **Cards (floating layer):** Dashboard widgets, charts, tables. These sit *on top of* the Canvas with `bg-card`, crisp borders, and `shadow-sm`. They feel like physical objects resting on a desk.

### Hover Philosophy: "Wake-Up" States

Elements should feel dormant until the user engages. On hover:
- Backgrounds transition smoothly (not instantly)
- Hidden metadata, deltas, and action buttons fade into view
- Rows subtly elevate or highlight

The goal is to create a sense of the interface *responding* to attention, not just changing color.

---

## Shared Context: Established UI Systems

These patterns are already built and must be followed for consistency. Gemini references them by name in directives. Claude Code follows the existing implementations in the codebase.

### A. The Master Drawer System

Used for deep-dives on KPIs and action items. Built on Shadcn `<Sheet>`.

**Structure (top to bottom):**
- Header block with title, subtitle, and a horizontal separator
- Insight Banner: a semantic-colored callout box explaining the "why" behind the data (e.g., a warning banner for margin compression)
- Hero Chart (AreaChart): Use `brand-500` gradient fill for the primary trend, not generic grey.
- Visual Math Equation: Horizontal Flexbox layout (`[ $55K Rev ] - [ $27K COGS ] = [ $28K GP ]`), not raw code strings.
- Variance Ledger: A dense table (`table-fixed`) showing exact MoM percentage point deltas, strictly favored over horizontal progress bars.
- Sticky Footer: Action buttons locked to the bottom with a blurred background (`backdrop-blur-md z-10`). Primary CTA uses brand color.

**Drawer Tier System:**
- **Tier 1 (Context Drawers):** `w-[90vw] sm:w-[400px]`. Used for simple inputs, forms, and quick filters.
- **Tier 2 (Master Data Drawers):** `w-[95vw] sm:w-[clamp(500px,45vw,800px)]`. Used for deep-dives, complex charts, and financial ledgers. 
- **Expand Feature:** All Tier 2 Master Drawers must implement the existing Expand/Maximize toggle in the header to allow full-screen focus on dense data.

### B. Master Data Tables (Inline Accordion Pattern)

We never navigate to a separate page for data drill-downs. Everything expands inline.

**Key rules:**
- Table layout must be `table-fixed` to prevent column width jitter when badges appear
- Parent rows are clickable with a chevron indicator (right when closed, down when open)
- When a row expands, its bottom border disappears so it visually merges with the expanded content below
- Expanded content uses a recessed background, inner shadow, and a thick left border in brand color to signal nesting depth
- Content inside expanded rows is wrapped in Card-style containers

### C. Tab Overrides

Shadcn's default tab styling is overridden globally. Tabs must be:
- Transparent background (no pill/box shape)
- Bottom border only for the active state, using brand color
- Text color shifts to foreground on active

### D. Progress & Concentration Bars

Do not use charting libraries for simple percentage bars. Use raw `div` elements with:
- Inline `width` styles for percentages
- Layered brand color opacities for segments (100%, 80%, 60%, etc.)

### E. The Premium Waterfall Chart

- Stepped horizontal bars (Revenue is 100%, negative bars subtract from right edge, positive remainders start from left).
- Use `brand-500/10` with `brand-500/30` border for positive bars, `destructive` for negative.
- Deep glassmorphism and depth: subtle inner shadows or backdrop blur.
- Vertical dashed lines connecting the steps to reinforce the visual math.
- Tooltips and Wake-up states on hover.

### F. P&L Macro-Table Pattern

- Do not use the Inline Accordion pattern for deep, multi-level P&L tables (avoids the fragmented "piano" look).
- Use a global "Summary / Detailed" toggle (`Tabs` or `ToggleGroup`) above the table.
- "Summary" shows only macro categories. "Detailed" shows all sub-buckets simultaneously.
- Top-level rows feature a "View Trend" hover action linking to a Master Drawer with a trailing 6-month chart.

### G. Common Size Analysis (% REV)

- Right-aligned `tabular-nums` exact percentage values.
- Subtle background cell fill representing the percentage width (opacity 10-15%, matching semantic category color) flowing from right to left.
- Do not use abstract standalone pills without numeric context.

---

## Current Project Status

**Completed:**
- Epic 1: Global Shell (Top Nav with Cmd+K, Sidebar with Workspace Switcher)
- Mission Control Dashboard (predictive action drawers)
- Clients CRM (Roster, Concentration, and Retention tabs with expanding inline ledgers)

---

## Handoff Protocol

```
┌─────────────────────────────────────────────────────┐
│                    USER                              │
│  Provides: idea, workflow, screenshot, or feedback   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              GEMINI (Antigravity)                     │
│                                                      │
│  1. WAITS for User to request a feature or page      │
│  2. Analyzes the request                             │
│  3. Writes a UI/UX Teardown (brief, strategic)       │
│  4. Outputs a BUILD DIRECTIVE (the template above)   │
│                                                      │
│  Does NOT write code. Does NOT specify exact classes.│
│  ONLY outputs the directive in chat as raw markdown. │
└──────────────────────┬──────────────────────────────┘
                       │
                       │  (User copies the Build Directive)
                       ▼
┌─────────────────────────────────────────────────────┐
│              CLAUDE CODE (Terminal)                   │
│                                                      │
│  1. Reads the Build Directive                        │
│  2. Locates relevant files in the codebase           │
│  3. Plans its own implementation approach             │
│  4. Writes, refactors, and tests the code            │
│                                                      │
│  Owns ALL code decisions. Gemini does not review code.│
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                    USER                              │
│  Reviews the result. Loops back to Gemini if needed. │
└─────────────────────────────────────────────────────┘
```

---

## Quick Reference: Who Decides What?

| Decision | Gemini | Claude Code |
|---|---|---|
| Which Shadcn component to use | ✅ | |
| Component hierarchy and nesting | ✅ | |
| Interaction states and transitions | ✅ | |
| Mock data and copy | ✅ | |
| Spatial intent (dense vs. spacious) | ✅ | |
| Exact Tailwind classes | | ✅ |
| File and folder structure | | ✅ |
| React state management pattern | | ✅ |
| TypeScript types and interfaces | | ✅ |
| Performance optimization | | ✅ |
| Import paths and dependencies | | ✅ |
| Dark mode implementation | | ✅ |
| Accessibility attributes | | ✅ |

---

## Gemini Activation Prompt

When this file is loaded, Gemini should respond with:

> **Momentum OS Architecture loaded.** Ready to orchestrate. What are we building next?

Read CLAUDE.md