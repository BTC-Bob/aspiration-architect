# AspirationArchitect — Master Specification
## Version 0.3

---

## App Overview

**App Name:** AspirationArchitect

**Purpose:** A personal Life Management App designed to:
1. Establish and reinforce positive daily habits that lead to personal/spiritual growth and peace of mind
2. Focus on making daily progress toward long-term goals
3. Create a historical record of life through journaling, milestones, accomplishments, and important dates

**Target User:** Single user ("Architect") seeking structure, accountability, and intentional living.

**Core Philosophy:** Almost every action or activity has some element of Love, Health, and Freedom as an underlying intention. The app surfaces these connections and makes them visible.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 (Vite Build Tool) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS |
| Routing | React Router DOM (v6) |
| Icons | Lucide React |
| Backend-as-a-Service | Google Firebase |
| Authentication | Firebase Auth (Google Account) |
| Database | Google Cloud Firestore (NoSQL) |
| Hosting | Hostinger |
| Platform | Progressive Web App (PWA) |

**Firebase Project ID:** `aspiration-architect-b90be`

---

## The Three Pillars

The pillars are not buckets — they are **dimensions** that every action touches to varying degrees.

| Pillar | Color | Hex Code | Represents |
|--------|-------|----------|------------|
| **Love & Family** | Red | #ef4444 | Relationships, family, connection, being present for others |
| **Health & Body** | Cyan | #06b6d4 | Body, mind, energy, longevity, inner peace |
| **Freedom & Finance** | Amber | #f59e0b | Financial security, autonomy, skills, independence |

**Pillar Order:** Always referenced as Love, Health, Freedom (L/H/F) — this order is strictly enforced throughout the app.

---

## PV (Point Value) Calculation Model

PV is the scoring engine that ties together habits, tasks, protocols, and milestones. It answers: "Am I living in alignment with my values?"

### Formula

```
Total PV = (Value Tier Rate) × (Duration ÷ 30 min)
```

### Value Tiers

| Value Tier | PV per 30 min | Examples |
|------------|---------------|----------|
| Maintenance | 2 PV | Shaving, minor errands |
| Standard | 5 PV | Typical habits, daily tasks |
| High Impact | 10 PV | Deep work, major health actions |
| Milestone | 100–1000 PV | Major life accomplishments |
| Negative | -1 to -10 PV | Self-sabotaging behaviors |

### PV Distribution

When a task is completed, its PV is distributed across all three pillars based on the category's weighted distribution.

**Example:** Completing "Gym / Treadmill" (High Impact, 60 min)
- Total PV: 10 × (60 ÷ 30) = 20 PV
- Distribution (L/H/F): 10% / 60% / 30%
- Love: 2 PV, Health: 12 PV, Freedom: 6 PV

---

## Daily & Annual PV Targets

### Daily Tiers

| Tier | PV Range | Meaning |
|------|----------|---------|
| Poor | 0–30 | Minimal intentional action |
| Below Average | 31–50 | Some progress, missed key commitments |
| Average | 51–75 | Solid day, partial completion |
| Good | 76–100 | Strong day, Core 3 + Protocols done |
| Exceptional | 101+ | Everything done plus extra impact |

### Annual Tiers

| Tier | PV Range | Meaning |
|------|----------|---------|
| Poor | 0–15,000 | Significant struggle |
| Below Average | 15,001–22,000 | Inconsistent effort |
| Average | 22,001–28,000 | Steady, showed up most days |
| Good | 28,001–34,000 | Strong consistency + milestones |
| Exceptional | 34,001+ | Transformational year |

---

## Component Relationship Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MORNING GREETING                             │
│  (Prayer → Physiology → Accountability → Plan Today → Launch)       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD                                 │
│  (Core 3 + Flex Tasks + Protocols → Task Completion → PV Update)    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            JOURNAL                                  │
│  (Auto-capture tasks + Manual entries + Memorable Moments)          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             VAULT                                   │
│  (Daily Log + Health + Milestones + Streaks + Blueprint + Annual)   │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

| Source | Creates | Stored In |
|--------|---------|-----------|
| Morning Greeting | Physiology data, Accountability responses, Planned tasks | dailyLogs/{MM-DD-YYYY} |
| Dashboard | Completed tasks, Protocol progress, PV earned | dailyLogs/{MM-DD-YYYY} |
| Library | Habits, Protocols, Tasks, Categories | habits/, protocols/, tasks/, categories/ |
| Journal | Manual entries, Notes on tasks, Memorable flags | dailyLogs/{MM-DD-YYYY}/journalEntries |
| Milestones | Goal progress, Sub-goal completion | milestones/ |
| Streaks | Consecutive completion counts | streaks/ |

---

## User Flow Diagrams

### Daily Flow

```
WAKE UP
    │
    ▼
MORNING GREETING
    │
    ├── Step 1: Prayer (mindset alignment)
    ├── Step 2: Physiology Check (sleep score, weight)
    ├── Step 3: Accountability (yesterday's integrity)
    ├── Step 4: Plan Today (calendar + Core 3 + Flex + Protocols)
    └── Step 5: Launch Dashboard
    │
    ▼
DASHBOARD (Execute throughout day)
    │
    ├── Check off Core 3 tasks
    ├── Complete Protocol habits
    ├── Add Flex tasks if time allows
    └── PV gauges update in real-time
    │
    ▼
JOURNAL (Automatic + Manual)
    │
    ├── Tasks auto-captured with PV details
    ├── Add notes to any entry
    └── Mark Memorable Moments
    │
    ▼
NEXT MORNING → ACCOUNTABILITY
    │
    └── System shows: planned vs. completed
```

### Task Creation Flow

```
USER TYPES IN SMART SEARCH
    │
    ├── Match found in Library → Select → Pre-fills category, duration
    │
    └── No match found → Create new task
                              │
                              ├── Enter task name
                              ├── Select category (auto-suggest via keywords)
                              ├── Select duration (preset buttons)
                              ├── Value Tier auto-assigned from category
                              └── Option: Save to Library for reuse
```

---

## Hierarchy of Elements

| Term | Definition | Example |
|------|------------|---------|
| **Protocol** | A container of habits grouped as a routine | "Morning Protocol" |
| **Habit** | An individual recurring action (reusable) | "Hydrate 16oz" |
| **Task** | A one-time or recurring action for today | "Call insurance company" |
| **Milestone** | A major life accomplishment | "Launch CNA Packet" |
| **Category** | Classification determining PV distribution | "Exercise / Fitness" |

### Key Distinction

- **Habits** = Pre-defined in Library, reusable across Protocols
- **Protocols** = Containers that reference Habits + schedule + bonus
- **Tasks** = Created during Plan Today, may or may not be saved to Library
- **Milestones** = Long-term goals with optional sub-goals

---

## Implementation Priority

| Priority | Component | Why |
|----------|-----------|-----|
| 1 | Firestore schema + data persistence | Foundation — nothing works without saving |
| 2 | Morning Greeting (full flow) | Entry point to each day |
| 3 | Dashboard (new layout) | Where you execute |
| 4 | Task/Protocol completion + PV calculation | Core scoring engine |
| 5 | Journal auto-capture | Records your day |
| 6 | Vault (basic Daily Log + Blueprint) | See your history |
| 7 | Milestones | Longer-term tracking |
| 8 | Streaks + bonuses | Gamification layer |
| 9 | Settings (full configuration) | Refinement |

---

## Global Standards

| Standard | Value |
|----------|-------|
| Date format | MM-DD-YYYY (strictly enforced everywhere) |
| Pillar order | Love, Health, Freedom (L/H/F) |
| Love color | #ef4444 (Red-500) |
| Health color | #06b6d4 (Cyan-500) |
| Freedom color | #f59e0b (Amber-500) |
| Authentication | Google Account via Firebase Auth |
| Privacy PIN | 4-digit numeric + security question recovery |
| Code indentation | Tabs (not spaces) |

---

## Supporting Documents

| Document | Contents |
|----------|----------|
| 01-MORNING-GREETING.md | Complete spec for all 5 steps, configurability, navigation |
| 02-DASHBOARD.md | Layout, task completion, protocol interaction, responsive behavior |
| 03-LIBRARY-PROTOCOLS-HABITS.md | Protocol Calibrator, Habit creation, reuse model |
| 04-JOURNAL.md | Auto-capture, notes, privacy, integration points |
| 05-VAULT.md | All 6 views, Blueprint visualization, PIN protection |
| 06-MILESTONES-STREAKS.md | Milestone tracking, sub-goals, streak bonuses |
| 07-SETTINGS.md | Full configuration structure |
| DATA-CATEGORY-LIBRARY.md | All 21 categories with distributions, keywords |
| DATA-FIRESTORE-SCHEMA.md | Complete database structure |
| DATA-CONSTANTS.md | Pillar colors, PV tiers, date format, targets |

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
