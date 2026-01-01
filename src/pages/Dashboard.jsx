// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Shield, Activity, Calendar, Zap, CheckCircle, Clock, Plus, Repeat, CheckSquare } from 'lucide-react';
import { MASTER_LIBRARY, PV_TIERS } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';
import ArcGauge from '../components/ArcGauge';

const Dashboard = () => {
	const dayNumber = getDayNumber();
	const currentDate = getFormattedDate();

	const getTimeBasedGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 5) return 'Good late night';
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	};
	const greeting = getTimeBasedGreeting();

	// ==========================================
	// 🧠 TWO-STAGE STATE ENGINE
	// ==========================================
	// 1. FOCUS IDS: Items selected for the day (The Plan)
	const [focusIds, setFocusIds] = useState([]);

	// 2. COMPLETED IDS: Items actually finished (The Victory)
	const [completedIds, setCompletedIds] = useState([]);

	// ACTION: Move from Library -> Focus Zone
	const addToFocus = (id) => {
		if (focusIds.length < 9 && !focusIds.includes(id)) { // Global limit or per-pillar limit? keeping flexible for now
			setFocusIds([...focusIds, id]);
		}
	};

	// ACTION: Mark Focus Item as Complete (Or Un-complete)
	const toggleComplete = (id) => {
		if (completedIds.includes(id)) {
			setCompletedIds(completedIds.filter(i => i !== id));
		} else {
			setCompletedIds([...completedIds, id]);
		}
	};

	// CALCULATIONS
	const calculateStats = () => {
		let stats = { total: 0, health: 0, freedom: 0, love: 0 };

		// ONLY count completed items for points
		completedIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				stats.total += item.points;
				const cats = item.categories || [item.category];
				const splitVal = item.points / cats.length;
				cats.forEach(c => {
					if (c === 'health') stats.health += splitVal;
					if (c === 'freedom') stats.freedom += splitVal;
					if (c === 'love') stats.love += splitVal;
				});
			}
		});
		return stats;
	};
	const currentStats = calculateStats();

	// CHRONO-BUDGET CALCULATOR
	const calculateTimeBudget = () => {
		let totalMinutes = 0;
		focusIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				totalMinutes += (item.duration || 15); // Default 15m if missing
			}
		});
		const hours = Math.floor(totalMinutes / 60);
		const mins = totalMinutes % 60;
		return `${hours}h ${mins}m`;
	};
	const timeBudget = calculateTimeBudget();

	const getTierLabel = (score) => {
		if (score >= PV_TIERS.zenith.min) return PV_TIERS.zenith.label;
		if (score >= PV_TIERS.fantastic.min) return PV_TIERS.fantastic.label;
		if (score >= PV_TIERS.solid.min) return PV_TIERS.solid.label;
		if (score >= PV_TIERS.good.min) return PV_TIERS.good.label;
		if (score >= PV_TIERS.fair.min) return PV_TIERS.fair.label;
		return "START";
	};

	// HELPER: Get items for a pillar that are NOT in focus zone yet
	const getAvailableItems = (pillar) => {
		return MASTER_LIBRARY
			.filter(item => {
				const cats = item.categories || [item.category];
				return cats.includes(pillar) && item.status === 'active' && !focusIds.includes(item.id);
			})
			.sort((a, b) => b.points - a.points)
			.slice(0, 10);
	};

	// HELPER: Get Focus Items for a specific pillar
	const getFocusItemsByPillar = (pillar) => {
		return focusIds
			.map(id => MASTER_LIBRARY.find(t => t.id === id))
			.filter(item => item && (item.categories || [item.category]).includes(pillar));
	};

	// ==========================================
	// 🎨 VISUAL RENDER
	// ==========================================
	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* --- HEADER --- */}
			<div className="flex-none px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-800/50 bg-[#0B1120] z-20">
				<div>
					<h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
						{greeting}, <span className="text-blue-500">Architect</span>
					</h1>
					<div className="flex items-center gap-2 mt-1 text-slate-400 text-sm font-medium">
						<span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs border border-slate-700">Day {dayNumber}</span>
						<span>•</span>
						<span>{currentDate}</span>
					</div>
				</div>

				<div className="flex items-center gap-6">
					{/* CHRONO-METER */}
					<div className="hidden md:flex flex-col items-end">
						<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Focus Time</div>
						<div className="text-sm font-bold text-blue-400 flex items-center gap-1">
							<Clock size={14} /> {timeBudget}
						</div>
					</div>

					{/* NEXT EVENT */}
					<div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-[#1A2435] border border-slate-700 shadow-lg animate-pulse-slow">
						<div className="relative">
							<div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 animate-ping"></div>
							<Calendar size={16} className="text-slate-300" />
						</div>
						<div className="flex flex-col leading-none">
							<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Up Next • 09:15 AM</span>
							<span className="text-xs font-bold text-white">Jenda's Dental Appointment</span>
						</div>
					</div>

					{/* SCORE */}
					<div className="flex items-center gap-4 pl-4 border-l border-slate-700">
						<div className="text-right hidden sm:block">
							<div className="text-[10px] text-slate-500 uppercase font-bold">Daily Total</div>
							<div className="text-xs font-bold text-amber-400">{getTierLabel(currentStats.total)}</div>
						</div>
						<div className="text-3xl font-bold text-white tabular-nums tracking-tight">
							{Math.round(currentStats.total)}
						</div>
					</div>
				</div>
			</div>

			{/* --- SWIMLANES --- */}
			<div className="flex-1 min-h-0 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">

				{/* === SWIMLANE 1: LOVE (RED) === */}
				<Swimlane
					pillar="love"
					color="#ef4444"
					label="LOVE & FAMILY"
					gaugeVal={currentStats.love}
					gaugeMax={40}
					availableItems={getAvailableItems('love')}
					focusItems={getFocusItemsByPillar('love')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Zap size={12} />}
					gradientFrom="from-[#1e1b2e]"
					gradientTo="to-[#0f172a]"
				/>

				{/* === SWIMLANE 2: HEALTH (BLUE) === */}
				<Swimlane
					pillar="health"
					color="#06b6d4"
					label="HEALTH & BODY"
					gaugeVal={currentStats.health}
					gaugeMax={30}
					availableItems={getAvailableItems('health')}
					focusItems={getFocusItemsByPillar('health')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Activity size={12} />}
					gradientFrom="from-[#0f2231]"
					gradientTo="to-[#0f172a]"
				/>

				{/* === SWIMLANE 3: FREEDOM (GOLD) === */}
				<Swimlane
					pillar="freedom"
					color="#f59e0b"
					label="FREEDOM & FINANCE"
					gaugeVal={currentStats.freedom}
					gaugeMax={50}
					availableItems={getAvailableItems('freedom')}
					focusItems={getFocusItemsByPillar('freedom')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Shield size={12} />}
					gradientFrom="from-[#1f1e1b]"
					gradientTo="to-[#0f172a]"
				/>

			</div>
		</div>
	);
};

// --- SUB-COMPONENT: SWIMLANE ---
const Swimlane = ({ pillar, color, label, gaugeVal, gaugeMax, availableItems, focusItems, completedIds, onAddToFocus, onToggleComplete, icon, gradientFrom, gradientTo }) => {

	// Create exactly 3 slots for visual guidance
	const slots = [0, 1, 2];

	return (
		<div className="flex flex-col gap-6 h-full min-h-0">
			{/* GAUGE */}
			<ArcGauge
				value={gaugeVal} max={gaugeMax} color={color} label={label} subLabel="Status"
				gradientFrom={gradientFrom} gradientTo={gradientTo}
			/>

			{/* FOCUS ZONE (The Plan) */}
			<div className="flex-none bg-[#0f1522] border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
				<div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
					<h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
						{icon} Daily Focus
					</h3>
					<span className="text-[10px] text-slate-500 font-mono">TOP 3</span>
				</div>

				<div className="flex flex-col gap-2">
					{slots.map(index => {
						const item = focusItems[index];
						if (item) {
							// RENDER ACTIVE FOCUS ITEM
							const isDone = completedIds.includes(item.id);
							return (
								<div
									key={item.id}
									onClick={() => onToggleComplete(item.id)}
									className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-300 group overflow-hidden ${
										isDone
										? 'bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
										: 'bg-[#1A2435] border-slate-700 hover:border-blue-500/50 hover:bg-[#1e293b]'
									}`}
								>
									<div className="flex items-center justify-between relative z-10">
										<div className="flex items-center gap-3">
											{/* TYPE ICON */}
											<div className={`p-1 rounded ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
												{item.type === 'habit' ? <Repeat size={10} /> : <CheckSquare size={10} />}
											</div>
											<div>
												<div className={`text-xs font-bold ${isDone ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>{item.label}</div>
												<div className="flex items-center gap-2 mt-0.5">
													<span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={8} /> {item.duration || 15}m</span>
												</div>
											</div>
										</div>
										<div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
											+{Math.round(item.points)}
										</div>
									</div>
								</div>
							);
						} else {
							// RENDER EMPTY SLOT
							return (
								<div key={`empty-${index}`} className="h-[58px] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center">
									<Plus size={14} className="text-slate-700" />
								</div>
							);
						}
					})}
				</div>
			</div>

			{/* LIBRARY LIST (The Supply) */}
			<div className="flex-1 min-h-0 bg-[#0B1120] border border-slate-800/50 rounded-2xl p-4 flex flex-col overflow-hidden">
				<div className="flex items-center justify-between pb-3">
					<span className="text-[10px] font-bold text-slate-500 uppercase">Available Protocols</span>
				</div>
				<div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
					{availableItems.map(item => (
						<div
							key={item.id}
							onClick={() => onAddToFocus(item.id)}
							className="flex items-center justify-between p-3 rounded-lg border border-slate-800/50 bg-[#0f1522] hover:bg-[#1A2435] hover:border-slate-700 cursor-pointer transition-all group"
						>
							<div className="flex items-center gap-3">
								<div className="text-slate-600">
									{item.type === 'habit' ? <Repeat size={12} /> : <CheckSquare size={12} />}
								</div>
								<div className="text-xs text-slate-400 group-hover:text-slate-200">{item.label}</div>
							</div>
							<div className="text-[10px] font-bold text-slate-600 group-hover:text-blue-400">{item.points} PV</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
