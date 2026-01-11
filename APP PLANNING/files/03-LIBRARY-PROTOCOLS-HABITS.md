# Library, Protocols & Habits
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
> **This Document:** The Library is where Protocols, Habits, Tasks, and 
> Categories are defined and managed. This document covers the data 
> architecture and the Protocol Calibrator interface.

### Dependencies

| Depends On | Why |
|------------|-----|
| Category Library | Categories determine pillar distribution |
| Firestore: habits/ | Standalone habit storage |
| Firestore: protocols/ | Protocol definitions |
| Firestore: tasks/ | Saved task templates |
| Firestore: categories/ | Category definitions |

### Key Principles

- Habits are reusable building blocks — define once, use in multiple Protocols
- Protocols are containers that reference Habits
- Single source of truth — update a Habit once, reflected everywhere
- Low friction creation — inline creation without leaving current flow

---

## Data Architecture

### Hierarchy

```
CATEGORY
   └── Determines pillar distribution (L/H/F percentages)

HABIT (Standalone, reusable)
   └── References a Category
   └── Has: name, duration, value tier, icon, notes

PROTOCOL (Container)
   └── References multiple Habits
   └── Has: name, schedule, completion bonus, icon, time of day

TASK (Daily item)
   └── Can be from Library OR created fresh
   └── References a Category
```

### Database Relationships

```
categories/
   └── {categoryId}
          └── name, pillarDistribution, keywords, valueTier

habits/
   └── {habitId}
          └── name, categoryId (reference), duration, valueTier, icon, notes

protocols/
   └── {protocolId}
          └── name, habitIds[] (references), schedule, completionBonus, icon, timeOfDay, description

tasks/
   └── {taskId}
          └── name, categoryId (reference), duration, valueTier, isLibraryItem
```

---

## Habits

### Definition
A Habit is an individual recurring action that can be reused across multiple Protocols.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| name | String | What the action is (e.g., "Hydrate 16oz") |
| categoryId | Reference | Links to Category for pillar distribution |
| valueTier | Enum | Maintenance / Standard / High Impact |
| duration | Number | Default duration in minutes |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| notes | String | Personal context or instructions |
| icon | String | Visual identifier (icon name or emoji) |

### Duration Options

Preset buttons for selection:
```
[ 15m ] [ 30m ] [ 45m ] [ 1h ] [ 1.5h ] [ 2h ] [ 2h+ ]
```

### Habit Creation UI

```
┌─────────────────────────────────────────────────────────┐
│  CREATE HABIT                                           │
├─────────────────────────────────────────────────────────┤
│  Habit Name                                             │
│  [ Hydrate 16oz                              ]          │
│                                                         │
│  Category                                               │
│  [ 🔍 Nutrition / Meal Prep                ▼ ]          │
│                                                         │
│  Value Tier                                             │
│  [ Maintenance ▼ ]                                      │
│                                                         │
│  Default Duration                                       │
│  [ 15m ] [•30m•] [ 45m ] [ 1h ] [ 1.5h ] [ 2h ] [ 2h+ ]│
│                                                         │
│  Icon (optional)                                        │
│  [ 💧 ]                                                 │
│                                                         │
│  Notes (optional)                                       │
│  [ Drink full glass of water upon waking    ]          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              [ Cancel ]     [ Save Habit ]              │
└─────────────────────────────────────────────────────────┘
```

### PV Calculation Preview

Display calculated PV based on selections:
```
Estimated PV: 2 PV (Maintenance × 30m)
Distribution: Love 30% (0.6) • Health 60% (1.2) • Freedom 10% (0.2)
```

---

## Protocols

### Definition
A Protocol is a container that groups multiple Habits into a routine with a schedule.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| name | String | Protocol identifier (e.g., "Morning Protocol") |
| schedule | Object | When the protocol runs |
| habitIds | Array | References to Habits in this Protocol |
| completionBonus | Number | Bonus PV for completing all habits (default: 5) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| description | String | Personal context |
| icon | String | Visual identifier (e.g., ☀ ☽) |
| timeOfDay | Enum | Morning / Afternoon / Evening (for Dashboard auto-expand) |

### Schedule Options

#### Tier 1: One-Tap Presets

| Preset | Days |
|--------|------|
| Every day | All 7 days |
| Weekdays | Mon – Fri |
| Weekends | Sat – Sun |
| Custom days | User selects specific days |

#### Custom Days UI

```
[ M ] [ T ] [ W ] [ T ] [ F ] [ S ] [ S ]
  ✓    ✓     ✓     ✓     ✓    ○     ○
```

#### Tier 2: Advanced (Collapsed by Default)

| Option | Use Case |
|--------|----------|
| Every X days | "Water plants every 3 days" |
| Specific dates | "1st and 15th of month" |

### Protocol Creation UI

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE PROTOCOL                                            │
├─────────────────────────────────────────────────────────────┤
│  Protocol Name                                              │
│  [ Morning Protocol                          ]              │
│                                                             │
│  Description (optional)                                     │
│  [ Start the day with intention              ]              │
│                                                             │
│  Icon (optional)                                            │
│  [ ☀ ]                                                      │
│                                                             │
│  Time of Day                                                │
│  [•Morning•] [ Afternoon ] [ Evening ]                      │
│                                                             │
│  Schedule                                                   │
│  [•Every day•] [ Weekdays ] [ Weekends ] [ Custom ]         │
│                                                             │
│  Completion Bonus                                           │
│  [ +5 ] PV                                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  HABITS IN THIS PROTOCOL                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 💧 Hydrate 16oz        Nutrition     15m    2 PV   ✕  │ │
│  │ 🛏 Make bed            Maintenance    5m    1 PV   ✕  │ │
│  │ 🧘 Stretch             Exercise      10m    3 PV   ✕  │ │
│  │ 📅 Review calendar     Admin          5m    1 PV   ✕  │ │
│  │ 🙏 Morning Prayer      Spiritual     10m    3 PV   ✕  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  [ 🔍 Search existing habits... ]  [ + Create New Habit ]   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PROTOCOL SUMMARY                                           │
│  Total Habits: 5                                            │
│  Habit PV: ~10 PV                                           │
│  Completion Bonus: +5 PV                                    │
│  Protocol Total: ~15 PV                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              [ Cancel ]     [ Save Protocol ]               │
└─────────────────────────────────────────────────────────────┘
```

### Adding Habits to Protocol

| Method | Description |
|--------|-------------|
| Search existing | Autocomplete from Habits collection |
| Create new | Opens inline Habit creation form |

### Inline Habit Creation

When "+ Create New Habit" is clicked within Protocol editor:
1. Habit creation form appears inline (or modal)
2. New Habit is saved to habits/ collection
3. Habit is automatically added to current Protocol
4. Habit is available for reuse in other Protocols

---

## Protocol PV Calculation

### Formula

```
Protocol Total PV = (Sum of Habit PVs) + (Completion Bonus if 100%)
```

### Habit PV + Completion Bonus Model

| Component | When Awarded |
|-----------|--------------|
| Individual Habit PV | When each habit is checked off |
| Completion Bonus | When ALL habits in Protocol are complete |

### Example

Morning Protocol with 5 habits:
- Habit 1: 2 PV (completed)
- Habit 2: 1 PV (completed)
- Habit 3: 3 PV (completed)
- Habit 4: 1 PV (completed)
- Habit 5: 3 PV (NOT completed)
- Completion Bonus: 5 PV

**Earned:** 2 + 1 + 3 + 1 = 7 PV (no bonus because not 100%)

If Habit 5 is completed:
**Earned:** 7 + 3 + 5 = 15 PV (bonus awarded)

---

## Tasks (Task Library)

### Definition
Tasks are items that can be saved to the Library for quick reuse during Plan Today.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| name | String | Task description |
| categoryId | Reference | Links to Category |
| duration | Number | Default duration in minutes |
| valueTier | Enum | Inherited from Category or overridden |
| isLibraryItem | Boolean | True if saved to Library |

### Task Creation Flow

```
User types in Plan Today
         │
         ├── Match found → Select from autocomplete
         │                       │
         │                       └── Pre-fills category, duration, valueTier
         │
         └── No match → Create new task
                              │
                              ├── Enter name
                              ├── Select category (keyword autocomplete)
                              ├── Select duration (preset buttons)
                              └── Option: "Save to Library" checkbox
```

### Common Tasks

Pre-populated examples for quick selection:
- Get a haircut
- Wash the car
- Go grocery shopping
- Water the plants
- Take out trash
- Pay bills
- Schedule appointment

---

## Category Selection

### Dropdown Order

Categories grouped by primary pillar (Love → Health → Freedom):

**Love-Primary (60% Love):**
- Spiritual / Prayer
- Relationship / Quality Time
- Family / Household
- Travel / Vacation
- Volunteering / Service

**Health-Primary (60% Health):**
- Exercise / Fitness
- Nutrition / Meal Prep
- Sleep / Recovery
- Rest / Leisure
- Personal Care / Grooming
- Medical / Appointments

**Freedom-Primary (60% Freedom):**
- Deep Work (Career/Projects)
- Finance / Budgeting
- Creative Work / Side Hustle
- Learning / Skill Building
- Home Maintenance / Repairs
- Auto Maintenance / Repairs

**Balanced:**
- Admin / Errands

**Negative:**
- Negative: Poor Sleep
- Negative: Junk Food
- Negative: Skipped Protocol

### Keyword Auto-Suggest

Each category has hidden keyword tags for type-to-filter:

| Category | Keywords |
|----------|----------|
| Exercise / Fitness | gym, workout, treadmill, run, jog, lift, weights, cardio, yoga, stretch |
| Personal Care / Grooming | haircut, shave, shower, grooming, nails |
| Rest / Leisure | golf, relax, hobby, game, nap, movie, tv |
| Auto Maintenance / Repairs | oil change, car wash, tire, mechanic, inspection |

---

## Library Page Structure

### Navigation Tabs

```
[ Protocols ] [ Habits ] [ Tasks ] [ Categories ]
```

### Protocols Tab

| Display | Actions |
|---------|---------|
| List of all Protocols | Create, Edit, Delete |
| Shows: name, schedule, habit count, total PV | |

### Habits Tab

| Display | Actions |
|---------|---------|
| List of all Habits | Create, Edit, Delete |
| Shows: name, category, duration, PV | |
| Indicator: "Used in X Protocols" | |

### Tasks Tab

| Display | Actions |
|---------|---------|
| List of saved Task templates | Create, Edit, Delete |
| Shows: name, category, duration | |

### Categories Tab

| Display | Actions |
|---------|---------|
| List of all Categories | View (system categories read-only) |
| Shows: name, pillar distribution | Create custom (future) |

---

## Firestore Schema

### Habits Collection

```javascript
// habits/{habitId}
{
	id: "habit-001",
	name: "Hydrate 16oz",
	categoryId: "cat-nutrition",
	valueTier: "maintenance", // maintenance | standard | high-impact
	duration: 15, // minutes
	icon: "💧",
	notes: "Drink full glass of water upon waking",
	createdAt: "01-11-2026",
	updatedAt: "01-11-2026"
}
```

### Protocols Collection

```javascript
// protocols/{protocolId}
{
	id: "protocol-morning",
	name: "Morning Protocol",
	description: "Start the day with intention",
	icon: "☀",
	timeOfDay: "morning", // morning | afternoon | evening
	schedule: {
		type: "daily", // daily | weekdays | weekends | custom | advanced
		days: [0, 1, 2, 3, 4, 5, 6], // 0=Sun, 1=Mon, etc.
		// For advanced:
		// intervalDays: 3, // every X days
		// specificDates: ["01", "15"] // day of month
	},
	habitIds: ["habit-001", "habit-002", "habit-003"],
	completionBonus: 5,
	createdAt: "01-11-2026",
	updatedAt: "01-11-2026"
}
```

### Tasks Collection

```javascript
// tasks/{taskId}
{
	id: "task-001",
	name: "Get a haircut",
	categoryId: "cat-personal-care",
	duration: 30,
	valueTier: "maintenance",
	isLibraryItem: true,
	createdAt: "01-11-2026",
	updatedAt: "01-11-2026"
}
```

---

## Editing and Deleting

### Edit Behavior

| Item | Edit Behavior |
|------|---------------|
| Habit | Changes reflect in all Protocols using it |
| Protocol | Changes apply to future days, not historical |
| Task | Changes apply to future use |

### Delete Behavior

| Item | Delete Behavior |
|------|-----------------|
| Habit | Warning if used in Protocols; removes from Protocols |
| Protocol | Confirmation required; historical data preserved |
| Task | Confirmation required |

### Delete Confirmation

```
┌─────────────────────────────────────────┐
│  ⚠️ Delete Habit?                       │
│                                         │
│  "Hydrate 16oz" is used in 2 Protocols: │
│  • Morning Protocol                     │
│  • Afternoon Protocol                   │
│                                         │
│  Deleting will remove it from these     │
│  Protocols. Historical data will be     │
│  preserved.                             │
│                                         │
│  [ Cancel ]     [ Delete Anyway ]       │
└─────────────────────────────────────────┘
```

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
