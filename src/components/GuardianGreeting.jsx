import React, { useMemo } from 'react';

const GuardianGreeting = ({ userName = "Architect", tasks = [], appointments = [] }) => {

	// --- TIME ENGINE ---
	const timeData = useMemo(() => {
		const hour = new Date().getHours();
		if (hour < 5) return { greeting: "Systems Active" };
		if (hour < 12) return { greeting: "Good morning" };
		if (hour < 18) return { greeting: "Good afternoon" };
		return { greeting: "Good evening" };
	}, []);

	// --- CONTEXT ENGINE ---
	const briefing = useMemo(() => {
		// 1. Analyze Tasks
		const pendingHighImpact = tasks.filter(t => t.isHighPotency && !t.completed).length;
		const completedCount = tasks.filter(t => t.completed).length;

		// 2. Analyze Calendar (Find first upcoming)
		const nextEvent = appointments[0]; // Assuming sorted list

		// 3. Generate Strategic Message
		if (completedCount > 3 && pendingHighImpact === 0) {
			return "Momentum is high. You've cleared the critical path for today.";
		}

		if (nextEvent) {
			// CRITICAL FIX: Replace standard space in time with Non-Breaking Space (\u00A0)
			// This glues "10:00" and "AM" together so they never split lines.
			const stickyTime = nextEvent.time.replace(' ', '\u00A0');
			return `${nextEvent.title} is coming up at ${stickyTime}. Let's clear the deck before then.`;
		}

		if (pendingHighImpact > 0) {
			return `You have ${pendingHighImpact} High-Impact items awaiting command. Focus on the 'Love' category first.`;
		}

		return "The board is clear. A perfect time for strategic planning or deep work.";
	}, [tasks, appointments]);

	return (
		<div className="text-center space-y-2">
			<div className="flex items-center justify-center">
				<h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
					{timeData.greeting}, <span className="text-blue-400">{userName}</span>
				</h1>
			</div>

			{/* Text Container */}
			<div className="max-w-3xl mx-auto px-4">
				<p className="text-slate-400 text-lg font-medium leading-relaxed animate-fade-in-up">
					{briefing}
				</p>
			</div>
		</div>
	);
};

export default GuardianGreeting;
