# Milestones & Streaks
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
> **This Document:** Milestones track major life accomplishments with 
> significant PV rewards. Streaks reward sustained consistency with 
> bonus PV at defined intervals. Together they provide long-term 
> motivation beyond daily task completion.

### Dependencies

| Depends On | Why |
|------------|-----|
| Daily task completion | Tasks can be linked to Milestones |
| Protocol/Habit completion | Streaks track consecutive completion |
| Category Library | Milestones assigned to pillars |
| Firestore: milestones/ | Milestone data storage |
| Firestore: streaks/ | Streak tracking data |

### Key Principles

- Life significance — Milestones represent transformational achievements
- Sustained effort — Streaks reward consistency over time
- Asymmetric accountability — reward consistency, don't penalize breaks
- Progress + completion — earn PV incrementally AND at finish line

---

## Milestones

### Definition

A Milestone is a major life accomplishment that fundamentally changes your position, status, or trajectory in one of the Three Pillars.

### The Test for a Milestone

> "Does completing this fundamentally change my position, status, or trajectory in one of the Three Pillars?"

### Examples

| Pillar | Example Milestones |
|--------|-------------------|
| Love | Anniversary trip completed, Major family event hosted, Relationship reconciliation, 50 date nights in a year |
| Health | Achieve target weight (175 lbs), Complete marathon, 90-day workout streak |
| Freedom | Launch CNA Packet, Pay off debt, New income stream established, Career promotion |

### What is NOT a Milestone

| Item | Why Not |
|------|---------|
| Complete 30-day workout streak | Impressive but doesn't transform status (could be High Impact task) |
| Single deep work session | Progress toward milestone, not the milestone itself |
| Maintain a system | Maintenance, not transformation |

---

## Milestone Structure

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| name | String | What you're achieving |
| pillar | Enum | Love / Health / Freedom |
| totalPV | Number | Point value (100–1000) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| subGoals | Array | Checkpoint items toward completion |
| targetDate | Date | Deadline (MM-DD-YYYY) |
| linkedTasks | Array | Task IDs that contribute to this milestone |
| description | String | Personal context |

### Milestone Creation UI

```
┌─────────────────────────────────────────────────────────────────┐
│  CREATE MILESTONE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Milestone Name                                                 │
│  [ Launch CNA Packet                             ]              │
│                                                                 │
│  Pillar                                                         │
│  [ Love ] [•Freedom•] [ Health ]                                │
│                                                                 │
│  Total PV Value                                                 │
│  [ 500 ] PV                                                     │
│                                                                 │
│  Target Date (optional)                                         │
│  [ 03-15-2026 ]                                                 │
│                                                                 │
│  Description (optional)                                         │
│  [ Build and launch the CNA certification prep...    ]          │
│                                                                 │
│  SUB-GOALS (optional)                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ☐ Complete content outline                                │  │
│  │ ☐ Design mockups finished                                 │  │
│  │ ☐ Beta testing complete                                   │  │
│  │ ☐ Marketing page live                                     │  │
│  │ ☐ Official launch                                         │  │
│  │ [ + Add sub-goal ]                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              [ Cancel ]     [ Create Milestone ]                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Milestone PV Distribution

### Model: Progress + Completion Bonus

| Component | Percentage | When Awarded |
|-----------|------------|--------------|
| Sub-goals | 60% | Distributed evenly across sub-goals |
| Completion bonus | 40% | When milestone fully achieved |

### Calculation Method

**Automatic even split** — system divides PV equally across sub-goals.

### Example: 500 PV Milestone with 5 Sub-goals

| Component | Calculation | PV |
|-----------|-------------|-----|
| Each sub-goal | 500 × 60% ÷ 5 | 60 PV |
| Completion bonus | 500 × 40% | 200 PV |

**Progression:**
- Sub-goal 1 complete: +60 PV (total: 60)
- Sub-goal 2 complete: +60 PV (total: 120)
- Sub-goal 3 complete: +60 PV (total: 180)
- Sub-goal 4 complete: +60 PV (total: 240)
- Sub-goal 5 complete: +60 PV + **200 bonus** (total: 500)

### Milestones Without Sub-goals

If no sub-goals defined:
- Full PV awarded when milestone is manually marked complete
- No incremental earning

---

## Milestone Tracking

### Task Linking (Optional)

When creating a task in Plan Today, optionally link to a milestone:

```
Task: Deep work on CNA Packet
Link to Milestone: [ Launch CNA Packet ▼ ]
```

**Benefits of linking:**
- See contribution in Milestone view
- Track effort invested
- No automatic sub-goal completion (manual confirmation required)

### Progress Display

```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Launch CNA Packet                            FREEDOM      │
│    ████████████░░░░░░░░ 60%                    +500 PV       │
│    Sub-goals: 3/5 complete │ Earned: 180 PV                  │
│    ✓ Complete content outline (+60 PV)                       │
│    ✓ Design mockups finished (+60 PV)                        │
│    ✓ Beta testing complete (+60 PV)                          │
│    ☐ Marketing page live                                     │
│    ☐ Official launch                                         │
│    Target: 03-15-2026 │ 63 days remaining                    │
│    Linked tasks: 12 completed (24 hrs invested)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Milestone States

| State | Meaning |
|-------|---------|
| In Progress | Active, has incomplete sub-goals or not yet marked done |
| Achieved | All sub-goals complete OR manually marked complete |
| Archived | Achieved milestones older than current year |

---

## Streaks

### Definition

A Streak tracks consecutive days of completing a specific Habit or Protocol.

### Philosophy: Asymmetric Accountability

| Scenario | Response |
|----------|----------|
| Sustained positive streak | PV bonus at milestones |
| Broken streak | No penalty — streak resets to zero |
| Prolonged skip (7+ days) | Gentle prompt in Morning Greeting |

**Rationale:** Punishing breaks creates guilt spirals. Life happens — illness, travel, emergencies aren't moral failures. The system encourages restart without punishment.

---

## Streak Bonus Schedule

| Streak Length | Bonus PV | Milestone Name |
|---------------|----------|----------------|
| 7 days | +5 PV | Weekly Warrior |
| 14 days | +10 PV | Fortnight Focus |
| 30 days | +25 PV | Monthly Master |
| 60 days | +50 PV | Consistency Champion |
| 90 days | +100 PV | Quarterly Quest |

**Bonuses are one-time per streak.** Reaching 7 days awards +5 PV once. If streak breaks and restarts, +5 PV can be earned again at 7 days.

---

## Streak Tracking

### What Creates Streaks

| Item | Streak Tracked |
|------|----------------|
| Protocol | Completing 100% of habits in the Protocol |
| Individual Habit | Completing the habit (even outside a Protocol) |

### Streak Display

```
☀ Morning Protocol          🔥 23 days         Best: 45
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░
  Next bonus: +10 PV at 30 days (7 days away)
```

### Streak Rules

| Rule | Behavior |
|------|----------|
| Day boundary | Completion must happen before midnight |
| Partial Protocol | Completing 6/7 habits does NOT continue Protocol streak |
| Skip day | Streak resets to 0 immediately |
| Timezone | Based on user's local timezone |

---

## Prolonged Skip Awareness

### Trigger
7+ consecutive days without completing a tracked Habit or Protocol.

### Display
Gentle prompt in Morning Greeting:

```
┌─────────────────────────────────────────────────────────────┐
│  💭 Heads Up                                                │
│                                                             │
│  It's been 8 days since you completed "Evening Protocol."   │
│  Want to recommit today?                                    │
│                                                             │
│  [ Not Today ]     [ Yes, Activate Protocol ]               │
└─────────────────────────────────────────────────────────────┘
```

### Behavior

| Response | Result |
|----------|--------|
| "Yes, Activate Protocol" | Protocol added to today's active list |
| "Not Today" | Prompt dismissed, may appear again after 7 more days |

**No negative PV is applied.** This is awareness, not punishment.

---

## Firestore Schema

### Milestones Collection

```javascript
// milestones/{milestoneId}
{
	id: "milestone-001",
	name: "Launch CNA Packet",
	pillar: "freedom",
	totalPV: 500,
	earnedPV: 180,
	targetDate: "03-15-2026",
	description: "Build and launch the CNA certification prep...",
	subGoals: [
		{
			id: "sg-001",
			name: "Complete content outline",
			isComplete: true,
			completedAt: "01-05-2026",
			pvValue: 60
		},
		{
			id: "sg-002",
			name: "Design mockups finished",
			isComplete: true,
			completedAt: "01-08-2026",
			pvValue: 60
		},
		{
			id: "sg-003",
			name: "Beta testing complete",
			isComplete: true,
			completedAt: "01-10-2026",
			pvValue: 60
		},
		{
			id: "sg-004",
			name: "Marketing page live",
			isComplete: false,
			completedAt: null,
			pvValue: 60
		},
		{
			id: "sg-005",
			name: "Official launch",
			isComplete: false,
			completedAt: null,
			pvValue: 60
		}
	],
	linkedTaskIds: ["task-001", "task-002", ...],
	status: "in-progress", // in-progress | achieved | archived
	createdAt: "01-01-2026",
	achievedAt: null
}
```

### Streaks Collection

```javascript
// streaks/{habitOrProtocolId}
{
	id: "streak-morning-protocol",
	type: "protocol", // protocol | habit
	referenceId: "protocol-morning",
	name: "Morning Protocol",
	currentStreak: 23,
	longestStreak: 45,
	lastCompletedDate: "01-11-2026",
	streakStartDate: "12-19-2025",
	bonusesEarned: [
		{
			milestone: 7,
			earnedAt: "12-26-2025",
			pvAwarded: 5
		},
		{
			milestone: 14,
			earnedAt: "01-02-2026",
			pvAwarded: 10
		}
	],
	createdAt: "12-19-2025",
	updatedAt: "01-11-2026"
}
```

---

## Streak Calculation Logic

### Daily Update Process

```
On task/protocol completion:
1. Get streak record for item
2. Check if lastCompletedDate is yesterday
   - YES: Increment currentStreak by 1
   - NO: Reset currentStreak to 1, update streakStartDate
3. Update lastCompletedDate to today
4. Check if currentStreak matches bonus milestone (7, 14, 30, 60, 90)
   - YES and not already earned: Award bonus PV, log to bonusesEarned
5. Update longestStreak if currentStreak > longestStreak
6. Save streak record
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| First ever completion | Create streak record with currentStreak = 1 |
| Complete twice same day | No additional streak increment |
| Miss a day then complete | Reset to 1, start new streak |
| Complete at 11:59 PM | Counts for current day |
| Timezone changes | Use user's local timezone at completion time |

---

## Integration Points

### Morning Greeting → Streaks

| Event | Action |
|-------|--------|
| Load Plan Today | Check for 7+ day skip prompts |
| Display prompt | Offer to reactivate habit/protocol |

### Dashboard → Streaks

| Event | Action |
|-------|--------|
| Protocol 100% complete | Update Protocol streak |
| Habit complete | Update Habit streak |
| Bonus milestone reached | Display celebration, award PV |

### Vault → Streaks

| Event | Action |
|-------|--------|
| Load Streaks view | Display all active and broken streaks |
| Show bonus history | List all earned streak bonuses |

### Dashboard → Milestones

| Event | Action |
|-------|--------|
| Task linked to milestone | Track in milestone's linkedTaskIds |
| Mark milestone complete | Award remaining PV + bonus |

### Vault → Milestones

| Event | Action |
|-------|--------|
| Load Milestones view | Show in-progress and achieved |
| Complete sub-goal | Award sub-goal PV, update progress |

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
