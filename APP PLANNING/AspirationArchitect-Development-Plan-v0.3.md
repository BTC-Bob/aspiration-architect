# AspirationArchitect Development Plan
## Version 0.3 Planning Document
### Prepared: January 9, 2026

---

## Table of Contents

1. [App Overview](#1-app-overview)
2. [Current State (v0.2.1 Alpha)](#2-current-state-v021-alpha)
3. [Core Conceptual Model](#3-core-conceptual-model)
4. [The Three Pillars](#4-the-three-pillars)
5. [PV (Point Value) System](#5-pv-point-value-system)
6. [The Impact Connection Method](#6-the-impact-connection-method)
7. [Category Library](#7-category-library)
8. [Protocol Calibrator Redesign](#8-protocol-calibrator-redesign)
9. [Morning Greeting Redesign](#9-morning-greeting-redesign)
10. [Dashboard Redesign](#10-dashboard-redesign)
11. [Accountability Loop](#11-accountability-loop)
12. [Outstanding Questions](#12-outstanding-questions-for-next-session)

---

## 1. App Overview

**App Name:** AspirationArchitect

**Purpose:** A personal Life Management App designed to:

1. Establish and reinforce positive daily habits that lead to personal/spiritual growth and peace of mind
2. Focus on making daily progress toward long-term goals
3. Create a historical record of life through journaling, milestones, accomplishments, and important dates

**Target User:** The app is built for personal use — a single user seeking structure, accountability, and intentional living.

**Core Philosophy:** Almost every action or activity has some element of Love, Health, and Freedom as an underlying intention. The app should surface these connections and make them visible.

---

## 2. Current State (v0.2.1 Alpha)

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 (Vite Build Tool) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS |
| Routing | React Router DOM (v6) |
| Icons | Lucide React |
| Backend-as-a-Service | Google Firebase |
| Database | Google Cloud Firestore (NoSQL) |
| Hosting | Hostinger |

**Firebase Project ID:** `aspiration-architect-b90be`

### What's Built

| Module | Status | Notes |
|--------|--------|-------|
| Dashboard (Command Center) | Partially Built | Three pillar gauges exist; daily task list missing; needs redesign |
| Library (Architect's Ledger) | Partially Built | Protocol Calibrator UI exists; data not persisted to Firestore |
| Vault (History) | Mock Data | Uses `mockHistory.js` with simulated 90-day data |
| Settings (Control Room) | Functional | Daily Briefing syncs to Dashboard in real-time |
| Journal | Not Built | Page exists in navigation but not implemented |
| Firebase Auth | Functional | Sign-in/out works; user-specific data isolation |
| Firestore Sync | Partial | Only Daily Briefing syncs; habits/tasks are ephemeral |
| Google Calendar Bridge | Functional | Opens correct day in Google Calendar |

### Key Technical Debt

- Task completion state resets on refresh (not persisted)
- Library entries live in browser memory only
- History powered by mock data, not real user data
- Morning Greeting is static/hardcoded

---

## 3. Core Conceptual Model

### Hierarchy of Elements

```
PROTOCOL (Routine)
   └── Contains multiple HABITS (Individual recurring actions)

DAILY TASK
   └── Fresh item created each morning (not necessarily recurring)

MILESTONE
   └── Major life accomplishment (infrequent, high-value)
```

### Definitions

| Term | Definition | Example |
|------|------------|---------|
| **Protocol** | A set of habits grouped as a routine | "Morning Protocol" |
| **Habit** | An individual recurring action within a protocol | "Meditate 10 minutes" |
| **Daily Task** | A one-time task created fresh each day | "Call insurance company" |
| **Milestone** | A major accomplishment tied to long-term goals | "Launch CNA Packet" |
| **Category** | A classification that determines PV distribution | "Exercise / Fitness" |

### Key Distinction

- **Protocols/Habits** = Pre-defined in the Library; recurring
- **Daily Tasks** = Created each morning during Morning Greeting; often one-time
- Both contribute to PV and pillar gauges

---

## 4. The Three Pillars

### Pillar Definitions

| Pillar | Color | Represents |
|--------|-------|------------|
| **Love** | Pink/Red | Relationships, family, connection, being present for others |
| **Health** | Yellow/Gold | Body, mind, energy, longevity, inner peace |
| **Freedom** | Cyan/Blue | Financial security, autonomy, skills, independence |

### Interconnection Philosophy

The pillars are not buckets — they are **dimensions** that every action touches to varying degrees.

**Example:** Working on the App
- 60% Freedom (building income/autonomy)
- 20% Love (financial stability for family)
- 20% Health (mental engagement, purpose)

**Example:** Grocery Shopping
- 70% Health (nutrition)
- 20% Love (caring for family)
- 10% Freedom (financial responsibility)

### Visual Representation (Dashboard)

- Three gauges showing current-day PV accumulation per pillar
- Colors must remain consistent throughout the app
- Gauges reflect real-time progress as tasks are completed

---

## 5. PV (Point Value) System

### Overview

PV is the scoring engine that ties together habits, tasks, protocols, and milestones. It answers: "Am I living in alignment with my values?"

### Two Tiers of Points

| Tier | Description | PV Range |
|------|-------------|----------|
| **Daily Points** | Small, consistent gains (or losses) from habits/tasks | -5 to +30 |
| **Milestone Points** | Big, rare wins from major life accomplishments | +100 to +1000+ |

### Earning Positive PV

- Completing a habit
- Completing a daily task
- Completing an entire protocol
- Logging a journal entry (TBD)
- Completing the Morning Greeting (TBD)
- Achieving a milestone

### Earning Negative PV

Negative PV occurs when actions take you **further away** from your goals:

- Poor sleep (logged or tracked via Whoop integration)
- Skipping a committed protocol
- Junk food / poor nutrition choices
- Other self-sabotaging behaviors

### PV Distribution

When a task is completed, its PV is **distributed across all three pillars** based on the category's weighted distribution.

**Example:** Completing "Gym / Treadmill" (+12 PV)

| Pillar | % | PV Earned |
|--------|---|-----------|
| Health | 60% | +7.2 |
| Freedom | 30% | +3.6 |
| Love | 10% | +1.2 |

### Annual PV Goals (To Be Defined)

- Determine what constitutes a Poor / Average / Good / Exceptional day
- Calculate annual targets based on daily goals
- Milestone achievements can significantly boost yearly totals

---

## 6. The Impact Connection Method

### Overview

A systematic, nuanced method for assigning pillar weights to every category. This ensures consistency and removes arbitrary decision-making.

### The Three Questions

For every category, ask:

| Question | Pillar |
|----------|--------|
| Does this directly affect my **body, mind, energy, or longevity**? | Health |
| Does this directly affect my **financial security, autonomy, or skills**? | Freedom |
| Does this directly affect my **relationships or ability to show up for others**? | Love |

### Rating Scale

| Rating | Meaning | Weight Multiplier |
|--------|---------|-------------------|
| **3** | Primary — this IS the thing | 3.0 |
| **2** | Strong secondary — clearly contributes | 1.5 |
| **1** | Indirect — loose but real connection | 0.5 |

### Calculation Method

1. Assign a rating (1, 2, or 3) to each pillar
2. Convert to weights (3 → 3.0, 2 → 1.5, 1 → 0.5)
3. Sum total weights
4. Calculate percentage per pillar

### Worked Example: Exercise / Fitness

| Pillar | Rating | Weight |
|--------|--------|--------|
| Health | 3 (Primary) | 3.0 |
| Freedom | 2 (Discipline) | 1.5 |
| Love | 1 (Presence) | 0.5 |
| **Total** | | **5.0** |

**Result:** Health 60% / Freedom 30% / Love 10%

### Worked Example: Date Night

| Pillar | Rating | Weight |
|--------|--------|--------|
| Love | 3 (Primary) | 3.0 |
| Health | 2 (Emotional) | 1.5 |
| Freedom | 1 (Partnership) | 0.5 |
| **Total** | | **5.0** |

**Result:** Love 60% / Health 30% / Freedom 10%

---

## 7. Category Library

### Initial Category Set

The following categories have been defined using the Impact Connection Method:

| Category | Health | Freedom | Love | Distribution (H/F/L) |
|----------|--------|---------|------|----------------------|
| Exercise / Fitness | 3 | 2 | 1 | 60 / 30 / 10 |
| Nutrition / Meal Prep | 3 | 1 | 2 | 60 / 10 / 30 |
| Sleep / Recovery | 3 | 2 | 1 | 60 / 30 / 10 |
| Spiritual / Prayer | 2 | 1 | 3 | 30 / 10 / 60 |
| Deep Work (Career/Projects) | 1 | 3 | 2 | 10 / 60 / 30 |
| Finance / Budgeting | 1 | 3 | 2 | 10 / 60 / 30 |
| Relationship / Quality Time | 2 | 1 | 3 | 30 / 10 / 60 |
| Family / Household | 1 | 2 | 3 | 10 / 30 / 60 |
| Personal Care / Grooming | 3 | 1 | 2 | 60 / 10 / 30 |
| Admin / Errands | 1 | 2 | 2 | 20 / 40 / 40 |
| Creative Work / Side Hustle | 2 | 3 | 1 | 30 / 60 / 10 |
| Learning / Skill Building | 2 | 3 | 1 | 30 / 60 / 10 |
| Medical / Appointments | 3 | 1 | 2 | 60 / 10 / 30 |
| Negative: Poor Sleep | -3 | -2 | -1 | 60 / 30 / 10 |
| Negative: Junk Food | -3 | -1 | -1 | 60 / 20 / 20 |
| Negative: Skipped Protocol | -2 | -2 | -2 | 33 / 33 / 33 |

### Reasoning Display Format

Each category includes **color-coded reasoning** for each pillar:

**Example: Exercise / Fitness (+12 PV)**

| Pillar | % | PV | Reasoning |
|--------|---|-----|-----------|
| 🟡 Health | 60% | +7.2 | Physical vitality and energy |
| 🔵 Freedom | 30% | +3.6 | Discipline fuels self-reliance |
| 🔴 Love | 10% | +1.2 | Being present for those who need you |

### Reasoning Rules

- Always starts with a noun or gerund
- Maximum 6-8 words
- Describes why this action connects to this pillar
- Tone: declarative, not preachy
- **Displayed only in Library (Protocol Calibrator), not on Dashboard**

---

## 8. Protocol Calibrator Redesign

### Current State

- Single-select pillar (forces all-or-nothing assignment)
- Multi-select creates even split only (33/33/33 or 50/50)
- Manual PV slider
- No category system
- No reasoning display

### Proposed Changes

1. **Add Category Selector**
   - Dropdown to select from Category Library
   - Category selection auto-populates pillar distribution

2. **Replace Pillar Buttons with Weighted Display**
   - Show three pillar bars with percentages
   - Color-coded to match pillar colors
   - Non-editable by default (driven by category)

3. **Add Reasoning Display**
   - Show 6-8 word reasoning per pillar
   - Color-coded text or icons

4. **Add Override Toggle (Advanced)**
   - "Customize Distribution" toggle for edge cases
   - When enabled, allows manual adjustment of percentages
   - Three linked sliders that maintain 100% total

5. **Keep Existing Fields**
   - Protocol Name
   - Type (Habit vs Project)
   - Duration slider
   - Structural Classification → rename to "Value Tier"

### Value Tiers (Replaces Structural Classification)

| Tier | PV Range | Examples |
|------|----------|----------|
| Maintenance | +1 to +5 | Shaving, minor errands |
| Standard | +5 to +15 | Typical habits, daily tasks |
| High Impact | +15 to +30 | Deep work, major health actions |
| Milestone | +100 to +1000 | Major life accomplishments |
| Negative | -0.5 to -5 | Self-sabotaging behaviors |

---

## 9. Morning Greeting Redesign

### Current State

- Completely static/hardcoded
- No way to edit the process
- Not connected to task list creation

### Proposed Purpose

The Morning Greeting is the **daily planning ritual** that:

1. Holds you accountable for yesterday
2. Sets intentions for today
3. Guides creation of today's task list
4. Populates the Dashboard

### Proposed Flow

```
1. RECITE INTENTION
   └── Daily prayer or affirmation (customizable)

2. YESTERDAY RECAP
   └── Accountability questions about previous day
   └── Review of evening protocol completion
   └── System shows: what was planned vs. completed

3. YESTERDAY SCORE
   └── Display PV earned yesterday
   └── Pillar breakdown
   └── Highlight: what went well, what was missed

4. TODAY'S PLAN
   └── Guided task list creation (see below)

5. CONFIRMATION
   └── Review today's plan
   └── Commit and launch into the day
```

### Guided Task List Creation

**Model: "Core 3 + Flex"**

| Tier | Description | Count |
|------|-------------|-------|
| **Core 3** | Non-negotiable priorities — if ONLY these get done, the day was a success | 3 |
| **Flex Tasks** | Important but adaptable — do if circumstances allow | 2-3 |
| **Protocols** | Recurring habits/routines — run in background | Unlimited |

**Key Principle:** Life happens. Hitting Core 3 = successful day. No guilt spiral.

### Editability

- User should be able to customize:
  - Morning prayer/affirmation text
  - Recap questions
  - Number of Core tasks
  - Which protocols are "active" for the day

---

## 10. Dashboard Redesign

### Elements to Keep

- Three pillar gauges (Love, Health, Freedom)
- Greeting with date ("Good morning, Architect")
- "Up Next" calendar integration
- Daily Total PV display

### Elements to Add

1. **Today's Task List**
   - Core 3 section (prominently displayed)
   - Flex Tasks section
   - Active Protocols section
   - Checkbox completion that updates gauges in real-time

2. **Progress Indicators**
   - PV earned so far today
   - Comparison to daily target
   - Pillar balance visual

3. **Quick Actions**
   - Add unexpected task
   - Log negative behavior
   - Mark protocol as skipped

### Elements to Remove or Rethink

- "Daily Focus TOP 3" per pillar (confusing; replaced by unified Core 3)
- "Available Protocols" cards (move to slide-out or modal)

### Design Principle

The Dashboard is a **HUD** — glanceable, not cluttered. You should be able to:

1. See your Core 3 immediately
2. See pillar balance at a glance
3. Check things off with one tap
4. Regain focus in under 5 seconds

---

## 11. Accountability Loop

### The Full Cycle

```
MORNING GREETING
     │
     ├── Reflect on yesterday
     ├── See what was planned vs. completed
     ├── Receive PV score for yesterday
     │
     ▼
SET TODAY'S INTENTIONS
     │
     ├── Define Core 3
     ├── Add Flex Tasks
     ├── Activate Protocols
     │
     ▼
EXECUTE (Throughout the day)
     │
     ├── Reference Dashboard
     ├── Check off completions
     ├── Gauges update in real-time
     │
     ▼
EVENING PROTOCOL
     │
     ├── Wind-down routine
     ├── Reflection on the day
     │
     ▼
NEXT MORNING → ACCOUNTABILITY
     │
     └── System knows what was planned
     └── System knows what was completed
     └── Shows the gap (if any)
```

### What "Accountability" Means

The system **compares intention vs. reality**:

- Yesterday you committed to X, Y, Z
- You actually completed X, Z
- This is shown to you in the Morning Greeting
- PV reflects actual completion, not intention

---

## 12. Outstanding Questions for Next Session

The following topics need further discussion and clarification:

### A. Morning Greeting — Guided Task Creation

1. **What guidance method works best?**
   - Pillar Balance Check ("Yesterday you scored low on Love...")
   - Consistency Nudges ("You haven't done X in 4 days...")
   - Structured Prompts ("What's the ONE thing...?")
   - Blank slate with smart suggestions
   - Combination?

2. **How are tasks added during Morning Greeting?**
   - Pick from Library?
   - Type fresh?
   - Voice input?

3. **What if you skip the Morning Greeting?**
   - Can you still use the Dashboard?
   - Does the system prompt you to complete it first?

### B. Dashboard — Detailed Design

1. **How should the task list be visually organized?**
   - Vertical list?
   - Cards?
   - Kanban-style columns?

2. **Should completed tasks disappear or stay visible (with checkmark)?**

3. **Where do Protocols appear vs. Tasks?**
   - Same list with visual distinction?
   - Separate sections?

4. **How do you handle a task you didn't complete?**
   - Roll to tomorrow?
   - Mark as skipped (negative PV)?
   - Just disappears?

### C. Evening Protocol

1. **What does the evening protocol include?**
2. **Is it a checklist? Reflection questions? Both?**
3. **Does it affect PV?**
4. **Is it required or optional?**

### D. Negative Behaviors

1. **How are negative behaviors logged?**
   - Automatically (e.g., Whoop sleep data)?
   - Manually (you admit you ate junk food)?
   - Both?

2. **Is there a "confession" mechanism in Morning Greeting?**

### E. Milestones

1. **How are milestones tracked?**
   - Separate section in Library?
   - Tied to specific long-term goals?

2. **What qualifies as a milestone vs. a high-value task?**

3. **Major milestones mentioned:**
   - Health: Achieve 175 lbs
   - Freedom: Launch CNA Packet
   - Love: (undefined — what belongs here?)

### F. Journal Integration

1. **What is the journal for?**
   - Capturing "Memorable Moments"?
   - Daily reflection?
   - Random thoughts?

2. **Does journaling earn PV?**

3. **How does it integrate with the Morning Greeting or Evening Protocol?**

### G. Annual Scoring

1. **What PV constitutes a Poor / Average / Good / Exceptional day?**
2. **What is the annual target for an Exceptional Year?**
3. **How do milestones factor into annual calculations?**

### H. Categories — Remaining Gaps

1. **What additional categories are needed?**
   - Home Maintenance / Repairs?
   - Subscription Management?
   - Travel / Vacation?
   - Others?

2. **Should there be sub-categories?**

### I. Data Persistence (Technical)

1. **What is the Firestore data structure?**
   - Collections: users, categories, tasks, protocols, history?
   - Document schema for each?

2. **Priority order for implementing persistence?**
   - Task completion → PV calculation → History?

---

## Summary

This document captures the foundational decisions made for AspirationArchitect v0.3:

- **Three Pillars** (Love, Health, Freedom) as interconnected dimensions
- **PV System** with weighted distribution via the Impact Connection Method
- **Category Library** that auto-assigns pillar weights and reasoning
- **Morning Greeting** as the daily planning ritual
- **Core 3 + Flex** model for task prioritization
- **Dashboard** as a glanceable HUD, not a cluttered list
- **Accountability Loop** connecting morning intentions to evening review

The next session should focus on resolving the outstanding questions in Section 12, with priority on:

1. Morning Greeting detailed flow
2. Dashboard visual design
3. Negative behavior logging
4. Annual PV targets

---

*Document prepared during planning session — January 9, 2026*
