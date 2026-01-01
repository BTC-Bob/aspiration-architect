// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Shield, Activity, Calendar, Zap, CheckCircle, Clock, MapPin } from 'lucide-react';
import { MASTER_LIBRARY, PV_TIERS } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';
import ArcGauge from '../components/ArcGauge';

const Dashboard = () => {
	// ==========================================
	// 🧠 LOGIC ENGINE
	// ==========================================
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

	// LOCAL STATE
	const [selectedIds, setSelectedIds] = useState([]);

	// SCORING
	const calculateStats = () => {
		let stats = { total: 0, health: 0, freedom: 0, love: 0 };
		selectedIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				stats.total += item.points;
				// Check item.categories array (v0.3) OR item.category string (legacy)
				const cats = item.categories || [item.category];

				// Split points logic (from v0.3)
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

	const toggleItem = (id) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter(itemId => itemId !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	const getTierLabel = (score) => {
		if (score >= PV_TIERS.zenith.min) return PV_TIERS.zenith.label;
		if (score >= PV_TIERS.fantastic.min) return PV_TIERS.fantastic.label;
		if (score >= PV_TIERS.solid.min) return PV_TIERS.solid.label;
		if (score >= PV_TIERS.good.min) return PV_TIERS.good.label;
		if (score >= PV_TIERS.fair.min) return PV_TIERS.fair.label;
		return "START";
	};

	// SWIMLANE FILTER (Get Top 5 Items per Pillar)
	const getPillarItems = (pillar) => {
		return MASTER_LIBRARY
			.filter(item => {
				const cats = item.categories || [item.category];
				return cats.includes(pillar) && item.status === 'active';
			})
			.sort((a, b) => b.points - a.points) // Sort by Impact (High PV first)
			.slice(0, 5); // Take Top 5
	};

	// ==========================================
	// 🎨 VISUAL RENDER (SWIMLANE LAYOUT)
	// ==========================================
	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* --- HEADER (HUD) --- */}
			<div className="flex-none px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-800/50 bg-[#0B1120] z-20">

				{/* LEFT: Greeting & Date */}
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

				{/* RIGHT: HUD WIDGETS (Next Event + Total Score) */}
				<div className="flex items-center gap-4">

					{/* NEXT EVENT PILL (The "Calendar" Replacement) */}
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

					{/* TOTAL SCORE CARD */}
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

			{/* --- SWIMLANES (MAIN CONTENT) --- */}
			<div className="flex-1 min-h-0 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">

				{/* === SWIMLANE 1: LOVE (RED) === */}
				<div className="flex flex-col gap-6">
					{/* GAUGE */}
					<ArcGauge
						value={currentStats.love} max={40} color="#ef4444" label="LOVE & FAMILY" subLabel="Connection"
						gradientFrom="from-[#1e1b2e]" gradientTo="to-[#0f172a]"
					/>
					{/* FOCUS LIST */}
					<div className="flex-1 bg-[#0f1522] border border-rose-500/20 rounded-2xl p-4 flex flex-col shadow-[0_0_20px_rgba(244,63,94,0.05)]">
						<div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-500/10">
							<h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
								<Zap size={12} /> Focus: Love
							</h3>
							<span className="text-[10px] text-slate-500 font-mono">TOP PRIORITIES</span>
						</div>
						<div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
							{getPillarItems('love').map(item => (
								<FocusItem key={item.id} item={item} active={selectedIds.includes(item.id)} onToggle={() => toggleItem(item.id)} colorClass="text-rose-400" />
							))}
						</div>
					</div>
				</div>

				{/* === SWIMLANE 2: HEALTH (BLUE) === */}
				<div className="flex flex-col gap-6">
					{/* GAUGE */}
					<ArcGauge
						value={currentStats.health} max={30} color="#06b6d4" label="HEALTH & BODY" subLabel="Maintenance"
						gradientFrom="from-[#0f2231]" gradientTo="to-[#0f172a]"
					/>
					{/* FOCUS LIST */}
					<div className="flex-1 bg-[#0f1522] border border-cyan-500/20 rounded-2xl p-4 flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.05)]">
						<div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/10">
							<h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
								<Activity size={12} /> Focus: Health
							</h3>
							<span className="text-[10px] text-slate-500 font-mono">TOP PRIORITIES</span>
						</div>
						<div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
							{getPillarItems('health').map(item => (
								<FocusItem key={item.id} item={item} active={selectedIds.includes(item.id)} onToggle={() => toggleItem(item.id)} colorClass="text-cyan-400" />
							))}
						</div>
					</div>
				</div>

				{/* === SWIMLANE 3: FREEDOM (GOLD) === */}
				<div className="flex flex-col gap-6">
					{/* GAUGE */}
					<ArcGauge
						value={currentStats.freedom} max={50} color="#f59e0b" label="FREEDOM & FINANCE" subLabel="Action"
						gradientFrom="from-[#1f1e1b]" gradientTo="to-[#0f172a]"
					/>
					{/* FOCUS LIST */}
					<div className="flex-1 bg-[#0f1522] border border-amber-500/20 rounded-2xl p-4 flex flex-col shadow-[0_0_20px_rgba(245,158,11,0.05)]">
						<div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/10">
							<h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
								<Shield size={12} /> Focus: Freedom
							</h3>
							<span className="text-[10px] text-slate-500 font-mono">TOP PRIORITIES</span>
						</div>
						<div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
							{getPillarItems('freedom').map(item => (
								<FocusItem key={item.id} item={item} active={selectedIds.includes(item.id)} onToggle={() => toggleItem(item.id)} colorClass="text-amber-400" />
							))}
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

// --- SUB-COMPONENT: FOCUS ITEM ROW ---
const FocusItem = ({ item, active, onToggle, colorClass }) => (
	<div
		onClick={onToggle}
		className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
			active
			? 'bg-slate-800 border-slate-600'
			: 'bg-[#0B1120] border-slate-800/50 hover:border-slate-700'
		}`}
	>
		<div className="flex items-center gap-3 overflow-hidden">
			<div className={`flex-none transition-colors ${active ? colorClass : 'text-slate-600'}`}>
				{active ? <CheckCircle size={18} className="fill-current bg-white rounded-full" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-700 group-hover:border-slate-500"></div>}
			</div>
			<span className={`text-xs font-medium truncate ${active ? 'text-slate-200 line-through opacity-50' : 'text-slate-300'}`}>
				{item.label}
			</span>
		</div>
		<div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-slate-700 text-slate-400' : 'bg-slate-800 text-slate-500'}`}>
			{item.points}
		</div>
	</div>
);

export default Dashboard;
