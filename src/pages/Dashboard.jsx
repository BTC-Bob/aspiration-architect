// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Shield, Activity, Calendar, Zap, CheckCircle } from 'lucide-react';

// 1. IMPORT LOGIC
import { APP_VERSION } from '../constants';
import { MASTER_LIBRARY, PV_TIERS } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';

// 2. IMPORT UI (Note: Sidebar removed to fix duplication)
import ArcGauge from '../components/ArcGauge';

const Dashboard = () => {
	// ==========================================
	// 🧠 LOGIC ENGINE
	// ==========================================
	const dayNumber = getDayNumber();
	const currentDate = getFormattedDate();

	// Local State for "Day 1" Interaction
	const [selectedIds, setSelectedIds] = useState([]);

	// Scoring Algorithm
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

	// Interaction Handler
	const toggleItem = (id) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter(itemId => itemId !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	// Tier Label Logic
	const getTierLabel = (score) => {
		if (score >= PV_TIERS.zenith.min) return PV_TIERS.zenith.label;
		if (score >= PV_TIERS.fantastic.min) return PV_TIERS.fantastic.label;
		if (score >= PV_TIERS.solid.min) return PV_TIERS.solid.label;
		if (score >= PV_TIERS.good.min) return PV_TIERS.good.label;
		if (score >= PV_TIERS.fair.min) return PV_TIERS.fair.label;
		return "START";
	};

	// ==========================================
	// 🎨 VISUAL RENDER (RESTORED DESIGN)
	// ==========================================
	return (
		<div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#0B1120] text-slate-100 font-sans">

			{/* --- HEADER SECTION (Restored "Good Morning") --- */}
			<header className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">

				{/* LEFT: Status Badges */}
				<div className="flex items-center gap-3 order-2 xl:order-1">
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
						<Shield size={12} />
						<span>Guardian Protocol Active</span>
					</div>
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
						<Activity size={12} />
						<span>Live Sync</span>
					</div>
				</div>

				{/* CENTER: The Greeting (Absolute Center on Desktop) */}
				<div className="text-center order-1 xl:order-2 xl:absolute xl:left-1/2 xl:-translate-x-1/2">
					<h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
						Good morning, <span className="text-blue-400">Architect</span>
					</h1>
					<p className="text-slate-400 text-sm mt-1 font-medium">
						{currentDate} • Day {dayNumber} of 365
					</p>
				</div>

				{/* RIGHT: Daily PV Widget (Restored High Contrast Card) */}
				<div className="order-3 bg-[#1A2435] p-4 rounded-xl border border-slate-700/50 shadow-lg flex items-center gap-5 min-w-[180px] justify-between">
					<div className="text-right">
						<div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Daily PV</div>
						<div className={`text-3xl font-bold ${currentStats.total < 0 ? 'text-red-400' : 'text-white'}`}>
							{currentStats.total}
						</div>
					</div>
					<div className="h-8 w-px bg-slate-600/50"></div>
					<div className="text-xs font-bold text-amber-400 tracking-widest">
						{getTierLabel(currentStats.total)}
					</div>
				</div>
			</header>

			{/* --- GAUGES SECTION (Restored Card Style) --- */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
				{/* LOVE GAUGE */}
				<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-rose-500/30 transition-all duration-500">
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
					<div className="flex flex-col items-center">
						<div className="mb-4 transform scale-110">
							<ArcGauge value={currentStats.love} max={40} color="#ef4444" />
						</div>
						<h3 className="text-rose-400 font-bold tracking-[0.2em] text-xs uppercase mt-[-10px]">LOVE & FAMILY</h3>
						<div className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">Connection Needed</div>
					</div>
				</div>

				{/* HEALTH GAUGE */}
				<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
					<div className="flex flex-col items-center">
						<div className="mb-4 transform scale-110">
							<ArcGauge value={currentStats.health} max={30} color="#06b6d4" />
						</div>
						<h3 className="text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase mt-[-10px]">HEALTH & BODY</h3>
						<div className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">Maintenance Required</div>
					</div>
				</div>

				{/* FREEDOM GAUGE */}
				<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
					<div className="flex flex-col items-center">
						<div className="mb-4 transform scale-110">
							<ArcGauge value={currentStats.freedom} max={50} color="#f59e0b" />
						</div>
						<h3 className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase mt-[-10px]">FREEDOM & FINANCE</h3>
						<div className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">Action Required</div>
					</div>
				</div>
			</section>

			{/* --- TACTICAL PRIORITIES (The Logic Input) --- */}
			<section className="grid grid-cols-1 xl:grid-cols-3 gap-8">

				{/* INPUT STREAM (Replacing "Tactical Priorities" with interactive list) */}
				<div className="xl:col-span-2">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-medium text-slate-200 tracking-wide flex items-center gap-2">
							<Zap size={18} className="text-blue-400" />
							TACTICAL PRIORITIES (Daily Menu)
						</h2>
						<span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">
							{selectedIds.length} ACTIVE
						</span>
					</div>

					<div className="space-y-3">
						{MASTER_LIBRARY.filter(t => t.status === 'active').map((task) => {
							const isSelected = selectedIds.includes(task.id);

							// Visual Logic for Selection
							let borderClass = isSelected
								? 'border-blue-500/50 bg-blue-900/10'
								: 'border-slate-800 bg-[#0f1522] hover:border-slate-700';

							let iconColor = isSelected ? 'text-blue-400' : 'text-slate-600';
							let textColor = isSelected ? 'text-slate-100' : 'text-slate-400';

							return (
								<div
									key={task.id}
									onClick={() => toggleItem(task.id)}
									className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${borderClass}`}
								>
									<div className="flex items-center gap-4">
										<div className={`transition-colors ${iconColor}`}>
											{isSelected ? <CheckCircle size={20} className="fill-blue-500/20" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover:border-slate-500"></div>}
										</div>
										<div>
											<div className={`font-medium text-sm transition-colors ${textColor}`}>
												{task.label}
											</div>
											{/* Tiny Tag for Category */}
											<div className="flex items-center gap-2 mt-1">
												<span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
													task.category === 'health' ? 'text-cyan-400 bg-cyan-950/30' :
													task.category === 'freedom' ? 'text-amber-400 bg-amber-950/30' :
													'text-rose-400 bg-rose-950/30'
												}`}>
													{task.category}
												</span>
												{task.notes && <span className="text-[10px] text-slate-600 truncate max-w-[200px]">{task.notes}</span>}
											</div>
										</div>
									</div>

									{/* Points Pill */}
									<div className={`text-sm font-bold px-3 py-1 rounded-lg ${isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
										{task.points > 0 ? '+' : ''}{task.points} PV
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* STRATEGIC OUTLOOK (Restored Visual Placeholder) */}
				<div className="xl:col-span-1">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-medium text-slate-200 tracking-wide">STRATEGIC OUTLOOK</h2>
						<button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View Calendar</button>
					</div>

					{/* Next Event Card */}
					<div className="bg-[#1A2435] rounded-xl p-5 border border-slate-700/50 mb-4 relative overflow-hidden">
						<div className="absolute top-0 right-0 p-4 opacity-10">
							<Calendar size={64} className="text-white" />
						</div>
						<div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">UPCOMING</div>
						<div className="text-white font-medium mb-1">Jenda's Dental Appointment</div>
						<div className="text-blue-400 text-sm font-bold bg-blue-500/10 inline-block px-2 py-0.5 rounded">09:15 AM</div>
					</div>

					{/* Daily Reflection Card */}
					<div className="bg-[#0f1522] rounded-xl p-5 border border-slate-800 h-full max-h-[300px] flex flex-col">
						<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DAILY REFLECTION</div>
						<p className="text-slate-400 text-sm italic leading-relaxed mb-4">
							"Focus today was on balancing the immediate needs with the long-term goals. Need to remember that rest is also a productive activity..."
						</p>
						<div className="mt-auto pt-4 border-t border-slate-800">
							<span className="text-xs text-blue-400 cursor-pointer hover:underline flex items-center gap-1">
								Open Journal →
							</span>
						</div>
					</div>
				</div>

			</section>
		</div>
	);
};

export default Dashboard;
