// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Calendar, Zap, CheckCircle, Clock, Plus, Repeat, CheckSquare, Sun, ExternalLink } from 'lucide-react';
import { MASTER_LIBRARY } from '../data/master_library';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';
import ArcGauge from '../components/ArcGauge';
import GuardianGreeting from '../components/GuardianGreeting';
import PageHeader from '../components/PageHeader';
import { getNavConfig } from '../config';
// NEW: FIRESTORE IMPORTS
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const Dashboard = () => {
	const dayNumber = getDayNumber();
	const currentDate = getFormattedDate();

	// --- CONFIGURATION ---
	const pageConfig = getNavConfig('dashboard');
	const PageIcon = pageConfig?.icon;

	// --- SCHEDULE LOGIC (REAL-TIME CLOUD SYNC) ---
	const [schedule, setSchedule] = useState([]);

	useEffect(() => {
		// Listen for Auth to establish Firestore Connection
		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				// REAL-TIME LISTENER: Updates instantly when Settings change
				const unsubSnapshot = onSnapshot(doc(db, "users", user.uid), (doc) => {
					if (doc.exists() && doc.data().schedule) {
						const activeEvents = doc.data().schedule.filter(e => e.title && e.title.trim() !== '');
						setSchedule(activeEvents.length > 0 ? activeEvents : getDefaultMock());
					} else {
						setSchedule(getDefaultMock());
					}
				});
				return () => unsubSnapshot();
			} else {
				// Fallback if logged out
				setSchedule(getDefaultMock());
			}
		});

		return () => unsubscribeAuth();
	}, []);

	// Default data if nothing in cloud
	const getDefaultMock = () => [
		{ id: 1, time: '09:15 AM', title: "Jenda's Dental Appointment" }
	];

	// LINK HANDLER: Opens Google Calendar to the Specific Day
	const handleOpenCalendar = () => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = now.getMonth() + 1;
		const dd = now.getDate();
		// "Google Bridge": Frictionless access to the day's events/maps
		window.open(`https://calendar.google.com/calendar/r/day/${yyyy}/${mm}/${dd}`, '_blank');
	};

	// --- GUARDIAN GATE LOGIC ---
	const [showGreeting, setShowGreeting] = useState(() => {
		const hasCheckedIn = localStorage.getItem(`checkin_${currentDate}`);
		return !hasCheckedIn;
	});

	const handleManualIgnition = () => {
		setShowGreeting(true);
	};

	const getTimeBasedGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 5) return 'Good late night';
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	};
	const greeting = getTimeBasedGreeting();

	// --- TASK LOGIC ---
	const [focusIds, setFocusIds] = useState([]);
	const [completedIds, setCompletedIds] = useState([]);

	const addToFocus = (id) => {
		if (focusIds.length < 9 && !focusIds.includes(id)) {
			setFocusIds([...focusIds, id]);
		}
	};

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

	const calculateTimeBudget = () => {
		let totalMinutes = 0;
		focusIds.forEach(id => {
			const item = MASTER_LIBRARY.find(t => t.id === id);
			if (item) {
				totalMinutes += (item.duration || 15);
			}
		});
		const hours = Math.floor(totalMinutes / 60);
		const mins = totalMinutes % 60;
		return `${hours}h ${mins}m`;
	};
	const timeBudget = calculateTimeBudget();

	const getTierLabel = (score) => {
		if (score >= 35) return "ZENITH";
		if (score >= 20) return "NOBLE";
		if (score >= 12) return "GREAT";
		if (score >= 6) return "GOOD";
		if (score >= 3) return "FAIR";
		return "START";
	};

	const getAvailableItems = (pillar) => {
		return MASTER_LIBRARY
			.filter(item => {
				const cats = item.categories || [item.category];
				return cats.includes(pillar) && item.status === 'active' && !focusIds.includes(item.id);
			})
			.sort((a, b) => b.points - a.points)
			.slice(0, 10);
	};

	const getFocusItemsByPillar = (pillar) => {
		return focusIds
			.map(id => MASTER_LIBRARY.find(t => t.id === id))
			.filter(item => item && (item.categories || [item.category]).includes(pillar));
	};

	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col relative">

			{/* --- THE GUARDIAN GATE (MODAL) --- */}
			{showGreeting && (
				<GuardianGreeting onComplete={() => setShowGreeting(false)} />
			)}

			{/* --- MODULAR HEADER --- */}
			<PageHeader
				icon={PageIcon}
				title={
					<div className="flex items-center gap-3">
						<span>{greeting}, <span className="text-blue-500">Architect</span></span>
						<button onClick={handleManualIgnition} className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30">
							<Sun size={18} />
						</button>
					</div>
				}
				subtitle={
					<div className="flex items-center gap-2">
						<span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs border border-slate-700">Day {dayNumber}</span>
						<span>•</span>
						<span>{currentDate}</span>
					</div>
				}
				actions={
					<>
						{/* EST FOCUS */}
						<div className="hidden xl:flex flex-col items-end">
							<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Focus Time</div>
							<div className="text-sm font-bold text-blue-400 flex items-center gap-1">
								<Clock size={14} /> {timeBudget}
							</div>
						</div>

						{/* --- SMART STACK: DYNAMIC CLOUD HUD --- */}
						<div
							onClick={handleOpenCalendar}
							className={`hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-[#1A2435] border border-slate-700 shadow-lg cursor-pointer hover:bg-slate-800 transition-colors group ${schedule.length > 1 ? 'h-full' : ''}`}
						>
							{schedule.length > 1 ? (
								/* --- MULTI-EVENT VIEW (COMPACT STACK) --- */
								<div className="flex items-center gap-4">
									<div className="relative">
										<div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute -top-1 -right-1 animate-ping"></div>
										<Calendar size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
									</div>
									<div className="flex flex-col gap-0.5">
										<div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
											TODAY'S SCHEDULE ({schedule.length})
										</div>
										<div className="flex flex-col">
											{schedule.map(evt => (
												<div key={evt.id} className="flex items-center gap-2 text-[10px] leading-tight">
													<span className="font-mono text-blue-400">{evt.time}</span>
													<span className="text-slate-300 font-medium truncate max-w-[140px]">{evt.title}</span>
												</div>
											))}
										</div>
									</div>
									<ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 ml-1" />
								</div>
							) : (
								/* --- SINGLE EVENT VIEW (LARGE) --- */
								<>
									<div className="relative">
										<div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 animate-ping"></div>
										<Calendar size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
									</div>
									<div className="flex flex-col leading-none">
										<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
											Up Next • {schedule[0].time}
										</span>
										<span className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors">
											{schedule[0].title}
										</span>
									</div>
								</>
							)}
						</div>

						{/* TOTAL POINTS */}
						<div className="flex items-center gap-4 pl-4 border-l border-slate-700">
							<div className="text-right hidden sm:block">
								<div className="text-[10px] text-slate-500 uppercase font-bold">Daily Total</div>
								<div className="text-xs font-bold text-amber-400">{getTierLabel(currentStats.total)}</div>
							</div>
							<div className="text-3xl font-bold text-white tabular-nums tracking-tight">
								{Number.isInteger(currentStats.total) ? currentStats.total : currentStats.total.toFixed(1)}
							</div>
						</div>
					</>
				}
			/>

			{/* --- SWIMLANES (Unchanged) --- */}
			<div className="flex-1 min-h-0 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
				<Swimlane
					pillar="love" color="#ef4444" label="LOVE & FAMILY"
					gaugeVal={currentStats.love} gaugeMax={15}
					availableItems={getAvailableItems('love')}
					focusItems={getFocusItemsByPillar('love')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Zap size={12} />}
					gradientFrom="from-[#1e1b2e]" gradientTo="to-[#0f172a]"
				/>
				<Swimlane
					pillar="health" color="#06b6d4" label="HEALTH & BODY"
					gaugeVal={currentStats.health} gaugeMax={15}
					availableItems={getAvailableItems('health')}
					focusItems={getFocusItemsByPillar('health')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Activity size={12} />}
					gradientFrom="from-[#0f2231]" gradientTo="to-[#0f172a]"
				/>
				<Swimlane
					pillar="freedom" color="#f59e0b" label="FREEDOM & FINANCE"
					gaugeVal={currentStats.freedom} gaugeMax={15}
					availableItems={getAvailableItems('freedom')}
					focusItems={getFocusItemsByPillar('freedom')}
					completedIds={completedIds}
					onAddToFocus={addToFocus}
					onToggleComplete={toggleComplete}
					icon={<Shield size={12} />}
					gradientFrom="from-[#1f1e1b]" gradientTo="to-[#0f172a]"
				/>
			</div>
		</div>
	);
};

// SUB-COMPONENT: SWIMLANE (Unchanged)
const Swimlane = ({ pillar, color, label, gaugeVal, gaugeMax, availableItems, focusItems, completedIds, onAddToFocus, onToggleComplete, icon, gradientFrom, gradientTo }) => {
	const slots = [0, 1, 2];
	return (
		<div className="flex flex-col gap-6 h-full min-h-0">
			<ArcGauge
				value={Number.isInteger(gaugeVal) ? gaugeVal : parseFloat(gaugeVal.toFixed(1))}
				max={gaugeMax} color={color} label={label} subLabel="Status"
				gradientFrom={gradientFrom} gradientTo={gradientTo}
			/>
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
											<div className={`p-1 rounded ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
												{item.type === 'habit' ? <Repeat size={10} /> : <CheckSquare size={10} />}
											</div>
											<div>
												<div className={`text-xs font-bold ${isDone ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>{item.label}</div>
												<div className="flex items-center gap-2 mt-0.5">
													<span className={`text-[10px] flex items-center gap-1 ${item.duration === 0 ? 'text-emerald-500 font-bold' : 'text-slate-500'}`}>
														{item.duration === 0 ? <Zap size={8} /> : <Clock size={8} />}
														{item.duration === 0 ? 'PASSIVE' : `${item.duration}m`}
													</span>
												</div>
											</div>
										</div>
										<div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
											+{item.points}
										</div>
									</div>
								</div>
							);
						} else {
							return (
								<div key={`empty-${index}`} className="h-[58px] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center">
									<Plus size={14} className="text-slate-700" />
								</div>
							);
						}
					})}
				</div>
			</div>
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
