// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Shield, Activity, Calendar } from 'lucide-react';
import { MASTER_LIBRARY, PV_TIERS } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';

// WIDGETS
import ArcGauge from '../components/ArcGauge';
import TacticalList from '../components/TacticalList';

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

	const [selectedIds, setSelectedIds] = useState([]);

	const calculateStats = () => {
		let stats = { total: 0, health: 0, freedom: 0, love: 0 };
		selectedIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				stats.total += item.points;
				if (item.category === 'health') stats.health += item.points;
				if (item.category === 'freedom') stats.freedom += item.points;
				if (item.category === 'love') stats.love += item.points;
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

	// ==========================================
	// 🎨 VISUAL RENDER (FIXED VIEWPORT)
	// ==========================================
	// h-screen + overflow-hidden locks the body scroll
	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* --- TOP SECTION (Static - Never Scrolls) --- */}
			<div className="flex-none p-6 pb-0">

				{/* HEADER */}
				<header className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
					<div className="flex items-center gap-3 order-2 xl:order-1">
						<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
							<Shield size={12} /> <span>Guardian Protocol Active</span>
						</div>
						<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
							<Activity size={12} /> <span>Live Sync</span>
						</div>
					</div>

					<div className="text-center order-1 xl:order-2 xl:absolute xl:left-1/2 xl:-translate-x-1/2">
						<h1 className="text-3xl font-bold text-white tracking-tight">
							{greeting}, <span className="text-blue-400">Architect</span>
						</h1>
						<p className="text-slate-400 text-sm mt-1 font-medium">
							{currentDate} • Day {dayNumber} of 365
						</p>
					</div>

					<div className="order-3 bg-[#1A2435] p-4 rounded-xl border border-slate-700/50 shadow-lg flex items-center gap-5 min-w-[180px] justify-between">
						<div className="text-right">
							<div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Daily PV</div>
							<div className={`text-3xl font-bold ${currentStats.total < 0 ? 'text-red-400' : 'text-white'}`}>{currentStats.total}</div>
						</div>
						<div className="h-8 w-px bg-slate-600/50"></div>
						<div className="text-xs font-bold text-amber-400 tracking-widest">{getTierLabel(currentStats.total)}</div>
					</div>
				</header>

				{/* GAUGES */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<ArcGauge
						value={currentStats.love} max={40} color="#ef4444" label="LOVE & FAMILY" subLabel="Connection Needed"
						gradientFrom="from-[#1e1b2e]" gradientTo="to-[#0f172a]"
					/>
					<ArcGauge
						value={currentStats.health} max={30} color="#06b6d4" label="HEALTH & BODY" subLabel="Maintenance Required"
						gradientFrom="from-[#0f2231]" gradientTo="to-[#0f172a]"
					/>
					<ArcGauge
						value={currentStats.freedom} max={50} color="#f59e0b" label="FREEDOM & FINANCE" subLabel="Action Required"
						gradientFrom="from-[#1f1e1b]" gradientTo="to-[#0f172a]"
					/>
				</section>
			</div>

			{/* --- BOTTOM SECTION (Scrollable Widgets) --- */}
			{/* flex-1 min-h-0 forces this section to take remaining height but NOT overflow the screen */}
			<div className="flex-1 min-h-0 p-6 pt-0 grid grid-cols-1 xl:grid-cols-3 gap-6">

				{/* COL 1 & 2: TACTICAL LIST (The Smart Widget) */}
				<div className="xl:col-span-2 h-full min-h-0">
					<TacticalList
						tasks={MASTER_LIBRARY}
						selectedIds={selectedIds}
						onToggle={toggleItem}
					/>
				</div>

				{/* COL 3: STRATEGIC OUTLOOK (Scrollable if needed) */}
				<div className="xl:col-span-1 h-full min-h-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">

					{/* Calendar Card */}
					<div className="bg-[#1A2435] rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden flex-none">
						<div className="absolute top-0 right-0 p-4 opacity-10"><Calendar size={64} className="text-white" /></div>
						<div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">UPCOMING</div>
						<div className="text-white font-medium mb-1">Jenda's Dental Appointment</div>
						<div className="text-blue-400 text-sm font-bold bg-blue-500/10 inline-block px-2 py-0.5 rounded">09:15 AM</div>
					</div>

					{/* Reflection Card */}
					<div className="bg-[#0f1522] rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col">
						<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DAILY REFLECTION</div>
						<p className="text-slate-400 text-sm italic leading-relaxed mb-4">"Focus today was on balancing the immediate needs with the long-term goals..."</p>
						<div className="mt-auto pt-4 border-t border-slate-800"><span className="text-xs text-blue-400 cursor-pointer hover:underline flex items-center gap-1">Open Journal →</span></div>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Dashboard;
