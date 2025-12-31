// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Calendar, Zap } from 'lucide-react';

// 1. IMPORT THE LOGIC FILES
import { APP_VERSION, GOAL_PV_YEARLY, GOAL_PV_MONTHLY } from '../constants';
import { MASTER_LIBRARY, PV_TIERS } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';

// 2. IMPORT UI COMPONENTS
import Sidebar from '../components/Sidebar';
import ArcGauge from '../components/ArcGauge'; // Assuming this exists from Phase 1

const Dashboard = () => {
	// ==========================================
	// 🧠 LOGIC ENGINE
	// ==========================================

	// A. Time Calculation
	const dayNumber = getDayNumber();
	const currentDate = getFormattedDate();
	const daysRemaining = 365 - dayNumber;

	// B. Local State for "Day 1" Interaction
	// (In Phase 3, we will save this to Firebase. For now, it resets on reload)
	const [selectedIds, setSelectedIds] = useState([]);

	// C. Scoring Algorithm
	const calculateStats = () => {
		let stats = {
			total: 0,
			health: 0,
			freedom: 0,
			love: 0
		};

		selectedIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				stats.total += item.points;
				// Add to specific bucket
				if (item.category === 'health') stats.health += item.points;
				if (item.category === 'freedom') stats.freedom += item.points;
				if (item.category === 'love') stats.love += item.points;
			}
		});
		return stats;
	};

	const currentStats = calculateStats();

	// D. Interaction Handler
	const toggleItem = (id) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter(itemId => itemId !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	// E. Determine Tier Label
	const getTierLabel = (score) => {
		if (score >= PV_TIERS.zenith.min) return PV_TIERS.zenith.label;
		if (score >= PV_TIERS.fantastic.min) return PV_TIERS.fantastic.label;
		if (score >= PV_TIERS.solid.min) return PV_TIERS.solid.label;
		if (score >= PV_TIERS.good.min) return PV_TIERS.good.label;
		if (score >= PV_TIERS.fair.min) return PV_TIERS.fair.label;
		return "START";
	};

	// ==========================================
	// 🎨 RENDER
	// ==========================================
	return (
		<div className="flex min-h-screen bg-[#0B1120] text-slate-100 font-sans">
			<Sidebar />

			<main className="flex-1 p-4 lg:p-8 overflow-y-auto">
				{/* --- HEADER SECTION --- */}
				<header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

					{/* LEFT: Status Badges */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
							<Shield size={14} />
							<span>Protocol Active</span>
						</div>
						<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider">
							<Activity size={14} />
							<span>{APP_VERSION}</span>
						</div>
					</div>

					{/* CENTER: Date & Day Count */}
					<div className="text-center">
						<h1 className="text-2xl font-bold text-slate-100 tracking-tight">
							{currentDate}
						</h1>
						<div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-1">
							<Calendar size={14} />
							<span>Day {dayNumber} of 365</span>
							<span className="text-slate-600">•</span>
							<span>{daysRemaining} Left</span>
						</div>
					</div>

					{/* RIGHT: Daily PV Widget */}
					<div className="flex items-center gap-4 bg-[#1A2435] p-3 rounded-xl border border-slate-800 shadow-lg">
						<div className="text-right">
							<div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Daily PV</div>
							<div className={`text-2xl font-bold ${currentStats.total < 0 ? 'text-red-400' : 'text-white'}`}>
								{currentStats.total}
							</div>
						</div>
						<div className="h-10 w-px bg-slate-700"></div>
						<div className="text-xs font-bold text-amber-400 tracking-widest">
							{getTierLabel(currentStats.total)}
						</div>
					</div>
				</header>

				{/* --- GAUGES SECTION --- */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					{/* HEALTH GAUGE */}
					<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800/50 flex flex-col items-center">
						<h3 className="text-cyan-400 font-medium tracking-widest text-sm mb-4">HEALTH</h3>
						<ArcGauge value={currentStats.health} max={30} color="#06b6d4" />
						<div className="mt-2 text-slate-400 text-sm">{currentStats.health} pts</div>
					</div>

					{/* FREEDOM GAUGE */}
					<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800/50 flex flex-col items-center">
						<h3 className="text-amber-400 font-medium tracking-widest text-sm mb-4">FREEDOM</h3>
						<ArcGauge value={currentStats.freedom} max={50} color="#f59e0b" />
						<div className="mt-2 text-slate-400 text-sm">{currentStats.freedom} pts</div>
					</div>

					{/* LOVE GAUGE */}
					<div className="bg-[#0f1522] rounded-2xl p-6 border border-slate-800/50 flex flex-col items-center">
						<h3 className="text-rose-400 font-medium tracking-widest text-sm mb-4">LOVE</h3>
						<ArcGauge value={currentStats.love} max={40} color="#ef4444" />
						<div className="mt-2 text-slate-400 text-sm">{currentStats.love} pts</div>
					</div>
				</section>

				{/* --- INPUT MODULE (The Menu) --- */}
				<section>
					<h2 className="text-xl font-light text-slate-300 mb-6 flex items-center gap-2">
						<Zap size={20} className="text-yellow-500" />
						<span>Input Stream</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{MASTER_LIBRARY.filter(t => t.status === 'active').map((task) => {
							const isSelected = selectedIds.includes(task.id);

							// Color Logic based on Category
							let borderClass = isSelected
								? (task.category === 'health' ? 'border-cyan-500 bg-cyan-950/20'
									: task.category === 'freedom' ? 'border-amber-500 bg-amber-950/20'
									: 'border-rose-500 bg-rose-950/20')
								: 'border-slate-800 hover:border-slate-700 bg-[#0f1522]';

							return (
								<div
									key={task.id}
									onClick={() => toggleItem(task.id)}
									className={`p-4 rounded-xl border transition-all cursor-pointer group select-none ${borderClass}`}
								>
									<div className="flex justify-between items-start">
										<div>
											<div className={`font-medium ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
												{task.label}
											</div>
											{task.notes && (
												<div className="text-xs text-slate-600 mt-1">{task.notes}</div>
											)}
										</div>
										<div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
											{task.points > 0 ? '+' : ''}{task.points}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</section>

			</main>
		</div>
	);
};

export default Dashboard;
