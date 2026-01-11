# Journal
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
> **This Document:** The Journal is a living record that automatically 
> captures daily activity while also allowing intentional reflection. 
> It integrates with task completion, supports manual entries, and 
> includes privacy protection for sensitive content.

### Dependencies

| Depends On | Why |
|------------|-----|
| Dashboard | Task completion triggers auto-capture |
| Morning Greeting | Rolled-over task removal prompts note capture |
| Vault | Journal entries displayed in Daily Log view |
| Firestore: dailyLogs | Journal entries stored per day |

### Key Principles

- Dual functionality — automatic capture AND intentional journaling
- Full context — tasks captured with PV details and pillar distribution
- Privacy protection — per-entry PIN lock for sensitive content
- Seamless integration — notes can be added at any point

---

## Journal Functionality

### Two Modes

| Mode | Description |
|------|-------------|
| Auto-Capture | Tasks automatically recorded with full context when completed |
| Manual Entry | User-initiated free-form journaling at any time |

---

## Auto-Capture

### What Gets Captured

When a task is completed on the Dashboard, the following is automatically recorded:

| Field | Example |
|-------|---------|
| Task name | "Deep work on App" |
| Duration | 2h |
| PV earned | +20 PV |
| Pillar distribution | Freedom 60% (+12) • Love 30% (+6) • Health 10% (+2) |
| Completion time | 10:30 AM |
| Notes | (empty until user adds) |

### Auto-Capture Display Format

```
┌─────────────────────────────────────────────────────────────────┐
│  01-11-2026                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Deep work on App (2h) — +20 PV                    10:30 AM   │
│    Freedom 60% (+12) • Love 30% (+6) • Health 10% (+2)          │
│    [ + Add note ]                                               │
│                                                                 │
│  ✓ Gym / Treadmill (1h) — +10 PV                     02:15 PM   │
│    Health 60% (+6) • Freedom 30% (+3) • Love 10% (+1)           │
│    💬 "Felt strong today, increased speed to 6.5 mph"           │
│                                                                 │
│  ✓ Call insurance (30m) — +5 PV                      04:00 PM   │
│    Admin: Love 40% (+2) • Freedom 40% (+2) • Health 20% (+1)    │
│    [ + Add note ]                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Adding Notes to Entries

### Where Notes Can Be Added

| Location | Method |
|----------|--------|
| Journal view | Primary — dedicated reflection space |
| Plan Today (rolled-over tasks) | When removing incomplete task: "Quick note — why didn't this happen?" |

### Journal View Note Adding

1. Navigate to Journal page
2. Find the task entry
3. Tap "+ Add note"
4. Text field expands
5. Type note and save

### Note Display

```
✓ Gym / Treadmill (1h) — +10 PV                     02:15 PM
  Health 60% (+6) • Freedom 30% (+3) • Love 10% (+1)
  💬 "Felt strong today, increased speed to 6.5 mph"
     [ Edit ] [ Delete ]
```

---

## Manual Journal Entries

### Purpose
Free-form journaling for thoughts, reflections, and moments not tied to specific tasks.

### Entry Types

| Type | Description |
|------|-------------|
| Thought | General reflection or observation |
| Evening reflection | End-of-day processing (optional prompt) |
| Memorable Moment | Significant experience to preserve |

### Manual Entry Creation

```
┌─────────────────────────────────────────────────────────────────┐
│  NEW JOURNAL ENTRY                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ Write your thoughts...                                    ]  │
│  [                                                           ]  │
│  [                                                           ]  │
│                                                                 │
│  ☐ Mark as Memorable Moment                                     │
│  ☐ 🔒 Make Private (requires PIN to view)                       │
│                                                                 │
│              [ Cancel ]     [ Save Entry ]                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Incomplete Task Notes

### When Captured

During Plan Today step, when user removes a rolled-over task:

```
⟳ ROLLED OVER FROM YESTERDAY
┌────────────────────────────────────────────────────────────────┐
│ ☐ Call insurance (30m)           [Add to Today] [Remove]       │
└────────────────────────────────────────────────────────────────┘
```

On [Remove] tap:

```
┌─────────────────────────────────────────────────────────────────┐
│  Why didn't this happen? (optional)                             │
├─────────────────────────────────────────────────────────────────┤
│  [ Got busy with other priorities                            ]  │
│                                                                 │
│              [ Skip ]     [ Save Note ]                         │
└─────────────────────────────────────────────────────────────────┘
```

### Where Note Is Stored

The note flows to **yesterday's** Journal entry under the incomplete task:

```
01-10-2026 (Yesterday)

✗ Call insurance (30m) — Not completed
  ❌ "Got busy with other priorities"
```

---

## Evening Reflection (Optional)

### Purpose
Optional end-of-day prompt for processing the day.

### Trigger
Time-based — appears after 8 PM if user opens Journal.

### Prompt

```
┌─────────────────────────────────────────────────────────────────┐
│  Evening Reflection                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  How did today go?                                              │
│                                                                 │
│  [ Write your reflection...                                  ]  │
│  [                                                           ]  │
│                                                                 │
│  ☐ Mark as Memorable Moment                                     │
│  ☐ 🔒 Make Private                                              │
│                                                                 │
│              [ Skip ]     [ Save Reflection ]                   │
└─────────────────────────────────────────────────────────────────┘
```

### PV Earning

To be determined — journaling may optionally earn PV (future enhancement).

---

## Memorable Moments

### Purpose
Flag significant entries for easy access in the Vault.

### How to Mark

| Method | Trigger |
|--------|---------|
| During manual entry | Check "Mark as Memorable Moment" |
| From existing entry | Tap ⭐ icon to toggle |
| Smart prompt | Certain categories trigger: "Was this memorable?" |

### Smart Prompt Categories

The following categories prompt "Was this a memorable moment?":
- Travel / Vacation
- Relationship / Quality Time

### Memorable Moment Display

```
⭐ MEMORABLE MOMENT
✓ Anniversary dinner with wife (3h) — +18 PV          07:30 PM
  Love 60% (+11) • Health 30% (+5) • Freedom 10% (+2)
  💬 "10th anniversary at our favorite restaurant. 
      She loved the surprise dessert."
```

---

## Privacy Protection

### Per-Entry Privacy

Any journal entry can be marked as private:
- Check "🔒 Make Private" during creation
- Or toggle lock icon on existing entry

### Private Entry Display

```
🔒 Private Entry                                       03:15 PM
   [ Unlock with PIN ]
```

### Unlock Flow

1. Tap "Unlock with PIN"
2. Enter 4-digit PIN
3. Entry content revealed
4. Auto-locks after navigating away or timeout

### PIN System

| Setting | Value |
|---------|-------|
| Format | 4-digit numeric |
| Recovery | Security question (set in Settings) |
| Scope | Per-entry (not whole Journal) |

---

## Journal Page Layout

### Date Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  JOURNAL                           [ ← ] 01-11-2026 [ → ]       │
├─────────────────────────────────────────────────────────────────┤
```

### Daily Summary Header

```
│  TODAY'S SUMMARY                                                │
│  PV Earned: 35 │ Tasks: 5/7 │ Protocols: 2/2                    │
│  Love: 12 │ Health: 18 │ Freedom: 9                             │
├─────────────────────────────────────────────────────────────────┤
```

### Entry List (Chronological)

```
│  ENTRIES                                                        │
│                                                                 │
│  ✓ Morning Protocol (45m) — +15 PV                   07:00 AM   │
│    [ + Add note ]                                               │
│                                                                 │
│  💭 Manual Entry                                      08:30 AM   │
│    "Feeling motivated today after good sleep"                   │
│                                                                 │
│  ✓ Deep work on App (2h) — +20 PV                    10:30 AM   │
│    💬 "Made progress on Morning Greeting redesign"              │
│                                                                 │
│  [+ New Entry]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Actions

| Action | Location |
|--------|----------|
| New Entry | Floating button or bottom of entry list |
| Navigate dates | Arrows in header |
| Calendar picker | Tap date to open date picker |

---

## Firestore Schema

### Journal Entries Structure

```javascript
// dailyLogs/{MM-DD-YYYY}/journalEntries
[
	{
		id: "entry-001",
		type: "auto-task", // auto-task | auto-protocol | manual | reflection
		timestamp: "10:30 AM",
		content: {
			taskId: "task-001",
			taskName: "Deep work on App",
			duration: 120,
			pvEarned: 20,
			pillarDistribution: {
				love: 6,
				health: 2,
				freedom: 12
			},
			status: "completed" // completed | incomplete
		},
		note: "Made progress on Morning Greeting redesign",
		isPrivate: false,
		isMemorable: false,
		createdAt: "01-11-2026 10:30 AM",
		updatedAt: "01-11-2026 10:35 AM"
	},
	{
		id: "entry-002",
		type: "manual",
		timestamp: "08:30 AM",
		content: {
			text: "Feeling motivated today after good sleep"
		},
		note: null,
		isPrivate: false,
		isMemorable: false,
		createdAt: "01-11-2026 08:30 AM",
		updatedAt: "01-11-2026 08:30 AM"
	},
	{
		id: "entry-003",
		type: "auto-task",
		timestamp: null,
		content: {
			taskId: "task-002",
			taskName: "Call insurance",
			duration: 30,
			pvEarned: 0,
			status: "incomplete"
		},
		note: "Got busy with other priorities",
		isPrivate: false,
		isMemorable: false,
		createdAt: "01-11-2026 11:00 PM",
		updatedAt: "01-11-2026 11:00 PM"
	}
]
```

### Memorable Moments Index

For fast retrieval in Vault:

```javascript
// users/{userId}/memorableMoments
[
	{
		date: "01-11-2026",
		entryId: "entry-004",
		title: "10th Anniversary Dinner",
		preview: "Anniversary dinner with wife..."
	}
]
```

---

## Integration Points

### Dashboard → Journal

| Event | Journal Action |
|-------|----------------|
| Task completed | Auto-capture entry created |
| Protocol completed | Auto-capture entry created |

### Morning Greeting → Journal

| Event | Journal Action |
|-------|----------------|
| Rolled-over task removed | Note captured to previous day's incomplete task entry |

### Vault → Journal

| Event | Journal Action |
|-------|----------------|
| Daily Log view | Displays all journal entries for selected date |
| Memorable Moments view | Displays filtered ⭐ entries |

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
