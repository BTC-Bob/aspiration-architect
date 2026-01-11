# Morning Greeting
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
> **This Document:** The Morning Greeting is the daily planning ritual that 
> establishes mindset, captures physiology, enforces accountability, and 
> populates the Dashboard with the day's tasks and protocols.

### Dependencies

| Depends On | Why |
|------------|-----|
| Google Calendar API | Timeline view in Plan Today step |
| Protocol Library | Scheduled protocols auto-appear |
| Task Library | Autocomplete for task entry |
| Category Library | PV calculation for new tasks |
| Firestore: dailyLogs | Stores all Morning Greeting data |
| Firestore: morningGreeting/config | Stores configurable elements |

### Key Principles

- Low friction — should feel like writing on a notepad
- Configurable — user can edit prayer, metrics, questions, steps
- Resumable — re-entry preserves previous inputs, never resets

---

## Overview

The Morning Greeting is a 5-step daily ritual that:
1. Aligns mindset through prayer/affirmation
2. Captures physiological baselines
3. Enforces accountability for yesterday's behaviors
4. Plans today's tasks with calendar awareness
5. Launches into the Dashboard ready to execute

---

## Step Flow

```
Step 1: PRAYER
    │
    ▼
Step 2: PHYSIOLOGY CHECK
    │
    ▼
Step 3: ACCOUNTABILITY
    │
    ▼
Step 4: PLAN TODAY
    │
    ▼
Step 5: LAUNCH DASHBOARD
```

---

## Step 1: Prayer

### Purpose
Establish mindset alignment at the start of the day through a customizable affirmation.

### UI Elements

| Element | Description |
|---------|-------------|
| Header | "THE ARCHITECT'S IGNITION" (or customizable) |
| Title | "Morning Prayer" |
| Prayer text | User-customizable, supports **bold** formatting on selected words |
| Button | "I AM ALIGNED →" |

### Configurability

| Element | Editable |
|---------|----------|
| Prayer text content | Yes — via Settings |
| Bold formatting | Yes — user can bold selected words |
| Button label | No — fixed |

### Data Stored

```javascript
{
	prayerCompleted: true,
	completedAt: "HH:MM AM/PM"
}
```

---

## Step 2: Physiology Check

### Purpose
Capture daily physiological baselines for health tracking.

### Default Metrics

| Metric | Label | Input Type | Unit |
|--------|-------|------------|------|
| Sleep score | "WHOOP SLEEP SCORE" | Number input | % |
| Weight | "MORNING WEIGHT" | Number input | lbs |

### UI Elements

| Element | Description |
|---------|-------------|
| Header icon | Activity/health icon |
| Title | "Physiology Check" |
| Metric inputs | Configurable list of metrics |
| Button | "Next Phase →" |

### Configurability

| Action | Available |
|--------|-----------|
| Add new metric | Yes |
| Remove existing metric | Yes |
| Edit metric label | Yes |
| Reorder metrics | Yes |

### Data Stored

```javascript
{
	physiology: {
		sleepScore: 82,
		weight: 183.5,
		// ... additional user-configured metrics
	},
	completedAt: "HH:MM AM/PM"
}
```

---

## Step 3: Accountability

### Purpose
Enforce integrity by reviewing yesterday's commitments and behaviors.

### UI Elements

| Element | Description |
|---------|-------------|
| Header icon | Shield/integrity icon |
| Title | "Vitality & Integrity" |
| Questions | List of Yes/No accountability questions |
| Button | "Next Phase →" |

### Question Structure

Each question includes:

| Field | Description |
|-------|-------------|
| Title | Short name (e.g., "Digital Sunset") |
| Description | Full question text (e.g., "Did you execute the Shutdown Protocol last night?") |
| Response | YES / NO buttons |
| Linked Category | Optional — ties to negative category for PV penalty |
| Linked Protocol | Optional — only shows if Protocol is active |

### Negative PV Behavior

When user answers "NO":
- System applies negative PV from linked category
- PV is applied to **yesterday's** score
- Distribution follows category's pillar percentages

### Configurability

| Action | Available | Notes |
|--------|-----------|-------|
| Add new question | Yes | |
| Edit question title/description | Yes | |
| Delete question | Yes | With confirmation: "Are you sure?" |
| Link to negative category | Yes | For automatic PV penalty |
| Link to Protocol | Yes | Question only appears if Protocol is active |

### Data Stored

```javascript
{
	accountability: [
		{
			questionId: "q1",
			title: "Digital Sunset",
			response: true,
			negativePvApplied: 0
		},
		{
			questionId: "q2",
			title: "PureView Integrity Check",
			response: false,
			negativePvApplied: -5,
			linkedCategory: "negative-integrity"
		}
	],
	completedAt: "HH:MM AM/PM"
}
```

---

## Step 4: Plan Today

### Purpose
Define the day's work with awareness of calendar constraints.

### UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  PLAN YOUR DAY                                          MM-DD-YYYY  │
├─────────────────────────────────────────────────────────────────────┤
│  YOUR DAY AT A GLANCE                                               │
│  6AM ━━━━━━|██ Dentist 2-3p ██|━━━━|██ Dinner 6-8p ██|━━━━━━ 10PM   │
│            📍 Main St Dental          📍 Mom's house                 │
│                                                                      │
│  Available: 5.5 hrs │ Committed: 0 hrs │ Remaining: 5.5 hrs         │
├─────────────────────────────────────────────────────────────────────┤
│  ⟳ ROLLED OVER FROM YESTERDAY                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ☐ Call insurance (30m)           [Add to Today] [Remove]       │ │
│  └────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                                        │                            │
│  ★ CORE 3                              │  TODAY'S PROTOCOLS         │
│  ┌──────────────────────────────────┐  │  ┌──────────────────────┐  │
│  │ 🔍 Type to search or add task... │  │  │ ☑ ☀ Morning Protocol │  │
│  └──────────────────────────────────┘  │  │ ☑ ☽ Evening Protocol │  │
│    1. ______________________________   │  └──────────────────────┘  │
│    2. ______________________________   │                            │
│    3. ______________________________   │  ⏱ PROTOCOL TIME           │
│                                        │    4.5 hrs committed       │
│  ✚ FLEX TASKS                          │                            │
│  ┌──────────────────────────────────┐  │  ⚠ TIME CHECK              │
│  │ 🔍 Add flex task...              │  │    Committed: X hrs        │
│  └──────────────────────────────────┘  │    Available: Y hrs        │
│                                        │                            │
├─────────────────────────────────────────────────────────────────────┤
│                        [ LAUNCH DASHBOARD → ]                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Components

#### Calendar Timeline

| Feature | Description |
|---------|-------------|
| Time range | 6 AM – 10 PM (waking hours) |
| Event display | Visual blocks with title, time, location |
| Location | Shown below event for travel time awareness |
| Travel buffer | Manual — tap event to add buffer (v0.3). Auto-calculate in v0.4+ |

#### Rolled Over Tasks

| Feature | Description |
|---------|-------------|
| Display | Separate section above Core 3 |
| Source | Incomplete tasks from yesterday |
| Actions | [Add to Today] or [Remove] |
| Remove prompt | Optional: "Quick note — why didn't this happen?" |
| Note destination | Flows to yesterday's Journal entry |

#### Core 3 Tasks

| Feature | Description |
|---------|-------------|
| Default count | 3 (configurable in Settings) |
| Adjustable | Can reduce to 2 or add more for current day |
| Input | Smart search field with autocomplete |
| Autocomplete source | Task Library |
| New task flow | If not found → prompt to save to Library |

#### Task Input — Smart Search

| Behavior | Description |
|----------|-------------|
| Type text | Autocomplete shows matching Library tasks |
| Select match | Pre-fills category, duration, value tier |
| No match | Option to create new task |
| New task fields | Name, Category (dropdown with keyword search), Duration (preset buttons) |
| Save option | "Save to Library for future use" checkbox |

#### Duration Preset Buttons

```
[ 15m ] [ 30m ] [ 45m ] [ 1h ] [ 1.5h ] [ 2h ] [ 2h+ ]
```

#### Flex Tasks

| Feature | Description |
|---------|-------------|
| Purpose | Important but adaptable — do if circumstances allow |
| Count | Unlimited |
| Input | Same smart search as Core 3 |

#### Today's Protocols

| Feature | Description |
|---------|-------------|
| Display | Pre-selected based on schedule |
| Schedule types | Daily, Weekdays, Weekends, Custom days, Advanced |
| Pre-checked | Protocols scheduled for today appear checked |
| Toggle | Can deactivate Protocol for today if needed |
| Time display | Shows total time commitment |

#### Time Check

| Feature | Description |
|---------|-------------|
| Available | Total waking hours minus calendar events |
| Committed | Sum of Core 3 + Flex + Protocol durations |
| Remaining | Available minus Committed |
| Warning | Alerts if Committed exceeds Available |

### Configurability

| Element | Editable |
|---------|----------|
| Default Core task count | Yes — via Settings |
| Core count for current day | Yes — can adjust during planning |

### Data Stored

```javascript
{
	plannedTasks: {
		core: [
			{
				taskId: "task-001",
				name: "Deep work on App",
				category: "deep-work",
				duration: 120,
				valueTier: "high-impact",
				status: "planned"
			}
			// ... up to 3 (or adjusted)
		],
		flex: [
			// Same structure as core
		]
	},
	activeProtocols: ["protocol-morning", "protocol-evening"],
	calendarEvents: [
		{
			title: "Dentist",
			start: "02:00 PM",
			end: "03:00 PM",
			location: "Main St Dental",
			travelBuffer: 30
		}
	],
	timeCalculation: {
		available: 330, // minutes
		committed: 270,
		remaining: 60
	},
	completedAt: "HH:MM AM/PM"
}
```

---

## Step 5: Launch Dashboard

### Purpose
Transition from planning to execution.

### Behavior

| Action | Result |
|--------|--------|
| Tap "LAUNCH DASHBOARD" | Navigate to Dashboard |
| Dashboard state | Populated with planned Core 3, Flex, and active Protocols |
| Morning Greeting status | Marked complete for the day |

---

## Navigation

### Step Indicator

```
①──②──③──④──⑤
✓   ✓   ✓   ◯   ◯
```

| Feature | Description |
|---------|-------------|
| Display | Top of screen, shows all 5 steps |
| Status | ✓ for complete, ◯ for incomplete |
| Interaction | Tap any step to jump directly |

### Linear Buttons

```
[ ← Back ]    [ Skip ]    [ Next → ]
```

| Button | Behavior |
|--------|----------|
| Back | Return to previous step |
| Skip | Advance without changing current step data |
| Next | Confirm current step and advance |

---

## Re-entry Behavior

### Icon Location
Small icon next to "Good morning, Architect" greeting on Dashboard.

### Re-entry Flow

| Aspect | Behavior |
|--------|----------|
| Starting point | Always Step 1 (Prayer) |
| Data preservation | Previously entered data pre-filled, never reset |
| Navigation | Can tap through to review OR jump via step indicator |
| Editing | Can modify any previously entered data |

---

## Morning Greeting Skip Behavior

### If User Skips Morning Greeting

| Behavior | Description |
|----------|-------------|
| Dashboard access | Allowed — not locked behind Morning Greeting |
| Dashboard state | Empty task list with prompt: "Start your day with intention — [Begin Morning Greeting]" |
| Indicator | "Unplanned day" visual indicator |
| Re-entry | Morning Greeting icon always available |

---

## Firestore Structure

```javascript
// morningGreeting/config (user configuration)
{
	prayer: {
		text: "As the new day begins, I **embrace** the opportunity...",
		boldWords: ["embrace", "design", "fulfilling", ...]
	},
	physiologyMetrics: [
		{ id: "sleep", label: "WHOOP SLEEP SCORE", unit: "%" },
		{ id: "weight", label: "MORNING WEIGHT", unit: "lbs" }
	],
	accountabilityQuestions: [
		{
			id: "q1",
			title: "Digital Sunset",
			description: "Did you execute the Shutdown Protocol last night?",
			linkedCategory: null,
			linkedProtocol: "protocol-evening"
		},
		{
			id: "q2",
			title: "PureView Integrity Check",
			description: "Did you maintain wholesome visual standards yesterday?",
			linkedCategory: "negative-integrity",
			linkedProtocol: null
		}
	],
	defaultCoreTaskCount: 3
}

// dailyLogs/{MM-DD-YYYY} (daily data)
{
	morningGreeting: {
		prayerCompleted: true,
		physiology: { sleepScore: 82, weight: 183.5 },
		accountability: [...],
		plannedTasks: { core: [...], flex: [...] },
		activeProtocols: [...],
		completedAt: "07:15 AM"
	}
}
```

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
