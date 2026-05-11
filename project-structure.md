# Dashboard Project Structure

```
Dashboard/
├── .claude/
│   └── settings.local.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── cash/
│   │   │   └── page.tsx
│   │   ├── clients/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── growth/
│   │   │   └── page.tsx
│   │   ├── profitability/
│   │   │   └── page.tsx
│   │   ├── scenarios/
│   │   │   └── page.tsx
│   │   ├── scorecards/
│   │   │   ├── april-2026/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── drawers/
│   │   │   ├── action-center-drawer.tsx
│   │   │   ├── ar-intelligence-drawer.tsx
│   │   │   ├── client-ledger-drawer.tsx
│   │   │   └── global-drawers.tsx
│   │   ├── scenarios/
│   │   │   └── sandbox-takeover.tsx
│   │   ├── ui/
│   │   │   ├── custom/
│   │   │   │   └── financial-chart.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── table.tsx
│   │   │   └── tabs.tsx
│   │   ├── cash-forecast-chart.tsx
│   │   ├── cash-page-content.tsx
│   │   ├── co-pilot-alert.tsx
│   │   ├── global-drawer.tsx
│   │   ├── global-sidebar.tsx
│   │   ├── metric-anchor.tsx
│   │   ├── metrics-grid.tsx
│   │   ├── month-selector.tsx
│   │   ├── profitability-page-content.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── lib/
│       ├── db/
│       │   ├── index.ts
│       │   ├── mock-db.ts
│       │   ├── services.ts
│       │   └── types.ts
│       ├── mock-data.ts
│       └── utils.ts
├── .gitignore
├── AGENTS.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── FIZZY_PACKER_AUDIT_REPORT.md
├── README.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── project-structure.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```
