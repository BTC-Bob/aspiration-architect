# Dashboard
## AspirationArchitect v0.3 Specification

### Context
> **App:** AspirationArchitect — A personal life management app built around 
> three pillars: Love, Health, and Freedom (in that order).
>
> **User:** Single user ("Architect") seeking structure, accountability, 
> and intentional living.
>
> **Tech Stack:** React 18 + Vite, Tailwind CSS, Firebase Auth, 
> Cloud Firestore, PWA
>
> **This Document:** The Dashboard is the command center where the user 
> executes their daily plan. It displays Core 3 tasks, Flex tasks, Protocols, 
> pillar gauges, and calendar events in a glanceable HUD format.

### Dependencies

| Depends On | Why |
|------------|-----|
| Morning Greeting | Populates planned tasks and active protocols |
| Category Library | PV distribution for completed tasks |
| Protocol Library | Protocol habits and completion bonuses |
| Google Calendar | Up Next event display |
| Firestore: dailyLogs | Reads/writes task completion status |

### Key Principles

- HUD design — glanceable, not cluttered
- Visual weight equals priority — Core 3 dominates
- Real-time updates — gauges animate on task completion
- No scrolling required — everything visible in viewport (desktop)

---

## Layout Structure

### Design Philosophy

The Dashboard uses a **60/40 split** layout based on HUD design principles:
- **Left column (60%):** Core 3 tasks — highest visual weight
- **Right column (40%):** Protocols + Flex tasks — visible but secondary

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Good morning, Architect    Day 11 • 01-11-2026   [UP NEXT 2pm]   35/75 │
│ ═══════════════════════════════════════════════════════════════════════│
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│ │   LOVE & FAMILY  │  │   HEALTH & BODY  │  │ FREEDOM & FINANCE│       │
│ │        12        │  │        18        │  │         9        │       │
│ └──────────────────┘  └──────────────────┘  └──────────────────┘       │
├────────────────────────────────────┬────────────────────────────────────┤
│                                    │                                    │
│  ★ CORE 3                          │  PROTOCOLS                         │
│  ┌──────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │ ☐ Deep work on App      2h   │  │  │ ☀ Morning      ██████░░  6/7 │  │
│  │   Freedom 60% • 20 PV        │  │  │ ☽ Evening      ░░░░░░░░  0/5 │  │
│  └──────────────────────────────┘  │  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │                                    │
│  │ ☐ Gym / Treadmill       1h   │  │  FLEX TASKS                        │
│  │   Health 60% • 10 PV         │  │  ┌──────────────────────────────┐  │
│  └──────────────────────────────┘  │  │ ☐ Grocery shopping       30m │  │
│  ┌──────────────────────────────┐  │  │ ☐ Water plants           15m │  │
│  │ ☐ Call insurance       30m   │  │  │ ☐ Reply to emails        15m │  │
│  │   Admin 40% • 5 PV           │  │  └──────────────────────────────┘  │
│  └──────────────────────────────┘  │                                    │
│                                    │                                    │
│  ── COMPLETED ──────────────────   │                                    │
│  ┌──────────────────────────────┐  │                                    │
│  │ ✓ Morning routine       45m  │  │                                    │
│  └──────────────────────────────┘  │                                    │
│                                    │                                    │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

## Header Section

### Elements

| Element | Position | Description |
|---------|----------|-------------|
| Greeting | Top left | "Good morning, Architect" (time-aware) |
| Day count | Top left | "Day 11" — day of the year |
| Date | Top left | "01-11-2026" (MM-DD-YYYY format) |
| Morning Greeting icon | Next to greeting | Re-opens Morning Greeting |
| Up Next | Top right | Next calendar event with time |
| Daily Total PV | Top right | Current PV / Target PV (e.g., "35/75") |

### Time-Aware Greeting

| Time Range | Greeting |
|------------|----------|
| 5:00 AM – 11:59 AM | "Good morning, Architect" |
| 12:00 PM – 4:59 PM | "Good afternoon, Architect" |
| 5:00 PM – 9:59 PM | "Good evening, Architect" |
| 10:00 PM – 4:59 AM | "Burning late, Architect" |

---

## Pillar Gauges

### Layout
Three gauges spanning full width, side by side.

### Gauge Design

| Element | Description |
|---------|-------------|
| Arc | Semi-circular gauge showing PV progress |
| Color | Pillar-specific (#ef4444 / #06b6d4 / #f59e0b) |
| Value | Current PV earned for that pillar today |
| Label | "LOVE & FAMILY" / "HEALTH & BODY" / "FREEDOM & FINANCE" |
| Sublabel | "Status" |

### Gauge Behavior

| Event | Behavior |
|-------|----------|
| Task completed | Gauge animates, value increments |
| Page load | Shows current day's accumulated PV |
| New day | Resets to 0 |

---

## Core 3 Section (Left Column — 60%)

### Purpose
Display the three non-negotiable priorities for the day.

### Task Card Design

```
┌──────────────────────────────────┐
│ ☐ Deep work on App          2h   │
│   Freedom 60% • 20 PV            │
└──────────────────────────────────┘
```

| Element | Description |
|---------|-------------|
| Checkbox | Tap to complete |
| Task name | Primary text |
| Duration | Right-aligned |
| Pillar indicator | Dominant pillar percentage |
| PV value | Points earned on completion |

### Task States

| State | Visual |
|-------|--------|
| Planned | Normal appearance, checkbox empty |
| Completed | Moves to "Completed" section at bottom |
| Overdue | Optional visual indicator (future enhancement) |

---

## Protocols Section (Right Column — Top)

### Purpose
Display scheduled protocols with completion progress.

### Desktop Behavior (Time-Aware Auto-Expand)

| Time of Day | Behavior |
|-------------|----------|
| 6 AM – 12 PM | Morning Protocol expanded, others collapsed |
| 12 PM – 6 PM | All collapsed (task execution mode) |
| 6 PM onward | Evening Protocol expanded, others collapsed |

### Manual Override
User can click collapse/expand arrow (▼/▲) to toggle any Protocol.

### Auto-Collapse
Protocols auto-collapse when 100% complete.

### Expanded Protocol Display

```
☀ Morning Protocol          ██████░░ 6/7
   ☑ Make bed
   ☑ Hydrate (16oz)
   ☑ Stretch (10 min)
   ☑ Review calendar
   ☑ Morning Prayer
   ☑ Physiology check
   ☐ Journal entry
```

### Collapsed Protocol Display

```
☀ Morning Protocol          ██████░░ 6/7  ▼
```

### Mobile Behavior

| State | Display |
|-------|---------|
| Default | Compact cards showing name + progress bar |
| On tap | Slide-out panel from bottom with full habit list |

### Mobile Slide-Out Panel

```
┌─────────────────────────┐
│ ☀ Morning Protocol      │
│ ─────────────────────── │
│ ☑ Make bed              │
│ ☑ Hydrate (16oz)        │
│ ☑ Stretch (10 min)      │
│ ☑ Review calendar       │
│ ☑ Morning Prayer        │
│ ☑ Physiology check      │
│ ☐ Journal entry         │
│                         │
│      [ Done ]           │
└─────────────────────────┘
```

---

## Flex Tasks Section (Right Column — Bottom)

### Purpose
Display secondary tasks that are important but adaptable.

### Design
Compact checklist format — lower visual weight than Core 3.

```
FLEX TASKS
┌──────────────────────────────┐
│ ☐ Grocery shopping       30m │
│ ☐ Water plants           15m │
│ ☐ Reply to emails        15m │
└──────────────────────────────┘
```

### Behavior
- Same completion behavior as Core 3
- No guilt pressure — visual design signals "optional"

---

## Completed Section

### Location
Bottom of left column (Core 3 area).

### Behavior

| Event | Result |
|-------|--------|
| Task completed | Task moves from active list to Completed section |
| Visual | Checkmark, possibly faded or struck through |
| Persistence | Remains visible for the day |

---

## Task Completion Behavior

### On Checkbox Tap

| Step | Action |
|------|--------|
| 1 | Task moves to "Completed" section |
| 2 | PV calculated: (Value Tier Rate) × (Duration ÷ 30) |
| 3 | PV distributed to pillars based on category |
| 4 | Pillar gauges animate and update |
| 5 | Daily Total PV increments |
| 6 | Task auto-captured to Journal with PV details |
| 7 | Data persisted to Firestore |

### Protocol Habit Completion

| Step | Action |
|------|--------|
| 1 | Habit checkbox tapped |
| 2 | Progress bar updates (e.g., 6/7 → 7/7) |
| 3 | Habit PV awarded |
| 4 | If 100% complete → Completion bonus PV awarded |
| 5 | If 100% complete → Protocol auto-collapses |
| 6 | Pillar gauges update |

---

## Incomplete Task Handling

### End of Day Behavior

| Behavior | Description |
|----------|-------------|
| Incomplete tasks | Auto-roll to next day's Plan Today step |
| Display | Shown in "Rolled Over from Yesterday" section |
| User options | [Add to Today] or [Remove] |
| Remove prompt | Optional note: "Quick note — why didn't this happen?" |

---

## Quick Actions

### Purpose
Allow adding unexpected items or logging negative behaviors.

### Available Actions

| Action | Description |
|--------|-------------|
| Add task | Quick-add a task not planned in Morning Greeting |
| Log negative | Record a negative behavior (applies negative PV) |

### Implementation
Small "+" button or action menu in appropriate section.

---

## Responsive Design

### Breakpoints

| Device | Layout |
|--------|--------|
| Desktop (1024px+) | Full 60/40 split, all content visible |
| Tablet (768px–1023px) | Condensed 60/40, smaller cards |
| Mobile (<768px) | Stacked layout, Protocols use slide-out panels |

### Mobile Layout

```
┌─────────────────────────┐
│ Good morning, Architect │
│ Day 11 • 01-11-2026     │
│ [UP NEXT 2pm]   35/75   │
├─────────────────────────┤
│ [LOVE] [HEALTH] [FREE]  │
│   12      18       9    │
├─────────────────────────┤
│ ★ CORE 3                │
│ ☐ Deep work...     2h   │
│ ☐ Gym...           1h   │
│ ☐ Call...         30m   │
├─────────────────────────┤
│ PROTOCOLS               │
│ ☀ Morning   ████░ 6/7   │
│ ☽ Evening   ░░░░ 0/5    │
├─────────────────────────┤
│ FLEX TASKS              │
│ ☐ Grocery...       30m  │
│ ☐ Water plants     15m  │
└─────────────────────────┘
```

---

## Data Structure

### Daily Log Entry

```javascript
// dailyLogs/{MM-DD-YYYY}
{
	plannedTasks: {
		core: [
			{
				taskId: "task-001",
				name: "Deep work on App",
				category: "deep-work",
				duration: 120,
				valueTier: "high-impact",
				status: "completed", // planned | completed | rolled
				completedAt: "10:30 AM",
				pvEarned: 20,
				pillarDistribution: { love: 6, health: 2, freedom: 12 }
			}
		],
		flex: [...]
	},
	protocolProgress: [
		{
			protocolId: "protocol-morning",
			habitsCompleted: ["habit-001", "habit-002", ...],
			totalHabits: 7,
			completionBonus: 5, // awarded when 100%
			isComplete: true
		}
	],
	pvEarned: {
		total: 35,
		love: 12,
		health: 18,
		freedom: 9
	},
	completedTasks: [...] // For display in Completed section
}
```

---

## Real-Time Sync

### Firestore Listeners

| Data | Listener Type |
|------|---------------|
| Task completion | Real-time update |
| PV totals | Real-time update |
| Protocol progress | Real-time update |

### Optimistic Updates
UI updates immediately on action, syncs to Firestore in background.

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
