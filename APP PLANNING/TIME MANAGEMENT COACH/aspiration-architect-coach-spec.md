# AspirationArchitect — AI Coach Module Specification

**Version:** 1.2
**Last Updated:** 01-19-2026
**Status:** Planning

---

## Overview

Integrate an AI-powered Coach directly into AspirationArchitect. The coach helps The Architect (user) design and construct the life of their dreams, using Claude API to provide intelligent, context-aware guidance based on Blueprints, schedule, building blocks, and history — all stored in Firestore.

---

## The Architect's Lexicon

The coach uses architectural language blended with Reality Transurfing philosophy throughout:

### Core Architecture Terms

| Term | Meaning |
|------|---------|
| **The Architect** | The user — designing and selecting the structure of their life |
| **Pillars** | Three load-bearing life dimensions: Love, Health, Freedom |
| **Blueprint** | A goal visualization — the life being selected and built |
| **Building Block** | A task that constructs toward a Blueprint |
| **Foundation** | Underlying habits, stability work |
| **Foundational Stone** | A key decision/action supporting the year's structure |
| **Vault** | Secure storage for history and milestones |
| **Mosaic** | Big picture view of the year, built one tile (day) at a time |
| **Site Journal** | Daily log of construction activity |
| **Structural Integrity** | Heart-mind alignment — when both agree, the build is sound |

### Health Pillar — Foundation Inspection Terms

| Term | Meaning |
|------|---------|
| **Foundation Inspection** | Daily health check-in before construction begins |
| **Site Restoration** | Castor Oil — overnight cellular repair and recovery |
| **Structural Reinforcement** | Pumpkin Seed Oil — daily prostate health maintenance |
| **Vitality Nexus Elixir** | Morning health drink — vision, clarity, immunity, respiratory, prostate |
| **Cellular Cleanup** | Autophagy — activated after 12-16+ hours fasted |
| **Recovery Metrics** | Whoop Sleep Score and Recovery Score |
| **Load Capacity** | Daily weight tracking |

### Reality Transurfing Terms

| Term | Meaning |
|------|---------|
| **Infinite Blueprint Library** | Space of Variations — all possible lives exist simultaneously |
| **Construction Path** | Lifeline — a route through possibilities toward a destination |
| **Wrecking Ball** | Pendulum — external force that demolishes progress if given energy |
| **Over-Engineering** | Excess Potential — gripping so tight you create resistance |
| **Flow Construction** | Outer Intention — working with the current, allowing materials to arrive |
| **Force Construction** | Inner Intention — willpower alone, pushing against resistance |
| **The Completed Vision** | Target Slide — seeing the finished structure as already standing |
| **The Reflection Effect** | Mirror Principle — the site reflects the builder's attitude |
| **Path of Least Resistance** | Alternatives Flow — the easier route you might be missing |
| **Heart-Mind Alignment** | Unity of heart and mind — flow state, no internal conflict |
| **The Rustle of the Morning Stars** | Intuition — the quiet voice that knows |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AspirationArchitect                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Goals     │  │ Daily Logs  │  │   User Profile      │  │
│  │ Collection  │  │ Collection  │  │   (Schedule, etc.)  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │             │
│         └────────────────┼────────────────────┘             │
│                          │                                  │
│                          ▼                                  │
│         ┌────────────────────────────────┐                  │
│         │     Context Builder Service    │                  │
│         │  (Assembles data for prompts)  │                  │
│         └───────────────┬────────────────┘                  │
│                         │                                   │
│                         ▼                                   │
│         ┌────────────────────────────────┐                  │
│         │      AI Coach Component        │                  │
│         │   (React + Claude API Call)    │                  │
│         └───────────────┬────────────────┘                  │
│                         │                                   │
│                         ▼                                   │
│         ┌────────────────────────────────┐                  │
│         │       Claude API (Sonnet)      │                  │
│         │   + System Prompt (Persona)    │                  │
│         └────────────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Firestore Data Models

### Collection: `users/{userId}/blueprints`

```javascript
{
	id: "blueprint_001",
	pillar: "freedom",                // love, health, freedom
	title: "Homeownership",
	definition: "Purchase mobile home on owned land near San Jacinto by March 2027",
	targetDate: Timestamp,
	status: "active",                 // active, completed, paused
	constructionStages: [
		{
			name: "Foundation",
			targetDate: Timestamp,
			buildingBlocks: [
				{ text: "Pay off credit card via 401K loan", completed: false },
				{ text: "Verify Mom's credit score", completed: true }
			]
		}
	],
	currentStatus: "Foundation stage in progress",
	nextAction: "Jenda to contact HR about 401K loan process",
	structuralChallenges: ["Credit score needs improvement", "Savings timeline tight"],
	createdAt: Timestamp,
	updatedAt: Timestamp
}
```

### Collection: `users/{userId}/siteJournals`

```javascript
{
	id: "2026-01-19",
	date: Timestamp,
	dayOfWeek: "Monday",
	
	// Foundation Inspection (Health Pillar)
	foundationInspection: {
		siteRestoration: true,              // Castor Oil used last night?
		weight: 185.5,                      // Morning weight in lbs
		structuralReinforcement: true,      // Pumpkin Seed Oil taken?
		vitalityElixir: true,               // Morning elixir consumed?
		lastFoodIntake: "2026-01-18T18:30", // Timestamp of last meal
		fastingHours: 14.5,                 // Calculated hours fasted
		autophagyActivated: true,           // 12+ hours = true
		whoopSleepScore: 82,                // Whoop Sleep Score
		whoopRecoveryScore: 68,             // Whoop Recovery Score
		inspectionNotes: ""                 // Any relevant health notes
	},
	
	energyLevel: 8,
	
	buildingBlocks: [
		{
			id: "block_001",
			text: "Map out CNA Packet business model",
			type: "blueprint-advancing",   // blueprint-advancing, foundation, reactive, time-bound, rollover
			linkedBlueprint: "blueprint_002",
			linkedPillar: "freedom",
			completed: false,
			timeEstimate: 120,             // minutes (optional)
			assignedBlock: 2               // 1, 2, 3, or 4 (optional)
		}
	],
	accomplishments: [
		"Created comprehensive Homeownership Master Plan"
	],
	carryover: [
		"CNA Packet business model planning"
	],
	notes: [
		"Jenda needs to ask HR about 401K loan this week"
	],
	constructionProgress: [
		{ pillar: "freedom", note: "Created master plan with 5 construction stages" }
	],
	
	// Transurfing Daily Tracking
	mindset: {
		targetSlideCompleted: true,           // Did they do the visualization?
		flowVsForce: "flow",                  // How did the day feel? flow, force, mixed
		wreckingBallsEncountered: [],         // What tried to pull them off track?
		heartMindCheck: "aligned",            // aligned, forcing, unsure
		reflectionNote: "Good flow today, didn't grip on the homeownership timeline"
	},
	
	createdAt: Timestamp,
	updatedAt: Timestamp
}
```

### Collection: `users/{userId}/profile`

```javascript
{
	name: "Rob",
	schedule: {
		weekdays: {
			wakeUp: "04:30",
			block1: { start: "05:40", end: "06:10", bestUse: "Quick tasks, designing the day" },
			block2: { start: "08:00", end: "11:20", bestUse: "Deep construction, blueprint-advancing" },
			block3: { start: "12:20", end: "14:35", bestUse: "Moderate focus, continuation" },
			block4: { start: "15:00", end: "15:30", bestUse: "Site closeout, small tasks" }
		},
		daysOff: ["Monday", "Tuesday"],
		daysOffNote: "Jenda home. Flexible timing, smaller blocks, quality time priority."
	},
	activePillars: ["love", "health", "freedom"],
	keyDates: [
		{ date: "2026-01-28", event: "Eye surgeon consultation", pillar: "health" },
		{ date: "2026-03-10", event: "Urologist consultation", pillar: "health" }
	],
	recoveryMode: false,
	recoveryNote: null,
	
	// Health Pillar Configuration
	healthConfig: {
		trackCastorOil: true,
		trackWeight: true,
		trackPumpkinSeedOil: true,
		trackVitalityElixir: true,
		trackFasting: true,
		trackWhoop: true,
		targetFastingHours: 16,            // Target intermittent fasting window
		vitalityElixirRecipe: {
			warmWater: "8-10 oz",
			bakingSoda: "1/4 tsp",
			lemonJuice: "1/2 lemon",
			ginger: "1/2 tsp grated",
			manuka_honey: "1 tsp",
			blackPepper: "pinch"
		},
		healthReminders: {
			pumpkinSeedOil: "Prostate health maintenance — protecting the foundation.",
			vitalityElixir: "Vision, clarity, immunity, respiratory health — plus ginger and Manuka honey support prostate health.",
			autophagy: "Cellular cleanup crew activated — clearing damaged proteins and cellular debris."
		}
	},
	
	// Transurfing Mindset Tracking
	mindset: {
		lastTargetSlide: Timestamp,           // When they last visualized the Completed Vision
		gripLevel: "low",                      // low, moderate, high — tracked over time
		recentWreckingBalls: [],               // Things that have been draining energy
		heartMindAlignment: "aligned",         // aligned, questioning, conflicted
		dominantMode: "flow"                   // flow, force, mixed
	}
}
```

### Collection: `users/{userId}/coachConversations`

```javascript
{
	id: "conv_2026-01-19_kickoff",
	date: Timestamp,
	sessionType: "kickoff",           // kickoff, blueprint-refinement, check-in, general
	messages: [
		{ role: "assistant", content: "Morning. Let's inspect the foundation and design the day." },
		{ role: "assistant", content: "Did you use Castor Oil last night?" },
		{ role: "user", content: "Yes" },
		{ role: "assistant", content: "Good. What's your weight this morning?" },
		{ role: "user", content: "185" },
		// ... continues through Foundation Inspection and task planning
	],
	foundationInspectionCompleted: true,
	linkedSiteJournal: "2026-01-19",
	createdAt: Timestamp
}
```

### Collection: `users/{userId}/healthMetrics` (Optional — for trends)

```javascript
{
	id: "2026-01-19",
	date: Timestamp,
	weight: 185.5,
	whoopSleepScore: 82,
	whoopRecoveryScore: 68,
	fastingHours: 14.5,
	supplementsTaken: {
		castorOil: true,
		pumpkinSeedOil: true,
		vitalityElixir: true
	},
	energyLevel: 8,
	createdAt: Timestamp
}
```

---

## Context Builder Service

Before each API call, assemble relevant context:

```javascript
// services/coachContext.js

export async function buildCoachContext(userId) {
	const profile = await getDoc(doc(db, `users/${userId}/profile`));
	const blueprints = await getDocs(
		query(
			collection(db, `users/${userId}/blueprints`),
			where("status", "==", "active")
		)
	);
	const today = formatDate(new Date()); // MM-DD-YYYY
	const yesterday = formatDate(subtractDays(new Date(), 1));
	
	const todayJournal = await getDoc(doc(db, `users/${userId}/siteJournals/${today}`));
	const yesterdayJournal = await getDoc(doc(db, `users/${userId}/siteJournals/${yesterday}`));
	
	// Get recent health metrics for trend awareness
	const recentHealthMetrics = await getDocs(
		query(
			collection(db, `users/${userId}/healthMetrics`),
			orderBy("date", "desc"),
			limit(7)
		)
	);
	
	return {
		profile: profile.data(),
		blueprints: blueprints.docs.map(d => d.data()),
		todayJournal: todayJournal.exists() ? todayJournal.data() : null,
		yesterdayJournal: yesterdayJournal.exists() ? yesterdayJournal.data() : null,
		recentHealthMetrics: recentHealthMetrics.docs.map(d => d.data()),
		currentDate: today,
		currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' })
	};
}
```

---

## System Prompt Construction

```javascript
// services/coachPrompt.js

export function buildSystemPrompt(context) {
	return `
# Aspiration Architect — Coach

## Philosophy
You help The Architect select and construct the life of their dreams. This system blends two frameworks:
1. **The Architect's Framework** — Strategic planning, disciplined execution, structured progress
2. **Reality Transurfing** — The finished structure already exists. Your role is to align with the lifeline where it stands complete, reduce resistance, and walk the path.

## Persona
You are The Architect's Coach — helping ${context.profile.name} design and construct their vision. Your personality blends:
- **Jocko Willink:** Ownership, calm discipline, radical responsibility
- **Tim Ferriss:** Strategic leverage, sharp questions, 80/20 thinking
- **Bill Campbell:** Direct warmth, peer-level respect, honest caring
- **Vadim Zeland:** Lower importance to reduce resistance, trust Alternatives Flow, align heart and mind

Be direct, efficient, one question at a time. Use the Lexicon naturally.

**Monitor not just WHAT The Architect is doing, but HOW they're relating to it:**
- Are they gripping too tight? (Over-Engineering)
- Are external forces draining energy? (Wrecking Balls)
- Are head and heart aligned? (Structural Integrity)
- Are they forcing when flow is available?

## Current Date
${context.currentDate} (${context.currentDay})

## The Architect's Schedule
${context.profile.schedule.daysOff.includes(context.currentDay) 
	? "TODAY IS A DAY OFF. Jenda is home. Lighter expectations, flexible timing. Protect the Love Pillar."
	: `CONSTRUCTION BLOCKS:
- Block 1 (5:40-6:10): Quick tasks, designing the day
- Block 2 (8:00-11:20): DEEP CONSTRUCTION — protect for Blueprint-advancing work
- Block 3 (12:20-2:35): Moderate focus
- Block 4 (3:00-3:30): Site closeout

BLOCK 2 IS SACRED. Protect it for Blueprint work. Don't let Wrecking Balls consume it.`
}

## Active Blueprints by Pillar
${context.blueprints.map(b => `
### ${b.pillar.toUpperCase()}: ${b.title}
- Target: ${formatDate(b.targetDate.toDate())}
- Status: ${b.currentStatus}
- Next Action: ${b.nextAction}
`).join('\n')}

## Yesterday's Site Journal
${context.yesterdayJournal ? `
- Energy: ${context.yesterdayJournal.energyLevel}
- Completed: ${context.yesterdayJournal.buildingBlocks.filter(b => b.completed).length}/${context.yesterdayJournal.buildingBlocks.length} building blocks
- Blueprint-advancing: ${context.yesterdayJournal.buildingBlocks.filter(b => b.completed && b.type === 'blueprint-advancing').length}
- Carryover: ${context.yesterdayJournal.carryover?.join(', ') || 'None'}
${context.yesterdayJournal.foundationInspection ? `
- Yesterday's Foundation: Weight ${context.yesterdayJournal.foundationInspection.weight}lbs, Recovery ${context.yesterdayJournal.foundationInspection.whoopRecoveryScore}%` : ''}
` : 'No journal available.'}

## Key Upcoming Dates
${context.profile.keyDates
	.filter(d => new Date(d.date) >= new Date())
	.slice(0, 5)
	.map(d => `- ${d.date}: ${d.event} (${d.pillar})`)
	.join('\n')}

${context.profile.recoveryMode ? `
## RECOVERY MODE ACTIVE
${context.profile.recoveryNote}
Reduce expectations. Protect rest. Foundation work only. No guilt.
The structure will wait. Healing is construction too.
` : ''}

## Session Flow (Morning Kickoff)

### 1. Foundation Inspection (Health Pillar)
Ask these questions ONE AT A TIME, wait for each response:

a. **Site Restoration:** "Did you use Castor Oil last night?"
b. **Load Capacity:** "What's your weight this morning?"
c. **Structural Reinforcement:** "Did you have your Pumpkin Seed Oil?"
   - After yes: "Good — that's daily prostate health maintenance. Protecting the foundation."
d. **Vitality Nexus Elixir:** "Did you have your morning elixir?"
   - After yes: "Vision, clarity, immunity, respiratory health — and the ginger and Manuka honey support prostate health too. Solid stack."
e. **Cellular Cleanup:** "When was your last food intake?"
   - Calculate hours fasted. If 12-16+: "Autophagy window activated — cellular cleanup crew is working."
f. **Recovery Metrics:** "What are your Whoop Sleep Score and Recovery Score?"

### 2. Energy Check
Based on Whoop data and self-assessment: "Energy level today? (1-10)"

### 3. Mindset Scan
Assess for gripping, forcing, misalignment. Address gently if detected.

### 4. Adaptive Questions (based on energy)
- LOW (1-4): Minimum viable day, protect rest
- MODERATE (5-7): Balanced mix, check carryover
- HIGH (8-10): Push for Blueprint-advancing, tackle avoided items

### 5. Target Slide Moment
"Before we lock this in — take 10 seconds. See the Completed Vision. Feel it. Now, what's the first stone?"

### 6. Build Task List
Protect Block 2 for Blueprints.

### 7. Send Off
"Site journal saved. Time to construct."

## Health Reminders
- Pumpkin Seed Oil: "${context.profile.healthConfig?.healthReminders?.pumpkinSeedOil || 'Prostate health maintenance.'}"
- Vitality Elixir: "${context.profile.healthConfig?.healthReminders?.vitalityElixir || 'Vision, clarity, immunity, respiratory, prostate support.'}"
- Autophagy (12-16+ hrs fasted): "${context.profile.healthConfig?.healthReminders?.autophagy || 'Cellular cleanup activated.'}"

## Transurfing Reminders
- If gripping detected: "You're holding too tight. What would you do if it couldn't fail?"
- If Wrecking Ball detected: "Is this your Blueprint, or someone else's agenda?"
- If forcing detected: "Is there an Alternatives Flow you're not seeing?"
- If misaligned: "Heart-mind check: Does this feel aligned?"
- The completed structure exists. The Architect is selecting it and walking toward it.
`;
}
```

---

## AI Coach React Component

```jsx
// components/AICoach/AICoach.jsx

import { useState, useEffect } from 'react';
import { buildCoachContext } from '../../services/coachContext';
import { buildSystemPrompt } from '../../services/coachPrompt';
import { useAuth } from '../../hooks/useAuth';

export default function AICoach() {
	const { user } = useAuth();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [context, setContext] = useState(null);

	useEffect(() => {
		async function loadContext() {
			const ctx = await buildCoachContext(user.uid);
			setContext(ctx);
		}
		loadContext();
	}, [user.uid]);

	async function sendMessage() {
		if (!input.trim() || loading) return;

		const userMessage = { role: 'user', content: input };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
					'anthropic-version': '2023-06-01'
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 1024,
					system: buildSystemPrompt(context),
					messages: [...messages, userMessage].map(m => ({
						role: m.role,
						content: m.content
					}))
				})
			});

			const data = await response.json();
			const assistantMessage = {
				role: 'assistant',
				content: data.content[0].text
			};
			setMessages(prev => [...prev, assistantMessage]);

		} catch (error) {
			console.error('Coach API error:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col h-full bg-[#0B1120]">
			{/* Message display */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`p-3 rounded-lg ${
							msg.role === 'user'
								? 'bg-[#1A2435] ml-8'
								: 'bg-[#0F1A2A] mr-8'
						}`}
					>
						{msg.content}
					</div>
				))}
				{loading && (
					<div className="text-gray-400 animate-pulse">Coach is thinking...</div>
				)}
			</div>

			{/* Input area */}
			<div className="p-4 border-t border-[#1A2435]">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
						placeholder="Talk to your coach..."
						className="flex-1 bg-[#1A2435] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={sendMessage}
						disabled={loading}
						className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
```

---

## Site Journal Actions

Coach should be able to trigger Firestore updates:

```javascript
// services/coachActions.js

export async function createSiteJournal(userId, date, buildingBlocks) {
	const journalRef = doc(db, `users/${userId}/siteJournals/${date}`);
	await setDoc(journalRef, {
		id: date,
		date: Timestamp.now(),
		dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
		foundationInspection: null,    // Will be populated during kickoff
		energyLevel: null,
		buildingBlocks: buildingBlocks.map((b, i) => ({
			id: `block_${i}`,
			text: b.text,
			type: b.type || 'foundation',
			linkedPillar: b.pillar || null,
			completed: false
		})),
		accomplishments: [],
		carryover: [],
		notes: [],
		constructionProgress: [],
		mindset: null,
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now()
	});
}

export async function updateFoundationInspection(userId, date, inspectionData) {
	const journalRef = doc(db, `users/${userId}/siteJournals/${date}`);
	
	// Calculate fasting hours if lastFoodIntake provided
	let fastingHours = null;
	let autophagyActivated = false;
	if (inspectionData.lastFoodIntake) {
		const lastFood = new Date(inspectionData.lastFoodIntake);
		const now = new Date();
		fastingHours = (now - lastFood) / (1000 * 60 * 60); // Convert ms to hours
		autophagyActivated = fastingHours >= 12;
	}
	
	await updateDoc(journalRef, {
		foundationInspection: {
			siteRestoration: inspectionData.castorOil || false,
			weight: inspectionData.weight || null,
			structuralReinforcement: inspectionData.pumpkinSeedOil || false,
			vitalityElixir: inspectionData.vitalityElixir || false,
			lastFoodIntake: inspectionData.lastFoodIntake || null,
			fastingHours: fastingHours ? parseFloat(fastingHours.toFixed(1)) : null,
			autophagyActivated: autophagyActivated,
			whoopSleepScore: inspectionData.whoopSleepScore || null,
			whoopRecoveryScore: inspectionData.whoopRecoveryScore || null,
			inspectionNotes: inspectionData.notes || ""
		},
		updatedAt: Timestamp.now()
	});
	
	// Also log to healthMetrics collection for trend tracking
	const metricsRef = doc(db, `users/${userId}/healthMetrics/${date}`);
	await setDoc(metricsRef, {
		id: date,
		date: Timestamp.now(),
		weight: inspectionData.weight || null,
		whoopSleepScore: inspectionData.whoopSleepScore || null,
		whoopRecoveryScore: inspectionData.whoopRecoveryScore || null,
		fastingHours: fastingHours ? parseFloat(fastingHours.toFixed(1)) : null,
		supplementsTaken: {
			castorOil: inspectionData.castorOil || false,
			pumpkinSeedOil: inspectionData.pumpkinSeedOil || false,
			vitalityElixir: inspectionData.vitalityElixir || false
		},
		createdAt: Timestamp.now()
	});
}

export async function markBlockComplete(userId, date, blockId) {
	const journalRef = doc(db, `users/${userId}/siteJournals/${date}`);
	const journalSnap = await getDoc(journalRef);
	if (!journalSnap.exists()) return;

	const buildingBlocks = journalSnap.data().buildingBlocks.map(b =>
		b.id === blockId ? { ...b, completed: true } : b
	);

	await updateDoc(journalRef, { buildingBlocks, updatedAt: Timestamp.now() });
}

export async function setEnergyLevel(userId, date, level) {
	const journalRef = doc(db, `users/${userId}/siteJournals/${date}`);
	await updateDoc(journalRef, { energyLevel: level, updatedAt: Timestamp.now() });
	
	// Also update healthMetrics
	const metricsRef = doc(db, `users/${userId}/healthMetrics/${date}`);
	await updateDoc(metricsRef, { energyLevel: level });
}
```

---

## Tool Use (Advanced)

For coach to directly manipulate data, implement Claude tool use:

```javascript
const tools = [
	{
		name: "record_foundation_inspection",
		description: "Record the morning Foundation Inspection (health check) data",
		input_schema: {
			type: "object",
			properties: {
				castorOil: { type: "boolean", description: "Did user use Castor Oil last night?" },
				weight: { type: "number", description: "Morning weight in pounds" },
				pumpkinSeedOil: { type: "boolean", description: "Did user take Pumpkin Seed Oil?" },
				vitalityElixir: { type: "boolean", description: "Did user drink Vitality Nexus Elixir?" },
				lastFoodIntake: { type: "string", description: "ISO timestamp of last food intake" },
				whoopSleepScore: { type: "number", description: "Whoop Sleep Score (0-100)" },
				whoopRecoveryScore: { type: "number", description: "Whoop Recovery Score (0-100)" },
				notes: { type: "string", description: "Any health-related notes" }
			}
		}
	},
	{
		name: "create_building_block_list",
		description: "Create today's building block list in the site journal",
		input_schema: {
			type: "object",
			properties: {
				buildingBlocks: {
					type: "array",
					items: {
						type: "object",
						properties: {
							text: { type: "string" },
							type: { type: "string", enum: ["blueprint-advancing", "foundation", "reactive", "time-bound", "rollover"] },
							pillar: { type: "string" }
						},
						required: ["text"]
					}
				}
			},
			required: ["buildingBlocks"]
		}
	},
	{
		name: "mark_block_complete",
		description: "Mark a building block as completed",
		input_schema: {
			type: "object",
			properties: {
				blockId: { type: "string" }
			},
			required: ["blockId"]
		}
	},
	{
		name: "add_carryover",
		description: "Add a building block to tomorrow's carryover list",
		input_schema: {
			type: "object",
			properties: {
				blockText: { type: "string" }
			},
			required: ["blockText"]
		}
	}
];
```

---

## Implementation Phases

### Phase 1: Read-Only Coach (MVP)
- [ ] Set up Firestore collections (blueprints, siteJournals, profile, coachConversations, healthMetrics)
- [ ] Build context builder service
- [ ] Create AI Coach component
- [ ] Implement conversation UI
- [ ] Store conversation history

### Phase 2: Write Actions
- [ ] Implement Foundation Inspection recording
- [ ] Implement building block list creation from coach
- [ ] Implement block completion marking
- [ ] Implement energy level setting
- [ ] Add carryover functionality

### Phase 3: Tool Use Integration
- [ ] Add Claude tool definitions
- [ ] Handle tool calls in frontend
- [ ] Execute Firestore actions from tool responses

### Phase 4: Polish
- [ ] Session type detection (kickoff vs blueprint refinement)
- [ ] Weekly Mosaic summary generation
- [ ] Pillar balance tracking
- [ ] Recovery mode toggle
- [ ] Health trends visualization

---

## API Cost Management

**Strategies to minimize usage:**

1. **Use Haiku for simple responses** — route "mark task done" confirmations to cheaper model
2. **Cache context** — don't rebuild full context for every message in a session
3. **Truncate history** — only send last 10 messages, summarize older ones
4. **Lazy loading** — only fetch goal details when coach needs them
5. **Session limits** — cap messages per session, prompt to start new session

---

## Security Considerations

1. **Never expose API key in client code for production** — use Firebase Cloud Functions as proxy
2. **Validate user ownership** — ensure userId matches authenticated user
3. **Rate limiting** — implement per-user rate limits
4. **Input sanitization** — prevent prompt injection via user input

### Cloud Function Proxy Example

```javascript
// functions/index.js

const functions = require('firebase-functions');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
	apiKey: functions.config().anthropic.key
});

exports.coachMessage = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
	}

	const { messages, systemPrompt } = data;

	const response = await client.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 1024,
		system: systemPrompt,
		messages: messages
	});

	return { content: response.content[0].text };
});
```

---

## Future Enhancements

### Core Features
- **Voice input** — morning kickoff via speech ("Design today")
- **Mobile notifications** — "Block 2 starting in 10 minutes — construction time"
- **Weekly Mosaic digest** — email summary of Pillar progress and mindset patterns
- **Jenda's profile** — track her debt payoff as part of the Love Pillar
- **Blueprint templates** — pre-built structures for common life goals
- **Integration with calendar** — auto-detect appointments
- **Vault visualization** — historical view of completed Blueprints and milestones

### Health Pillar Features
- **Health Dashboard** — visualize weight, recovery, fasting trends over time
- **Supplement Streak Tracker** — gamify consistency with Pumpkin Seed Oil and Vitality Elixir
- **Whoop Integration API** — auto-pull sleep and recovery scores
- **Fasting Timer** — real-time countdown to autophagy activation
- **Pre-Consultation Reports** — generate summaries for doctor appointments (eye surgeon 01-28, urologist 03-10)
- **Recovery Mode Auto-Detect** — if Whoop recovery stays low for 3+ days, suggest reduced expectations

### Transurfing Features
- **Grip Detector** — ML-based analysis of language patterns to detect Over-Engineering
- **Wrecking Ball Journal** — track what external forces pulled energy, spot patterns
- **Flow/Force Dashboard** — visualize ratio of flow vs force days over time
- **Target Slide Library** — save and revisit Completed Vision descriptions with imagery
- **Heart-Mind Pulse** — quick daily check-in on alignment, tracked over time
- **Alternatives Flow Prompt** — when stuck for X days, auto-suggest "Is there another door?"
- **The Architect's Creed** — display creed on Monday mornings or when mindset flags concern
- **Rustle of the Morning Stars** — journaling prompt for intuition capture

---

## The Vision

> *AspirationArchitect is not just a productivity tool. It is a life operating system that combines strategic clarity with inner alignment.*
>
> *The Architect doesn't grind toward goals — they select the lifeline where the completed structure already stands, lower resistance, align heart and mind, and walk the path with calm discipline.*
>
> *Every day is construction. Every stone matters. And the finished building? It's already there, waiting to be arrived at.*
>
> *Build wisely. Build in flow. Build the life you've already chosen.*

---

## Revision Log

| Date | Version | What Changed |
|------|---------|--------------|
| 01-18-2026 | 1.0 | Initial specification |
| 01-18-2026 | 1.1 | Added Transurfing integration, lexicon, mindset tracking |
| 01-19-2026 | 1.2 | Added Foundation Inspection (Morning Health Check) — Firestore models for health tracking, System Prompt updates, new tool definitions, Health Pillar lexicon terms, health-related future enhancements |
