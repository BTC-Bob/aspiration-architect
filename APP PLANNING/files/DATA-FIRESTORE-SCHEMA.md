# Firestore Schema
## AspirationArchitect v0.3 Data Reference

### Context
> **App:** AspirationArchitect — A personal life management app built around 
> three pillars: Love, Health, and Freedom (in that order).
>
> **This Document:** Complete Firestore database schema for all collections 
> and documents. Use this as the definitive reference for data structure.

---

## Database Overview

```
users/
  └── {userId}/
        ├── profile/
        │     └── settings
        ├── categories/
        │     └── {categoryId}
        ├── habits/
        │     └── {habitId}
        ├── protocols/
        │     └── {protocolId}
        ├── tasks/
        │     └── {taskId}
        ├── milestones/
        │     └── {milestoneId}
        ├── dailyLogs/
        │     └── {MM-DD-YYYY}
        ├── streaks/
        │     └── {streakId}
        ├── memorableMoments/
        │     └── {momentId}
        └── morningGreeting/
              └── config
```

---

## Collection: profile/settings

### Purpose
Stores all user preferences and configuration.

### Document Structure

```javascript
// users/{userId}/profile/settings
{
	// Identity
	identity: {
		designation: "Architect" // String - how the app addresses user
	},

	// External Integrations
	integrations: {
		googleCalendar: {
			connected: true, // Boolean
			selectedCalendars: ["family-shared", "personal"], // Array<String>
			lastSyncedAt: "01-11-2026 08:00 AM" // String
		},
		homeAddress: {
			street: "123 Main Street", // String
			cityStateZip: "Anytown, CA 90210" // String
		},
		whoop: {
			connected: false, // Boolean
			accessToken: null // String or null
		}
	},

	// Goals and Targets
	goalsAndTargets: {
		dailyPvTarget: 75, // Number
		annualPvGoal: 28000 // Number
	},

	// Notification Preferences
	notifications: {
		morningGreetingReminder: {
			enabled: true, // Boolean
			time: "06:00" // String - 24hr format
		},
		streakAlerts: true, // Boolean
		protocolReminders: true // Boolean
	},

	// Privacy Settings
	privacy: {
		pinHash: "hashed_value", // String - bcrypt or similar
		securityQuestion: "What is your mother's maiden name?", // String
		securityAnswerHash: "hashed_value" // String
	},

	// Metadata
	createdAt: "01-01-2026", // String - MM-DD-YYYY
	updatedAt: "01-11-2026" // String - MM-DD-YYYY
}
```

---

## Collection: morningGreeting/config

### Purpose
Stores Morning Greeting customizable elements.

### Document Structure

```javascript
// users/{userId}/morningGreeting/config
{
	// Prayer / Affirmation
	prayer: {
		text: "As the new day begins, I **embrace** the opportunity to **design** a purposeful and **fulfilling** day...", // String - markdown bold
		boldWords: ["embrace", "design", "fulfilling", "contributes", "blueprint", "intention", "clarity", "aspirations"] // Array<String>
	},

	// Physiology Metrics
	physiologyMetrics: [
		{
			id: "sleep", // String - unique identifier
			label: "WHOOP SLEEP SCORE", // String - display label
			unit: "%", // String - unit of measurement
			order: 0 // Number - display order
		},
		{
			id: "weight",
			label: "MORNING WEIGHT",
			unit: "lbs",
			order: 1
		}
	],

	// Accountability Questions
	accountabilityQuestions: [
		{
			id: "q1", // String - unique identifier
			title: "Digital Sunset", // String - short name
			description: "Did you execute the Shutdown Protocol last night?", // String - full question
			linkedProtocol: "protocol-evening", // String or null - protocol ID
			linkedCategory: null, // String or null - negative category ID for PV penalty
			order: 0 // Number - display order
		},
		{
			id: "q2",
			title: "PureView Integrity Check",
			description: "Did you maintain wholesome visual standards yesterday?",
			linkedProtocol: null,
			linkedCategory: "cat-negative-integrity",
			order: 1
		}
	],

	// Default Settings
	defaultCoreTaskCount: 3, // Number - 1 to 5

	// Metadata
	updatedAt: "01-11-2026"
}
```

---

## Collection: categories

### Purpose
Stores category definitions for PV distribution.

### Document Structure

```javascript
// users/{userId}/categories/{categoryId}
{
	id: "cat-exercise", // String - unique identifier
	name: "Exercise / Fitness", // String - display name
	pillarDistribution: {
		love: 10, // Number - percentage (0-100)
		health: 60,
		freedom: 30
	},
	keywords: ["gym", "workout", "exercise", "treadmill", "run", "jog", "lift", "weights", "cardio", "yoga", "stretch"], // Array<String>
	defaultValueTier: "high-impact", // String - maintenance | standard | high-impact
	isNegative: false, // Boolean
	isSystemCategory: true, // Boolean - false for user-created
	order: 6, // Number - dropdown display order
	createdAt: "01-01-2026",
	updatedAt: "01-01-2026"
}
```

---

## Collection: habits

### Purpose
Stores reusable habit definitions.

### Document Structure

```javascript
// users/{userId}/habits/{habitId}
{
	id: "habit-001", // String - unique identifier
	name: "Hydrate 16oz", // String - habit name
	categoryId: "cat-nutrition", // String - reference to category
	valueTier: "maintenance", // String - maintenance | standard | high-impact
	duration: 15, // Number - default duration in minutes
	icon: "💧", // String - emoji or icon name
	notes: "Drink full glass of water upon waking", // String or null
	usedInProtocols: ["protocol-morning", "protocol-afternoon"], // Array<String> - computed/cached
	createdAt: "01-01-2026", // String - MM-DD-YYYY
	updatedAt: "01-11-2026"
}
```

---

## Collection: protocols

### Purpose
Stores protocol (routine) definitions.

### Document Structure

```javascript
// users/{userId}/protocols/{protocolId}
{
	id: "protocol-morning", // String - unique identifier
	name: "Morning Protocol", // String - protocol name
	description: "Start the day with intention", // String or null
	icon: "☀", // String - emoji or icon name
	timeOfDay: "morning", // String - morning | afternoon | evening | null
	schedule: {
		type: "daily", // String - daily | weekdays | weekends | custom | advanced
		days: [0, 1, 2, 3, 4, 5, 6], // Array<Number> - 0=Sun, 1=Mon, etc.
		// For advanced scheduling:
		advancedType: null, // String - interval | specific-dates | null
		intervalDays: null, // Number or null - every X days
		intervalStartDate: null, // String or null - MM-DD-YYYY
		specificDates: null // Array<String> or null - ["01", "15"] for monthly
	},
	habitIds: ["habit-001", "habit-002", "habit-003", "habit-004", "habit-005"], // Array<String>
	completionBonus: 5, // Number - bonus PV for 100% completion
	createdAt: "01-01-2026",
	updatedAt: "01-11-2026"
}
```

---

## Collection: tasks

### Purpose
Stores saved task templates for Library.

### Document Structure

```javascript
// users/{userId}/tasks/{taskId}
{
	id: "task-001", // String - unique identifier
	name: "Get a haircut", // String - task name
	categoryId: "cat-personal-care", // String - reference to category
	duration: 30, // Number - default duration in minutes
	valueTier: "maintenance", // String - usually inherited from category
	isLibraryItem: true, // Boolean - true if saved to Library
	createdAt: "01-05-2026",
	updatedAt: "01-05-2026"
}
```

---

## Collection: milestones

### Purpose
Stores major life goal tracking.

### Document Structure

```javascript
// users/{userId}/milestones/{milestoneId}
{
	id: "milestone-001", // String - unique identifier
	name: "Launch CNA Packet", // String - milestone name
	pillar: "freedom", // String - love | health | freedom
	totalPV: 500, // Number - total PV value (100-1000)
	earnedPV: 180, // Number - PV earned so far
	description: "Build and launch the CNA certification prep packet", // String or null
	targetDate: "03-15-2026", // String or null - MM-DD-YYYY
	subGoals: [
		{
			id: "sg-001", // String - unique within milestone
			name: "Complete content outline", // String
			isComplete: true, // Boolean
			completedAt: "01-05-2026", // String or null - MM-DD-YYYY
			pvValue: 60 // Number - auto-calculated (60% / subGoal count)
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
	linkedTaskIds: ["task-deep-work-001", "task-deep-work-002"], // Array<String>
	status: "in-progress", // String - in-progress | achieved | archived
	createdAt: "01-01-2026",
	achievedAt: null, // String or null - MM-DD-YYYY
	updatedAt: "01-10-2026"
}
```

---

## Collection: dailyLogs

### Purpose
Stores all daily activity data.

### Document Structure

```javascript
// users/{userId}/dailyLogs/{MM-DD-YYYY}
{
	date: "01-11-2026", // String - MM-DD-YYYY (same as document ID)

	// Morning Greeting Data
	morningGreeting: {
		prayerCompleted: true, // Boolean
		prayerCompletedAt: "06:15 AM", // String or null

		physiology: {
			sleepScore: 82, // Number
			weight: 183.5 // Number
			// Additional user-defined metrics
		},
		physiologyCompletedAt: "06:18 AM",

		accountability: [
			{
				questionId: "q1",
				title: "Digital Sunset",
				response: true, // Boolean
				negativePvApplied: 0 // Number
			},
			{
				questionId: "q2",
				title: "PureView Integrity Check",
				response: false,
				negativePvApplied: -5
			}
		],
		accountabilityCompletedAt: "06:20 AM",

		completedAt: "06:25 AM" // String - full greeting completion time
	},

	// Planned Tasks
	plannedTasks: {
		core: [
			{
				taskId: "daily-task-001", // String - unique for this day
				name: "Deep work on App", // String
				categoryId: "cat-deep-work", // String
				duration: 120, // Number - minutes
				valueTier: "high-impact", // String
				status: "completed", // String - planned | completed | rolled
				completedAt: "10:30 AM", // String or null
				pvEarned: 20, // Number
				pillarDistribution: {
					love: 6, // Number
					health: 2,
					freedom: 12
				}
			},
			{
				taskId: "daily-task-002",
				name: "Gym / Treadmill",
				categoryId: "cat-exercise",
				duration: 60,
				valueTier: "high-impact",
				status: "completed",
				completedAt: "02:15 PM",
				pvEarned: 10,
				pillarDistribution: {
					love: 1,
					health: 6,
					freedom: 3
				}
			},
			{
				taskId: "daily-task-003",
				name: "Call insurance",
				categoryId: "cat-admin",
				duration: 30,
				valueTier: "maintenance",
				status: "rolled", // Will appear in tomorrow's rolled over
				completedAt: null,
				pvEarned: 0,
				pillarDistribution: null
			}
		],
		flex: [
			{
				taskId: "daily-task-004",
				name: "Grocery shopping",
				categoryId: "cat-admin",
				duration: 30,
				valueTier: "maintenance",
				status: "completed",
				completedAt: "05:00 PM",
				pvEarned: 2,
				pillarDistribution: {
					love: 0.8,
					health: 0.4,
					freedom: 0.8
				}
			}
		]
	},

	// Protocol Progress
	protocolProgress: [
		{
			protocolId: "protocol-morning", // String
			protocolName: "Morning Protocol", // String - denormalized for display
			habitsTotal: 7, // Number
			habitsCompleted: ["habit-001", "habit-002", "habit-003", "habit-004", "habit-005", "habit-006", "habit-007"], // Array<String>
			isComplete: true, // Boolean
			habitPvEarned: 12, // Number
			completionBonusPvEarned: 5, // Number - only if isComplete
			completedAt: "07:00 AM" // String or null
		},
		{
			protocolId: "protocol-evening",
			protocolName: "Evening Protocol",
			habitsTotal: 5,
			habitsCompleted: ["habit-010", "habit-011", "habit-012", "habit-013", "habit-014"],
			isComplete: true,
			habitPvEarned: 10,
			completionBonusPvEarned: 5,
			completedAt: "09:30 PM"
		}
	],

	// Active Protocols for the Day
	activeProtocolIds: ["protocol-morning", "protocol-evening"], // Array<String>

	// Calendar Events (synced from Google Calendar)
	calendarEvents: [
		{
			id: "gcal-event-001", // String
			title: "Dentist Appointment", // String
			start: "02:00 PM", // String
			end: "03:00 PM", // String
			location: "Main St Dental", // String or null
			travelBuffer: 30 // Number - minutes, user-added
		}
	],

	// PV Summary
	pvEarned: {
		total: 64, // Number
		love: 18, // Number
		health: 25, // Number
		freedom: 21 // Number
	},

	// Time Calculations
	timeCalculation: {
		available: 330, // Number - minutes
		committed: 270, // Number - minutes
		remaining: 60 // Number - minutes
	},

	// Journal Entries
	journalEntries: [
		{
			id: "entry-001", // String
			type: "auto-task", // String - auto-task | auto-protocol | manual | reflection
			timestamp: "10:30 AM", // String
			content: {
				taskId: "daily-task-001",
				taskName: "Deep work on App",
				duration: 120,
				pvEarned: 20,
				pillarDistribution: {
					love: 6,
					health: 2,
					freedom: 12
				},
				status: "completed"
			},
			note: "Made great progress on Morning Greeting redesign", // String or null
			isPrivate: false, // Boolean
			isMemorable: false, // Boolean
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
		}
	],

	// Memorable Moment Flag
	memorableMoment: {
		isMemorable: false, // Boolean
		title: null, // String or null
		linkedEntryId: null // String or null
	},

	// Day Rating (computed)
	dayRating: "average", // String - poor | below-average | average | good | exceptional

	// Metadata
	createdAt: "01-11-2026 06:15 AM",
	updatedAt: "01-11-2026 09:30 PM"
}
```

---

## Collection: streaks

### Purpose
Tracks consecutive completion of habits and protocols.

### Document Structure

```javascript
// users/{userId}/streaks/{streakId}
{
	id: "streak-protocol-morning", // String - unique identifier
	type: "protocol", // String - protocol | habit
	referenceId: "protocol-morning", // String - protocol or habit ID
	name: "Morning Protocol", // String - denormalized for display
	currentStreak: 23, // Number - current consecutive days
	longestStreak: 45, // Number - personal best
	lastCompletedDate: "01-11-2026", // String - MM-DD-YYYY
	streakStartDate: "12-19-2025", // String - MM-DD-YYYY
	bonusesEarned: [
		{
			milestone: 7, // Number - days
			earnedAt: "12-26-2025", // String - MM-DD-YYYY
			pvAwarded: 5 // Number
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

## Collection: memorableMoments

### Purpose
Index of memorable moments for quick retrieval in Vault.

### Document Structure

```javascript
// users/{userId}/memorableMoments/{momentId}
{
	id: "moment-001", // String - unique identifier
	date: "01-11-2026", // String - MM-DD-YYYY
	dailyLogRef: "01-11-2026", // String - reference to dailyLogs document
	entryId: "entry-003", // String - reference to journal entry within dailyLog
	title: "10th Wedding Anniversary", // String
	preview: "Anniversary dinner at our favorite restaurant...", // String - truncated text
	categoryId: "cat-relationship", // String or null
	isPrivate: false, // Boolean
	createdAt: "01-11-2026 07:30 PM"
}
```

---

## Indexing Recommendations

### Composite Indexes

```
Collection: dailyLogs
Index: date (ASC), pvEarned.total (DESC)

Collection: milestones
Index: status (ASC), createdAt (DESC)

Collection: streaks
Index: type (ASC), currentStreak (DESC)

Collection: memorableMoments
Index: date (DESC)
Index: isPrivate (ASC), date (DESC)
```

---

## Security Rules (Example)

```javascript
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		// Users can only access their own data
		match /users/{userId}/{document=**} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}
	}
}
```

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
