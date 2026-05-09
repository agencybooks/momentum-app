# 📖 THE MOMENTUM ARCHITECTURE MANIFESTO (V2.0)

**Product Identity:** Momentum is not a passive reporting dashboard; it is a financial weapon. It does not just show founders the score; it calls the plays, proves the math, and executes the workflows required to keep the business alive and growing. 
**Status:** SEALED & APPROVED
**Version:** 2.0 (The Architect's Master Blueprint)

---

## PART I: THE 6 PILLARS OF DESIGN
*Any feature, screen, or component proposed by engineering or design must pass these six strict laws:*

1. **The Insights Command:** We do not bury the lede. The most critical alerts (Runway breaches, Cash crunches, Margin compression) must sit at the absolute top of their relevant page (Zone 1). If a founder does not scroll, they must still know exactly what is bleeding.
2. **Seamless Fluidity (No App-in-an-App):** We do not trap users in endless nested sidebars or tab sprawl. The hierarchy is flat. If they need to dig deeper, we bring the data to them via slide-out Drawers. 
3. **Actionable Progressive Disclosure:** We do not show passive ledgers. If an invoice is 75 days overdue, we do not just list it; we provide an `[ Analyze ↗ ]` button to trigger the collections workflow. Data without a corresponding action is just noise.
4. **Breathable Elegance:** We kill heavy gray boxes and UI clutter. Data tables should be clean, spacious, and prioritize *Exception Reporting* (showing the failures at the top, rather than forcing the user to hunt for red dots).
5. **Micro vs. Macro Drawers:** Context is king. We never do full-page redirects for deep dives. We use a strict sizing system for slide-outs: **Micro (30%)** for entity-level details, and **Macro (50-60%)** for system-level proofs and waterfalls.
6. **Zero Empty States:** If a user visits the Scenarios page without having built a scenario, we do not show them a blank screen. We calculate their "Default Future Trajectory" and load it immediately. Every page load must deliver immediate value.

---

## PART II: UNIVERSAL ROUTING & NAVIGATION

The navigation hierarchy is strictly limited to 8 core tabs. The V1 "Insights" page was killed. The secondary settings sidebar was killed.

**The 8 Core Tabs:**
1. Dashboard
2. Scorecards
3. Clients
4. Profitability
5. Cash
6. Growth
7. Scenarios
8. Settings

### 🗄️ THE GLOBAL ACTION CENTER (The Dispatcher)
Alerts do not have a dedicated page. They live in a transient **30% right-hand Drawer** triggered by a `[ 🔔 ]` icon in the top global nav. An alert is a dispatch link; clicking it routes the user to the specific page and drawer to solve the issue.

```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ ANY PAGE IN THE APP ]                [ 🔔 Action Center ]
                               
[Menu]                         =========================================================
• Dashboard                    ||  [ GLOBAL OVERLAY: ACTION CENTER (30% Drawer) ]
• Scorecards                   ||  [ ← Close ]                       [ Mark all read ✓ ]
• Clients                      ||
• Profitability                ||  [ ZONE 1: ACTIVE ALERTS (The Dispatcher) ]
• Cash                         ||  (Clicking an alert routes them to the correct page)
• Growth                       ||
• Scenarios                    ||  🚨 CRITICAL (1)
• Settings                     ||  [ Cash ] A/R aging shifting toward 60+ days
                               ||  ↳ $42K crossed 60-day mark. 
                               ||  [ Go to Cash & Treasury ↗ ]       [ Snooze ⏰ ]
                               ||
                               ||  🟠 WARNINGS (2)
                               ||  [ Profit ] Operating margin compressing to floor.
                               ||  [ Go to Profitability ↗ ]         [ Snooze ⏰ ]
                               ||
                               ||  [ Clients ] Cobalt Outdoor paying slower.
                               ||  [ Go to Client Roster ↗ ]         [ Snooze ⏰ ]
                               ||
                               ||  -----------------------------------------------------
                               ||  [ ZONE 2: SET ASIDE / SNOOZED ]
                               ||  (Founders can hide alerts here to keep their UI clean)
                               ||  • Address concentration at Acme renewal (Due: Mar 25)
                               ||    [ Restore ↺ ]
                               ||  • Software subscription audit (Due: Apr 1)
                               ||    [ Restore ↺ ]
                               ||
                               ||  -----------------------------------------------------
                               ||  [ ZONE 3: WINS & RESOLVED LOG ]
                               ||  (The dopamine hits. A log of cleared issues.)
                               ||  ✅ AR Overdue share fell below 10% (Resolved 2d ago)
                               ||  ✅ Operating margin recovered to 21% (Resolved 3w ago)
                               =========================================================
=======================================================================================
```

### 🗄️ THE UNIVERSAL LEDGER (Macro-Drawer 50%)
Triggered from any page via Cmd+K or generic "View Transactions" links. Eliminates the need for a dedicated generic ledger page.

```text
=========================================================
[ ANY MAIN PAGE (Dimmed) ]  ||  [ MACRO-DRAWER: UNIVERSAL LEDGER (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||  
                            ||  TRANSACTIONS & LEDGER
                            ||  
                            ||  [ Search vendor, amount, category... 🔍 ]
                            ||
                            ||  [ Filters ]
                            ||  [ Month: May 2026 ▾ ] [ Type: All Outflows ▾ ] [ Cat: All ▾ ]
                            ||
                            ||  [ Zone A: The Exception Feed (The Co-Pilot) ]
                            ||  (We don't just show a dumb list; we surface anomalies first)
                            ||  🚨 ANOMALIES DETECTED THIS PERIOD
                            ||  May 04  AWS (Amazon Web Services)    $4,200  [+40% vs Avg]
                            ||  -------------------------------------------------------------
                            ||
                            ||  [ Zone B: The Humanized Ledger Feed ]
                            ||  (Sorted chronologically by default. Clean, spacious rows.
                            ||   Red for outflows, Green for inflows.)
                            ||
                            ||  MAY 2026
                            ||  May 15  Gusto Payroll                -$18,500   [ R&D Labor ]
                            ||          ↳ Includes $2K Q2 bonuses
                            ||
                            ||  May 12  Google Ads                   -$3,100    [ S&M Media ]
                            ||  May 10  Acme Co. (Invoice #1042)     +$12,400   [ Revenue ]
                            ||  May 08  Datadog Inc                  -$1,200    [ COGS Tech ]
=========================================================
```

---

## PART III: THE CORE PAGE BLUEPRINTS (FULL CANVAS LAYOUTS)

### 1. THE MAIN DASHBOARD
*The 10-second pulse check.*

```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ THE CO-PILOT ]                              [ May 2026 ▾ ]
                               
[Menu]                         🚨 Your cash runway dropped below the 6-month target due to  
• Dashboard (Active)              $42K in aging receivables. Operating margin compressed 
• Scorecards                      to 20.4%, hitting your configured floor.
• Clients                      ========================================================
                               
                               [ THE ANCHORS ] (Clickable -> Opens Macro Drawers)
                               [ RUNWAY        ] [ NET BURN      ] [ REVENUE       ] [ GROSS MARGIN  ]
                               [ 5.4 mo 🔴     ] [ -$15.2K/mo 🔴 ] [ $41.5K 🟢     ] [ 50.1% 🟢      ]
                               [ Target: 6.0   ] [ Avg: -$8K     ] [ +$3.5K v Mar  ] [ +2.0% v Mar   ]
                               
                               --------------------------------------------------------
                               [ THE VISUAL NARRATIVE ] 
                               [ 🔵 Revenue ]   [ 🔴 Expenses ]
                               (A clean, multi-line chart or dual-axis showing Cash vs Burn 
                                over the last 90 days. NO scrolling required to see this.)
                               
                               --------------------------------------------------------
                               [ THE ACTIONABLE SIGNALS ] (Micro-Interventions)
                               (We don't just show problems; we link to the workflows to fix them)
                               
                               ↳ 🔴 $42K in AR is crossing 60-days late.   [ Open AR Drawer → ]
                               ↳ 🟠 Heavy bill week ahead ($38K outflow).  [ Open Cash Drawer → ]
                               ↳ 🟢 Acme Co hit 4-year anniversary.        [ Open Expansion Drawer → ]
=======================================================================================
```

### 2. THE SCORECARDS 

#### A. Scorecards List Page (The Archive)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SCORECARDS (The Archive) ]                  
                               
[Menu]                         ========================================================
• Scorecards (Active)          [ ZONE 1: CURRENT ACTIVE MONTH ]
                               ⏳ May 2026 (In Progress) 
                               Books remain open. 14 days remaining in period.
                               [ View Live Dashboard ↗ ]
                               ========================================================
                               
                               [ ZONE 2: THE ARCHIVE LEDGER ]
                               (The Year is no longer just a folder. It is a master report.)
                               
                               🗓️ 2026 (Year to Date)                        [ ⤓ Export YTD ]
                               Rev: $155.5K | Margin: 48.0% | Cash Added: +$14K
                               ↳ [ 📄 View 2026 YTD Annual Scorecard ↗ ]
                               --------------------------------------------------------
                               Period          Revenue    Gr. Margin   Op. Income  Goals Hit
                               April 2026      $41,500    50.1% 🟢     $7,900      8/13 🟢
                               March 2026      $38,000    48.2% 🟡     $5,400      6/13 🟡
                               February 2026   $39,500    47.1% 🔴     $5,700      4/13 🔴
                               January 2026    $36,500    45.5% 🔴     $3,900      5/13 🟡
                               
                               🗓️ 2025 (Closed Year)                         [ ⤓ Export PDF ]
                               Rev: $499.2K | Margin: 45.2% | Cash Added: +$42K
                               ↳ [ 📄 View 2025 Annual Scorecard (Year in Review) ↗ ]
                               --------------------------------------------------------
                               Period          Revenue    Gr. Margin   Op. Income  Goals Hit
                               December 2025   $49,500    46.1% 🟡     $12,400     9/13 🟢
                               November 2025   $48,100    45.8% 🟡     $11,200     7/13 🟡
                               [ View all 12 months ▾ ]
=======================================================================================
```

#### B. The Monthly Brief (Flat Page PDF)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SCORECARDS: APRIL 2026 ]             [ ⤓ Export PDF ]
                               
[Menu]                         [ ← Back to All Months ]
• Scorecards (Active)          ========================================================
                               [ ZONE 1: THE EXECUTIVE NARRATIVE (The Co-Pilot) ]
                               🟢 April was a highly efficient month. We hit 8 of 13 
                               targets. Revenue grew by $3.5K entirely through 
                               expansion, and cash position strengthened by $8K.
                               🔴 Warning: Net Margin (16.4%) missed our 20% target, 
                               and AR DSO stretched to 56 days.
                               ========================================================
                               
                               [ ZONE 2: THE FINAL SNAPSHOT (The 4 Closed Anchors) ]
                               [ REVENUE (Apr) ] [ GROSS MARGIN  ] [ NET PROFIT    ] [ ENDING CASH   ]
                               [ $41,500       ] [ 50.1%         ] [ $7,900        ] [ $222,800      ]
                               [ 🟢 +$3.5K     ] [ 🟢 +2.0 pts   ] [ 🟢 +$2.5K     ] [ 🟢 +$7.9K     ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: THE GOALS MATRIX (Exception Reporting) ]
                               (No tabs. This is the star of the Scorecard. Exception-based
                                reporting forces the bleeding metrics to the absolute top.)
                               
                               🚨 OFF TRACK (Action Required)
                               --------------------------------------------------------
                               Metric                  Actual       Target       Gap
                               Net Margin              16.4%        ≥ 20.0%      🔴 -3.6pp
                               Logo Churn (Ann)        14.3%        < 10.0%      🔴 +4.3pp
                               DSO (Days Sales Out)    56d          < 45d        🔴 +11d
                               
                               🟢 ON TRACK (Healthy)
                               --------------------------------------------------------
                               Gross Margin            50.1%        ≥ 50.0%      🟢 +0.1pp
                               Net Rev Retention       105.1%       > 100%       🟢 +5.1pp
                               ↳ [ View all 8 On-Track Goals ▾ ]

                               --------------------------------------------------------
                               [ ZONE 4: THE BRIDGES (Visual Narratives) ]
                               (We recycle your two best charts from the tabs here, 
                                flattened into the page. No clicking required.)
                               
                               [ REVENUE MOVEMENT ]          [ CASH MOVEMENT ]
                               Starting:     $38.0K          Starting:     $214.9K
                               + Expansion:  $12.0K          + Inflows:    $45.8K
                               - Contraction:$8.0K           - Outflows:   $37.9K
                               --------------------          --------------------
                               Ending:       $41.5K          Ending:       $222.8K

                               --------------------------------------------------------
                               [ ZONE 5: DEEP-DIVE LAUNCHPADS ]
                               (Instead of rebuilding granular charts here, we link to the 
                                main tools with the 'April' filter automatically applied!)
                               
                               Want to audit the raw ledgers for April?
                               [ ↗ View April Profitability Ledger ]  [ ↗ View April Client Roster ]
=======================================================================================
```

#### C. The Annual Scorecard (Year in Review)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SCORECARDS: 2025 YEAR IN REVIEW ]    [ ⤓ Export PDF ]
                               
[Menu]                         [ ← Back to Archive ]
• Scorecards (Active)          ========================================================
                               [ ZONE 1: THE ANNUAL NARRATIVE (The Co-Pilot) ]
                               🏆 2025 was a year of margin expansion. You grew 
                               revenue by 22% ($499.2K) while improving Gross Margin 
                               from 38% to 45%. You added $42K in liquid cash to the 
                               balance sheet, extending your runway by 2.1 months.
                               ========================================================
                               
                               [ ZONE 2: THE 12-MONTH ANCHORS ]
                               [ TOTAL REVENUE ] [ AVG GROSS MARGIN ] [ NET CASH FLOW ]
                               [ $499.2K       ] [ 45.2%            ] [ +$42,000      ]
                               [ 🟢 +22% YoY   ] [ 🟢 +7.0 pts YoY  ] [ 🟢 +1.1x YoY  ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: THE 12-MONTH WATERFALL (The Arc) ]
                               (A beautiful, wide chart showing the month-over-month growth)
                               
                               $50K |                              [ Dec ]
                                    |                        [ Nov ]
                                    |   [ Jan ]...[ Mar ]... 
                               $20K |______________________________________
                                         Q1        Q2        Q3        Q4
                               
                               --------------------------------------------------------
                               [ ZONE 4: ANNUAL SUPERLATIVES ]
                               (Founders love to see their peaks and valleys clearly defined)
                               
                               Best Revenue Month:     December 2025 ($49.5K)
                               Worst Margin Month:     February 2025 (38.1%)
                               Top Client of 2025:     Acme Co. ($144K Billed)
                               Highest Growth Lever:   Existing Client Expansion (+$55K)

                               --------------------------------------------------------
                               [ ZONE 5: END-OF-YEAR GOALS REVIEW ]
                               (How did they perform against the targets set for Dec 31?)
                               
                               🚨 OFF TRACK 
                               • Logo Churn: Ended at 14% (Target < 10%). We lost 3 logos.
                               • Net Margin: Ended at 16.4% (Target > 20%).
                               
                               🟢 ON TRACK
                               • Gross Margin: Ended at 46.1% (Target > 45%).
                               • Cash Runway: Ended at 6.1 mo (Target > 6.0 mo).
                               ↳ [ View all 13 Goals ▾ ]
=======================================================================================
```

### 3. CLIENTS (THE ROSTER)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ CLIENT ROSTER & RETENTION ]                 [ Live ]
                               
[Menu]                         ========================================================
• Clients (Active)             [ ZONE 1: THE PORTFOLIO CO-PILOT ]
                               🔴 Warning: Acme Co. represents 33% of revenue, breaching 
                                  your 25% concentration ceiling.
                                  ↳ [ View Breakdown ▾ ]
                               ========================================================
                               
                               [ ZONE 2: THE MOVEMENT ANCHORS (Last 30 Days) ]
                               [ ACTIVE CLIENTS ]  [ MRR GAINED    ]  [ MRR LOST      ]
                               [ 9               ] [ +$1,500 🟢    ]  [ $0 🟢         ]
                               [ Flat vs Mar     ] [ 2 Upgrades    ]  [ 0 Churned     ]
                               
                               [ Open Churn & Revenue Drawer → ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: THE ROSTER LEDGER (Actionable) ]
                               (Sorted by MRR highest to lowest by default)
                               
                               Client             MRR      Tenure    Margin    Status
                               -----------------------------------------------------------
                               1. Acme Co.        $36.0K   51 mo     42%       🟢 Healthy
                                  [ Analyze ↗ ]
                               
                               2. Cobalt Outdoor  $8.3K    14 mo     38%       🔴 At Risk (AR 75d)
                                  [ Analyze ↗ ]
                               
                               3. Brightline      $12.0K   35 mo     48%       🟢 Healthy
                                  [ Analyze ↗ ]
=======================================================================================
```

### 4. PROFITABILITY
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ PROFITABILITY & MARGINS ]                   [ Live ]
                               
[Menu]                         ========================================================
• Profitability (Active)       [ ZONE 1: THE MARGIN CO-PILOT (Exception Engine) ]
                               🔴 Gross margin slipped 1.2 pts this month due to a 15% 
                               spike in direct tech costs (AWS/Datadog).
                               ========================================================
                               
                               [ ZONE 2: THE MARGIN ANCHORS ]
                               [ GROSS MARGIN  ]  [ OPERATING MARGIN ]  [ NET PROFIT MARGIN ]
                               [ 50.1% 🟢      ]  [ 19.0% 🟠         ]  [ 16.4% 🔴          ]
                               [ Target: >50%  ]  [ Target: >20%     ]  [ Target: >20%      ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: THE SAAS P&L WATERFALL ]
                               (A horizontal visual bridge mapping where the money goes)
                               
                               [ REVENUE ]  
                               [ $41.5K  ]➔ [ COST OF DELIV ]
                                            [ -$20.7K       ]➔ [ GROSS PROFIT ] 
                                                               [ $20.8K (50%) ]➔ [ OVERHEAD  ]
                                                                                 [ -$12.9K   ]➔ [ NET PROFIT ]
                                                                                                [ $7.9K (19%)]
                               
                               --------------------------------------------------------
                               [ ZONE 4: THE UNIFIED VARIANCE LEDGER ]
                               (No separate tabs. Sorted by highest variance to prior month)
                               Category                  Spend (May)   vs April    Action
                               ------------------------------------------------------------------
                               DIRECT COSTS (COGS)
                               • Software Subscriptions  $12,500       🔴 +14.0%   [ Deep Dive ↗ ]
                               • Contractor Labor        $8,200        🟢 Flat     [ Deep Dive ↗ ]
                               
                               OPERATING EXPENSE (OPEX)
                               • S&M: Media Spend        $22,200       🔴 +24.0%   [ Deep Dive ↗ ]
=======================================================================================
```

### 5. CASH & TREASURY
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ CASH & TREASURY ]                           [ Live ]
                               
[Menu]                         ========================================================
• Cash (Active)                [ ZONE 1: THE TREASURY CO-PILOT ] 
                               🚨 Cash runway breached 5-month floor. 
                                  Two consecutive months of softening A/R have choked 
                                  cash conversion.
                               🟠 Heavy bill week ahead ($38K outflow vs $15K avg). 
                                  You must collect from Cobalt to cover payroll cleanly.
                               ========================================================
                               
                               [ ZONE 2: THE LIQUIDITY ANCHORS ]
                               [ CURRENT CASH  ]  [ RUNWAY        ]  [ DSO (Days Sales Out) ]
                               [ $222,800      ]  [ 5.4 mo 🔴     ]  [ 41 Days 🔴           ]
                               [ 🟢 +$8K v Mar ]  [ Target > 6.0  ]  [ +3 days vs last mo   ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: WILL YOU MAKE PAYROLL? ]
                               (Your brilliant chart, simplified. Heavy boxes removed.)
                               
                               [ FORECAST SCENARIOS ] 
                               Pacing: [ Pessimistic ] [ Realistic (Active) ] [ Optimistic ]
                               
                               (Smooth line showing Cash Balance vs Red Payroll Waterline)
                               $400K |     ___
                               $200K |____/   \_____ [ Cash Balance ]
                               $150K |.................................. [ 🔴 Payroll Floor ]
                                     |__________________________________
                                       W1  W2  W3  W4  W5  W6  W7  W8
                               
                               --------------------------------------------------------
                               [ ZONE 4: THE COLLECTIONS ENGINE (Money In - A/R) ]
                               TOTAL OPEN A/R: $112,000 | [ Current $40K ] [ 1-30 Days $63K ] [ 60+ $8.5K 🔴 ]
                               
                               🚨 CRITICAL OVERDUE (Sorted strictly by Days Late)
                               Client             Invoice     Due Date      Amount    Action
                               -----------------------------------------------------------------
                               Cobalt Outdoor     #1004       Feb 15        $8,000    [ Analyze ↗ ]
                               Foundry Ind.       #1026       Mar 22        $12,400   [ Analyze ↗ ]
                               ↳ [ View all 14 Open Invoices ↗ ]

                               --------------------------------------------------------
                               [ ZONE 5: SURVIVAL PAYABLES (Money Out - A/P) ]
                               UPCOMING 14 DAYS: $42,500 DUE (The rest is noise)
                               Due Date     Vendor / Category            Amount   Action
                               -----------------------------------------------------------------
                               May 09       Gusto (May Payroll)          $31,000  [ Cannot Delay ]
                               May 11       AWS (Hosting)                $4,200   [ Cannot Delay ]
                               May 14       HubSpot (Annual Renew)       $7,300   [ Request Deferral ✉️ ]
=======================================================================================
```

### 6. GROWTH (CAPITAL ALLOCATION)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ GROWTH & CAPITAL ALLOCATION ]               [ May 2026 ▾ ]
                               
[Menu]                         ========================================================
• Growth (Active)              [ ZONE 1: THE PHYSICS (Can you afford to grow?) ]
                               [ LIFETIME VALUE (LTV) ]  [ BLENDED CAC ]   [ LTV:CAC RATIO ]  [ SPEND CEILING ]
                               [ $85,700              ]  [ $13,200     ]   [ 6.5x 🟢       ]  [ $28,600 💡    ]
                               [ 🟢 +$2.1K            ]  [ 🟢 -$1.1K   ]   [ Target > 3.0x ]  [ [ View Math ↗ ] ]
                               ========================================================
                               
                               [ ZONE 2: THE LEVERAGE MATRIX (Interactive Sandbox) ]
                               (Sliders drag to impact MRR mathematically. Clicking open generates 
                                targeted workflows rather than generic text.)
                               
                               Current Plateau: $310K ARR ➔ [ TARGET PLATEAU: $375K ARR ] 
                               
                               [ 1. ACQUIRE ] [ Target: 2.0 logos/mo ] --------(🔵)---- [ +$10K/mo ↗ ]
                               [ EXPAND   ] [ Lift book by 5%      ] --(🔵)---------- [ +$3K/mo  ↗ ]
                               [ DEAL SZ  ] [ Target: +10% avg     ] -----(🔵)------- [ +$2.6K/mo↗ ]
                               [ RETAIN   ] [ Target: -1pt churn   ] -(🔵)----------- [ +$0.3K/mo↗ ]

                               --------------------------------------------------------
                               [ ZONE 3: THE FORWARD PIPELINE ]
                               Next 90 Days Confirmed: $130.5K 
                               ↳ [ Open Pipeline & Bookings Drawer → ]
                               
                               [ ZONE 4: THE COMMIT ENGINE ]
                               Projected Lift: +$15.9K / mo.   [ Save to Scenarios ⛶ ]
=======================================================================================
```

### 7. SCENARIOS (SIMULATIONS HUB)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SCENARIOS & MODELING ]                      [ + Blank Sandbox ]
                               
[Menu]                         ========================================================
• Scenarios (Active)           [ ZONE 1: THE DEFAULT FUTURE (No Empty States!) ]
                               (We use their live data to generate a baseline trajectory 
                                automatically. Instant value upon page load.)
                               
                               [ BASELINE TRAJECTORY (Trailing 90D Pace) ]
                               If you change nothing, your cash runway will stabilize at 
                               6.2 months, and MRR will plateau at $45.2K/mo by December.
                               ========================================================
                               
                               [ ZONE 2: SAVED SANDBOXES (The Active Library) ]
                               (This is where models from the Growth page land. We show 
                                the delta—the impact—of the model vs the baseline.)
                               
                               Name                           Projected MRR   Runway 
                               --------------------------------------------------------
                               Aggressive Q3 Growth Plan      $420.0K         5.1 mo
                               ↳ [ Open Sandbox ↗ ]
                               
                               --------------------------------------------------------
                               [ ZONE 3: START A NEW SCENARIO (The Templates) ]
                               (Flattened the heavy boxes into a clean, actionable grid)
                               
                               [ 🛡️ DEFENSE (Survival) ]        [ 🚀 OFFENSE (Growth) ]
                               
                               ↳ Lose Biggest Client            ↳ Hire 2-3 People
                               ↳ 20% Revenue Drop               ↳ Raise Rates by 10%
                               ↳ Collections Slow by 15d        ↳ Land Massive Proposal
=======================================================================================
```

### 8. SCENARIOS: FULL SCREEN SANDBOX MODE
```text
=======================================================================================
[ FULL SCREEN SANDBOX MODE ]
[ ← Exit Sandbox ]                           [ 💾 Save Scenario ]

SCENARIO: HIRE 2-3 PEOPLE

[ Zone A: The Levers (Left Sidebar) ]
  (Founders can stack multiple variables to see the net effect)
  [ + Add Variable ]
  
  [x] Variable 1: [ New Hire: AE         ] [ -$85K/yr ] [ Starts: Jul ▾]
  [x] Variable 2: [ New Hire: Engineer   ] [ -$120K/yr] [ Starts: Aug ▾]
  [ ] Variable 3: [ Lift: Expected Rev   ] [ +$15K/mo ] [ Starts: Oct ▾]

[ Zone B: The Real-Time Delta (Top Anchors) ]
  (These numbers flash and update instantly as they check/uncheck variables on the left)
  [ RUNWAY IMPACT ]        [ MRR IMPACT ]        [ NET MARGIN ]
  [ 🔴 Drops to 4.1 mo ]   [ 🟢 +$15K/mo ]       [ 🔴 Drops to 11% ]
  [ Baseline: 5.4 mo   ]   [ Baseline: $41K]     [ Baseline: 19%   ]

[ Zone C: The Visual Projection (Main Canvas) ]
  (A visual overlay comparing the Baseline vs this Scenario)

  $300K |         ___ [ 🔵 Baseline Cash ]
  $200K |     ___/         ___ [ 🟠 Scenario Cash ]
  $100K |____/        ____/
        |__________________________________
          Jun   Aug   Oct   Dec

[ Zone D: The Co-Pilot Insight ]
  🚨 Warning: Hiring these two roles drops your runway to 4.1 months 
  during their ramp period. You must close $12K in active pipeline 
  before pulling this trigger to stay above your 5-month floor.
=======================================================================================
```

### 9. SETTINGS: WORKSPACE & DATA (ADMIN-MANAGED)
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SETTINGS: WORKSPACE & DATA ]                  
                               
[Menu]                         [ Workspace & Data (Active) ]  [ COA Mapping ]  [ Goals & Targets ]
• Settings (Active)            ========================================================
                               [ ZONE 1: DATA SOURCES & INTEGRATIONS ]
                               
                               🚨 QUICKBOOKS SYNC IS DELAYED
                               Your data syncs daily, but the last successful sync was 
                               8 days ago. Your dashboard data may be stale.
                               ↳ [ Notify Admin Support ✉️ ]
                               
                               [ 🟢 Quickbooks Online ]
                               Workspace: Northwind Marketing
                               Status:    🟠 Stale (Last Sync: Apr 30, 2026)
                               Cadence:   Daily 
                               
                               🔒 Connection securely managed by your Momentum Admin team.
                               
                               --------------------------------------------------------
                               [ ZONE 2: PLATFORM PREFERENCES ]
                               
                               Theme:                 [ ☀️ Light ]  [ 🌙 Dark (Active) ]  [ 💻 System ]
                               
                               Default Landing Page:  [ Dashboard ▾ ] 

                               --------------------------------------------------------
                               [ ZONE 3: USER PROFILE & SECURITY ]
                               
                               [ DA ]  David Aleckson                 Account Scope
                                       david@agencybooks.io           Platform-wide profile
                                       
                                       Sign-In Method                 
                                       Magic Link                     [ Sign Out 🚪 ]
=======================================================================================
```

### 10. SETTINGS: COA MAPPING
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SETTINGS: COA MAPPING ]                       [ Save ]
                               
[Menu]                         [ Workspace & Data ]  [ COA Mapping (Active) ]  [ Goals & Targets ]
• Settings (Active)            ========================================================
                               [ ZONE 1: THE TRIAGE COMMAND ]
                               (We elevate unmapped accounts so the math never breaks silently)
                               
                               [ MAPPED ACCOUNTS ]   🚨 [ 2 UNMAPPED ACCOUNTS ]
                               [ 12 / 12         ]      [ Action Required. $6.2K Floating ]
                               
                               --------------------------------------------------------
                               [ ZONE 2: THE MAPPING LEDGER ]
                               (Clean, full-width. Inline editing via dropdowns.)
                               
                               QBO Account             YTD Total   Momentum Group        Sub-Category
                               ----------------------------------------------------------------------
                               #5000 Prod. Salaries    $130.0K     [ Direct Costs ▾ ]    [ Labor ▾ ]
                               #5050 Contractors       $50.0K      [ Direct Costs ▾ ]    [ Labor ▾ ]
                               #6000 Sales Comm.       $20.0K      [ Marketing/Sales ▾]  [ Comp  ▾ ]
                               #7000 Owner Comp        $60.0K      [ Admin ▾          ]  [ Comp  ▾ ]
=======================================================================================
```

### 11. SETTINGS: GOALS & TARGETS
```text
=======================================================================================
[ V2 GLOBAL SIDEBAR ]          [ SETTINGS: GOALS & TARGETS ]                   [ Save ]
                               
[Menu]                         [ Workspace & Data ]  [ COA Mapping ]  [ Goals & Targets (Active) ]
• Settings (Active)            ========================================================
                               [ ZONE 1: THE PHYSICS ENGINE ]
                               (Grouped logically. Shows current actuals so they aren't guessing)
                               
                               [ 🛡️ SURVIVAL & CASH GOALS ]
                               Metric                  Current Actual   Set Your Target
                               -----------------------------------------------------------------
                               Cash Runway             5.4 mo           Floor [ 6.0 ] mo
                               DSO (Days Sales Out)    41 days          Ceiling [ 45 ] days
                               Top Client Conc.        33.0%            Ceiling [ 25 ] %
                               
                               [ 🚀 PROFITABILITY & MARGIN GOALS ]
                               Metric                  Current Actual   Set Your Target
                               -----------------------------------------------------------------
                               Gross Margin            50.1%            Floor [ 50.0 ] %
                               Net Margin              19.0%            Floor [ 20.0 ] %
                               Labor Efficiency Ratio  2.00x            Floor [ 2.00 ] x
=======================================================================================
```

---

## PART IV: MACRO-DRAWERS (50-60% WIDTH)
*Slide-outs used for system-level proofs and diagnostics.*

### M1. Cash Runway Forecast (Dashboard)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MACRO-DRAWER: CASH RUNWAY (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  CASH RUNWAY FORECAST
                            ||  Current: 5.4 Months (Zero-Cash Date: Late Oct 2026)
                            ||
                            ||  [ Zone A: The Co-Pilot Synthesis ]
                            ||  🚨 Your runway tightened by 0.6 months due to a 
                            ||  $15K increase in Q2 marketing spend and $25K in 
                            ||  delayed AR. 
                            ||
                            ||  [ Zone B: The Mathematical Proof ]
                            ||  Operating Cash:         $222,800
                            ||  ÷ Avg Net Burn (T3M):   -$41,200 /mo
                            ||  ------------------------------------
                            ||  Runway:                 5.4 Months
                            ||
                            ||  [ Zone C: The Visual Forecast (Chart) ]
                            ||  (A beautiful line chart showing cash depleting to $0)
                            ||  $200K |  \
                            ||  $100K |      \
                            ||     $0 |_________\_______________ [ Zero Cash Date ]
                            ||        May   Jul   Sep   Oct
                            ||
                            ||  [ Zone D: The Survival Playbook (Actionable) ]
                            ||  Actions to extend runway > 6 months:
                            ||  [ ✉️ ] Collect $25K Cobalt AR        ➔ +0.6 mo
                            ||  [ ✂️ ] Pause planned Q3 hiring       ➔ +1.2 mo
                            ||  [ 🏦 ] Draw $50K on line of credit   ➔ +1.2 mo
=========================================================
```

### M2. Net Burn Waterfall (Dashboard)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MACRO-DRAWER: NET BURN WATERFALL (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  NET BURN & CASH MOVEMENT
                            ||  Trailing 30 Days (April 2026)
                            ||
                            ||  [ Zone A: The Co-Pilot Synthesis ]
                            ||  🚨 Net Burn accelerated to -$15.2K this month 
                            ||  (up from -$8.0K avg). This was driven by a $25K miss 
                            ||  in A/R collections against standard payroll outflow.
                            ||
                            ||  [ Zone B: The Cash Flow Waterfall (Visual Bridge) ]
                            ||  (A visual breakdown of how we got from Starting to Ending cash)
                            ||
                            ||  [ STARTING ]              [ ENDING CASH ]
                            ||  [ CASH     ]              [             ]
                            ||  [ $238.0K  ]  [ INFLOWS ] [             ]
                            ||       ┃        [ $41.5K  ] [             ]
                            ||       ┃             ┃      [             ]
                            ||       ┃             ┃      [  $222.8K    ]
                            ||       ┃             ┃      [             ]
                            ||       ┗━━━━━━━━━━━━━┻━━━━━▶[ OUTFLOWS    ]
                            ||                            [ -$56.7K     ]
                            ||                                  ┃
                            ||                               (Net Burn: -$15.2K)
                            ||
                            ||  [ Zone C: High-Level Movements (Progressive Disclosure) ]
                            ||  ↳ CASH INFLOWS: $41.5K 
                            ||  ↳ CASH OUTFLOWS: $56.7K (Payroll $31K, Ops $25K)
=========================================================
```

### M3. Accounts Receivable & Aging (Dashboard)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MACRO-DRAWER: ACCOUNTS RECEIVABLE (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  ACCOUNTS RECEIVABLE & AGING
                            ||  Total Outstanding: $118.0K
                            ||
                            ||  [ Zone A: The Co-Pilot Collection Target ]
                            ||  🚨 $42.0K is critically overdue (>60 days). 
                            ||  Collecting this immediately restores 1.2 months of runway.
                            ||
                            ||  [ Zone B: The Aging Buckets (Visualized) ]
                            ||  Current        1-30 Days      31-60 Days     60+ Days
                            ||  [ $55.0K ]     [ $21.0K ]     [ $0 ]         [ $42.0K ]🔴
                            ||
                            ||  [ Zone C: The Collection Hit-List (Sorted by severity) ]
                            ||  Client / Invoice         Amount    Status     Action
                            ||  -----------------------------------------------------------
                            ||  Cobalt Outdoor (#1008)   $25.0K    🔴 75d     [ Send Reminder ✉️ ]
                            ||  Foundry Ind. (#1026)     $12.0K    🔴 45d     [ Send Reminder ✉️ ]
                            ||  Lumen Studio (#1044)     $5.0K     🟠 32d     [ Send Reminder ✉️ ]
=========================================================
```

### M4. Revenue Movement (Dashboard)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MACRO-DRAWER: REVENUE MOVEMENT (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  REVENUE & MRR MOVEMENT
                            ||  This Month (May 2026) vs Last Month
                            ||
                            ||  [ Zone A: The Co-Pilot Synthesis ]
                            ||  🟢 Revenue grew by $3.5K (+9.2%) this month. 
                            ||  Growth was entirely driven by existing client expansion. 
                            ||  No new logos acquired. No churn.
                            ||
                            ||  [ Zone B: The Revenue Bridge (Visual) ]
                            ||  [ APRIL REV  ]             [ MAY REV    ]
                            ||  [ $38.0K     ]  [ GAINS  ] [            ]
                            ||       ┃          [ +$3.5K ] [            ]
                            ||       ┃             ┃       [  $41.5K    ]
                            ||       ┃             ┃       [            ]
                            ||       ┗━━━━━━━━━━━━━┻━━━━━━▶[ LOSSES   ]
                            ||                             [ $0       ]
                            ||
                            ||  [ Zone C: The Deal Ledger (Progressive Disclosure) ]
                            ||  ↳ NEW REVENUE (+$3.5K)
                            ||    • Acme Co. (Scope Expansion)      +$2,500
                            ||    • Brightline SaaS (Rate Hike)     +$1,000
=========================================================
```

### M5. Gross Margin Engine (Dashboard)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MACRO-DRAWER: GROSS MARGIN ENGINE (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  GROSS MARGIN ENGINE
                            ||  Current: 50.1% (Trailing 3 Months)
                            ||
                            ||  [ Zone A: The Co-Pilot Synthesis ]
                            ||  🟠 Gross margin slipped by 1.2 points this month. 
                            ||  Revenue was flat, but Cost of Delivery (COGS) increased 
                            ||  due to a 15% spike in AWS hosting costs.
                            ||
                            ||  [ Zone B: Revenue vs COGS Trend ]
                            ||  (A dual-line chart showing the gap between Revenue and COGS)
                            ||  [ 🔵 Revenue ]   [ 🔴 Cost of Delivery ]
                            ||
                            ||  [ Zone C: COGS Variance (The Bleeding) ]
                            ||  Direct Costs (COGS)       Amount   Trend vs Prior
                            ||  ----------------------------------------------------
                            ||  AWS Hosting               $6,200   🔴 +15%
                            ||  Stripe/Payment Fees       $1,200   🟡 +4%
                            ||  Customer Success Labor    $13,308  🟢 Flat
=========================================================
```

### M6. Churn & MRR Bridge (Clients Page)
```text
=========================================================
[ MAIN ROSTER (Dimmed) ]  ||  [ WIDE MACRO-DRAWER (50% Screen) ]
                          ||  [ ← Close ]                        [ ⛶ Full Page ]
                          ||
                          ||  CHURN & REVENUE MOVEMENT
                          ||  Trailing 12 Months (Jun 2025 - May 2026)
                          ||
                          ||  [ Zone A: The Co-Pilot Insight ]
                          ||  🟢 Quiet last 12 months overall — 0.9% average 
                          ||  monthly churn, well under your 5% threshold. 
                          ||  Only 1 client lost ($91K LTV impact).
                          ||
                          ||  [ Zone B: The MRR Bridge (Your Image 3 Math) ]
                          ||  GAINS (+$190.5K)            LOSSES (-$127.0K)
                          ||  + New MRR      +$115.0K     - Contraction   -$36.0K
                          ||  + Expansion    +$74.5K      - Churned       -$91.0K
                          ||  [=====(🟩)==========]     [====(🟥)===]
                          ||
                          ||  NET CHANGE: 🟢 +$63,500
                          ||
                          ||  [ Zone C: The Churn Trend (Context) ]
                          ||  (Your bar chart showing the single spike in Oct)
                          ||  [                 ▆               ] 11.1%
                          ||   Jun       Oct       Feb       May
                          ||
                          ||  [ Zone D: The Monthly Ledger (Progressive Disclosure) ]
                          ||  (We list the months. Clicking a row expands it to show WHO)
                          ||  Month      Active   +New   -Lost   Churn %   Net Rev
                          ||  ----------------------------------------------------
                          ||  May 2026   9        0      0       0.0%      $0
                          ||  Apr 2026   9        0      0       0.0%      $0
                          ||
                          ||v Feb 2026   8        +1     0       0.0%      +$1.7K
                          ||  ↳ JOINED: Lumen Studio (+$1.7K MRR)
                          ||
                          ||v Nov 2025   9        0      -1      11.1%🔴   -$7.0K
                          ||  ↳ CHURNED: Greenline Logistics (-$7.0K MRR)
=========================================================
```

### M7. The Spend Ceiling (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MACRO-DRAWER: SPEND CEILING (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  SPEND CEILING CALCULATOR
                            ||  Your Max CAC is $28.6K based on a 3:1 Target.
                            ||
                            ||  [ Zone A: The Co-Pilot Permission ]
                            ||  🟢 You have $15.4K in "CAC Headroom." You are acquiring 
                            ||  clients so efficiently ($13.2K CAC) that you can safely 
                            ||  double your marketing spend without ruining your unit economics.
                            ||
                            ||  [ Zone B: The Underlying Physics (The Proof) ]
                            ||  Current Lifetime Value (LTV):          $85.7K
                            ||  Your Target LTV:CAC Ratio:             3.0x   [ Edit Target ✏️ ]
                            ||  ------------------------------------------------
                            ||  Mathematically Allowed CAC Ceiling:    $28.6K
                            ||
                            ||  [ Zone C: The Capital Constraint Check (Elite CFO Logic) ]
                            ||  (Even if the math says they CAN spend $28K, do they have 
                            ||  the cash in the bank to survive the payback period?)
                            ||  Current CAC Payback Period:            6.5 Months
                            ||  Current Cash Runway:                   5.4 Months 🔴
                            ||
                            ||  🚨 WARNING: While your unit economics are excellent, your 
                            ||  cash runway (5.4 mo) is shorter than your payback period (6.5 mo).
                            ||  You cannot afford to max out your spend ceiling right now 
                            ||  without risking a cash crunch.
=========================================================
```

### M8. Pipeline & Bookings (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MACRO-DRAWER: PIPELINE & BOOKINGS (50%) ]
                            ||  [ ← Close ]                        [ ⛶ Full Page ]
                            ||
                            ||  FORWARD BOOKED REVENUE
                            ||  Next 90 Days: $130.5K Confirmed
                            ||
                            ||  [ Zone A: The Runway Coverage Insight ]
                            ||  🔴 Forward booked revenue is thin for Q3. Confirmed 
                            ||  bookings only cover 62% of anticipated burn. You must 
                            ||  close $45K in active pipeline by July to maintain cash.
                            ||
                            ||  [ Zone B: The Evicted Chart (Recycled perfectly) ]
                            ||  (The stacked bar chart of Recurring vs Project vs Pipeline)
                            ||  $60K |   [R][P]
                            ||  $45K |   [R][P][?]
                            ||  $30K |   [R][R][?][?]
                            ||       |__________________________________
                            ||         Jun Aug Oct Dec Feb Apr
                            ||
                            ||  [ Zone C: Pipeline Required to Break-Even ]
                            ||  • Drift Marketing (Expansion)   $5.0K/mo  [ 70% Prob ]
                            ||  • Horizon Tech (New Logo)       $12.0K/mo [ 50% Prob ]
=========================================================
```

---

## PART V: MICRO-DRAWERS (30% WIDTH)
*Slide-outs used for entity-level deep dives and workflows.*

### u1. Revenue Concentration (Clients Page)
```text
=========================================================
[ MAIN ROSTER (Dimmed) ]      ||  [ RIGHT-SIDE MICRO DRAWER (30%) ]
                              ||  [ ← Close ]                      
                              ||
                              ||  REVENUE CONCENTRATION
                              ||  🔴 Warning: Top client breaches 25% ceiling.
                              ||
                              ||  [ Zone A: The Trailing 90D Visual ]
                              ||  Acme (33%)     Brightline (21%)   Dunwoody (11%)
                              ||  [======(🔴)===|==================|=========|.......]
                              ||
                              ||  [ Zone B: The Concentration Ledger ]
                              ||  Client               % of Rev   Risk
                              ||  ----------------------------------------------------
                              ||  1. Acme Co.          33.0%      🔴 Breach
                              ||  2. Brightline SaaS   21.0%      🟢
                              ||  3. Dunwoody Dental   11.0%      🟢
                              ||
                              ||  [ 💡 Mitigation Playbook (The Co-Pilot) ]
                              ||  To dilute Acme Co. below 25%, you need to acquire 
                              ||  $28.5K in new non-Acme revenue. 
                              ||  ↳ [ View Growth Scenarios → ]
=========================================================
```

### u2. Category Deep-Dive (Profitability Page)
```text
=========================================================
[ PROFITABILITY (Dimmed) ]    ||  [ MICRO-DRAWER: MEDIA SPEND (30%) ]
                              ||  [ ← Close ]                      
                              ||
                              ||  CATEGORY: MEDIA SPEND (Sales & Marketing)
                              ||  Last 6 Months: $22.2K (8.8% of Revenue)
                              ||
                              ||  [ Zone A: Context & Alert ]
                              ||  🔴 Growing faster than revenue (+24.0% vs prior 6M).
                              ||  
                              ||  [ Zone B: The Trend Context ]
                              ||  (Bar chart showing the spend climbing over 6 months)
                              ||  $5K |             ▃  ▆  ▇
                              ||  $0  |  _  _  ▂  ▃
                              ||         Nov Dec Jan Feb Mar Apr
                              ||
                              ||  [ Zone C: Vendor / Line-Item Breakdown ]
                              ||  (Sorted strictly by highest variance, not alphabetical)
                              ||  Vendor / Account          Amount (6M)   Trend
                              ||  ------------------------------------------------
                              ||  Google Ads                $12,400       🔴 +40%
                              ||  LinkedIn Ads              $6,500        🟢 Flat
                              ||  Meta Platforms            $3,300        🔴 +12%
                              ||
                              ||  [ Zone D: Ledger Verification ]
                              ||  Recent transactions driving Google Ads variance:
                              ||  Apr 15 - Google Ads - $3,100
                              ||  Apr 02 - Google Ads - $1,200
=========================================================
```

### u3. Upcoming Outflows & A/P (Cash Page)
```text
=========================================================
[ MAIN DASHBOARD (Dimmed) ] ||  [ MICRO-DRAWER: UPCOMING OUTFLOWS & A/P (30%) ]
                            ||  [ ← Close ]                        
                            ||
                            ||  UPCOMING CASH OUTFLOWS (Next 14 Days)
                            ||  Total Expected: $42,500
                            ||
                            ||  [ Zone A: The Co-Pilot Alert ]
                            ||  🚨 You have $42.5K clearing in the next 14 days, but 
                            ||  only $22.8K in liquid cash. You must collect from A/R 
                            ||  or draw from credit by Thursday.
                            ||
                            ||  [ Zone B: The Immediate Ledger (Actionable) ]
                            ||  Due Date     Vendor / Item             Amount
                            ||  ---------------------------------------------------
                            ||  May 09 (Thu) Gusto (May Payroll)       $31,000  🔴
                            ||  May 11 (Sat) AWS Hosting               $4,200 
                            ||  May 14 (Tue) HubSpot Annual Renew      $7,300   [ Delay ✉️ ]
                            ||
                            ||  ↳ [ View Accounts Receivable to offset ↗ ]
=========================================================
```

### u4. A/R Intelligence (Cash Page)
```text
=========================================================
[ CASH PAGE (Dimmed) ]        ||  [ MICRO-DRAWER: A/R INTELLIGENCE (30%) ]
                              ||  [ ← Close ]                       
                              ||
                              ||  A/R DOSSIER: COBALT OUTDOOR
                              ||  Total Outstanding: $25,000
                              ||
                              ||  [ Zone A: The Payment Behavior (The Facts) ]
                              ||  🚨 Cobalt historically pays late (averaging 41 days). 
                              ||  However, Invoice #1004 is now 34 days past their 
                              ||  *own* historical baseline. 
                              ||
                              ||  [ Zone B: Client Vitals ]
                              ||  Pay Reliability:         71.6% 🔴 (Target > 95%)
                              ||  Average Days to Pay:     41 Days 🔴
                              ||  Lifetime Billed:         $233,000
                              ||  % of Agency Open AR:     22.3%
                              ||
                              ||  [ Zone C: Active Exposure (The Debt) ]
                              ||  Invoice      Due Date      Amount     Status
                              ||  ------------------------------------------------
                              ||  #1004        Feb 15        $8,000     🔴 75d Late
                              ||  #1021        Mar 15        $17,000    🔴 45d Late
                              ||  
                              ||  [ ⤓ Download PDFs ] [ 🔗 Copy Invoice Links ]
                              ||
                              ||  [ Zone D: The Leverage Co-Pilot ]
                              ||  🚨 If Cobalt's $25.0K balance is not collected this 
                              ||  week, your cash balance drops below the $31K May 
                              ||  payroll requirement.
=========================================================
```

### u5. Lever 1: Acquisition (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MICRO-DRAWER: ACQUISITION LEVER (30%) ]
                            ||  [ ← Close ]                        
                            ||
                            ||  LEVER 1: ACQUISITION 
                            ||  Target: +2 Clients / Month
                            ||  Impact: +$10.0K /mo MRR
                            ||
                            ||  [ Zone A: The Mathematical Reality Check ]
                            ||  To hit this target based on your historical funnel:
                            ||  
                            ||  [ ⚙️ THE MATH ENGINE ]
                            ||  Average Deal Size:      $5,000 /mo
                            ||  Sales Close Rate:       20%
                            ||  Lead-to-Meeting Rate:   10%
                            ||
                            ||  [ 🎯 THE TARGET OUTPUT ]
                            ||  You must generate:
                            ||  • 10 Qualified Sales Meetings
                            ||  • 100 Raw Leads
                            ||  ↳ Cost to execute at current CAC: $26,400
=========================================================
```

### u6. Lever 2: Expansion (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]      ||  [ MICRO-DRAWER: EXPANSION (30%) ]
                              ||  [ ← Close ]                      
                              ||
                              ||  LEVER 2: EXPANSION 
                              ||  Target: Lift existing book by 5%
                              ||  Impact: +$3.0K /mo MRR
                              ||
                              ||  [ Zone A: The Co-Pilot Strategy ]
                              ||  To achieve a 5% lift, you need to find $1,800/mo 
                              ||  in new revenue from your existing roster. 
                              ||  Here are the clients with the highest probability.
                              ||
                              ||  [ Zone B: The Upsell Hit List (Actionable) ]
                              ||  (Sorted by tenure, margin, and payment reliability)
                              ||
                              ||  1. Acme Co. 
                              ||     51 mo tenure • 42% margin • $124K Rev
                              ||     💡 Anniversary approaching. Scope expansion prime.
                              ||     [ Open Client Record ↗ ]
                              ||
                              ||  2. Brightline SaaS
                              ||     35 mo tenure • 48% margin • $78K Rev
                              ||     💡 Highest margin client. High capacity to absorb price hike.
                              ||     [ Open Client Record ↗ ]
                              ||
                              ||  [ Zone C: Execution Plan ]
                              ||  Draft a 5% rate increase email for these two clients 
                              ||  effective start of Q3.
=========================================================
```

### u7. Lever 3: Deal Size (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MICRO-DRAWER: DEAL SIZE LEVER (30%) ]
                            ||  [ ← Close ]                        
                            ||
                            ||  LEVER 3: DEAL SIZE
                            ||  Target: Increase avg deal by 10%
                            ||  Impact: +$2.6K /mo MRR
                            ||
                            ||  [ Zone A: The Pricing Co-Pilot ]
                            ||  Your average deal size has been stuck at $5.0K for 
                            ||  8 months. You are losing margin to discounting. 
                            ||
                            ||  [ Zone B: The Discount Leakage (The Target List) ]
                            ||  Recent won deals below your $5K baseline:
                            ||  • Foundry Ind.   $4.0K   (20% Discount applied)
                            ||  • Greenline Log. $3.8K   (Custom package)
                            ||
                            ||  [ Zone C: The Execution Playbook ]
                            ||  1. Establish a strict 5% discount floor for sales.
                            ||  2. Target next 3 proposals at $5.5K floor to normalize.
=========================================================
```

### u8. Lever 4: Retention (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MICRO-DRAWER: RETENTION & RISK (30%) ]
                            ||  [ ← Close ]                        
                            ||
                            ||  LEVER 4: RETENTION
                            ||  Target: Reduce monthly churn by 1pt
                            ||  Impact: +$0.3K /mo MRR
                            ||
                            ||  [ Zone A: The Co-Pilot Strategy ]
                            ||  You currently have $25.0K in MRR flagged as "At Risk" 
                            ||  due to declining engagement or slow payment history. 
                            ||  Saving 1 of these clients meets your target.
                            ||
                            ||  [ Zone B: The At-Risk Watchlist ]
                            ||  (Seamlessly pulling the risk flags from the Clients page)
                            ||  Client                 MRR      Risk Factor
                            ||  -------------------------------------------------------
                            ||  1. Cobalt Outdoor      $8.3K    🔴 75 days overdue AR
                            ||     [ Open Client Drawer ↗ ]
                            ||
                            ||  2. Foundry Industrial  $9.0K    🟠 Scope shrinking
                            ||     [ Open Client Drawer ↗ ]
=========================================================
```

### u9. Commit Scenario (Growth Page)
```text
=========================================================
[ GROWTH PAGE (Dimmed) ]    ||  [ MICRO-DRAWER: COMMIT SCENARIO (30%) ]
                            ||  [ ← Cancel ]                       
                            ||
                            ||  SAVE GROWTH SCENARIO
                            ||  You are creating a new financial model based on 
                            ||  your modified growth levers.
                            ||
                            ||  [ Zone A: Scenario Naming ]
                            ||  Scenario Name:
                            ||  [ "Aggressive Q3 Growth Plan"                ]
                            ||
                            ||  [ Zone B: The Delta Summary ]
                            ||  • Target New Clients: 1/mo ➔ 2/mo
                            ||  • Target Deal Size: $5.0K ➔ $6.5K
                            ||  ------------------------------------------------
                            ||  Projected Plateau: $420K/mo (+$110K lift)
                            ||
                            ||  [ Save & Open Scenarios ↗ ]
=========================================================
```

---
*(End of Manifesto. System Architecture Sealed.)*
