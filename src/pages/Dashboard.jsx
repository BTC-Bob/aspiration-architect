// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
	Shield, Activity, Calendar, Zap, CheckCircle, Clock, Plus,
	Repeat, CheckSquare, Sun, ExternalLink, AlertTriangle, CloudOff, Database
} from 'lucide-react';
import { getDayNumber, getFormattedDate } from '../utils/dateHelpers';
import ArcGauge from '../components/ArcGauge';
import GuardianGreeting from '../components/GuardianGreeting';
import PageHeader from '../components/PageHeader';
import { getNavConfig } from '../config';

// FIRESTORE IMPORTS
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const Dashboard = () => {
	const dayNumber = getDayNumber();
	const rawDate = getFormattedDate();
	const currentDate = rawDate.replace(/\//g, '-');

	const pageConfig = getNavConfig('dashboard');
	const PageIcon = pageConfig?.icon;

	// --- STATE ---
	const [loading, setLoading] = useState(true);
	const [isOfflineMode, setIsOfflineMode] = useState(false);
	const [dataSource, setDataSource] = useState('Checking...');
	const [showGreeting, setShowGreeting] = useState(false);

	// Data Containers
	const [coreTasks, setCoreTasks] = useState([]);
	const [flexTasks, setFlexTasks] = useState([]);
	const [protocols, setProtocols] = useState([]);

	// Pillar Stats
	const [stats, setStats] = useState({
		love: 0, health: 0, freedom: 0,
		total: 0, target: 75
	});

	// Mock Schedule
	const schedule = [
		{ id: 1, time: '2:00 PM', title: 'Deep Work Session' }
	];

	// --- DATA LOADING ENGINE ---
	useEffect(() => {
		// 1. LOCAL BACKUP (Immediate Load)
		const localKey = `dailyLog_${currentDate}_backup`;
		const localBackup = localStorage.getItem(localKey);

		if (localBackup) {
			try {
				const parsed = JSON.parse(localBackup);
				loadDashboardFromData(parsed);
				setDataSource('Local Backup');
				setIsOfflineMode(true); // Force badge visible initially
				setLoading(false);
			} catch (e) { console.warn("Local backup corrupted"); }
		}

		// 2. CLOUD SYNC
		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				const docRef = doc(db, "users", user.uid, "dailyLogs", currentDate);
				const unsubSnapshot = onSnapshot(docRef, (docSnap) => {
					if (docSnap.exists()) {
						console.log("Cloud Data Sync Active");
						loadDashboardFromData(docSnap.data());
						setDataSource('Cloud Sync');
						setIsOfflineMode(false); // Cloud confirmed!
						setLoading(false);
					}
				}, (err) => {
					console.warn("Cloud Blocked:", err.message);
					// If error occurs, ensure offline mode stays TRUE
					if (localBackup) setIsOfflineMode(true);
				});
				return () => unsubSnapshot();
			} else {
				if (!localBackup) setLoading(false);
			}
		});

		return () => unsubscribeAuth();
	}, [currentDate]);

	// HELPER: Hydrate & Calculate Stats
	const loadDashboardFromData = (data) => {
		if (!data) return;

		const core = data.plannedTasks?.core || [];
		const flex = data.plannedTasks?.flex || [];
		const protos = data.protocolProgress || [];

		setCoreTasks(core);
		setFlexTasks(flex);
		setProtocols(protos);

		let newStats = { love: 0, health: 0, freedom: 0, total: 0, target: 75 };
		[...core, ...flex].forEach(task => {
			if (task.pillarDistribution) {
				newStats.love += (task.pillarDistribution.l || 0) * (task.duration/30 * 5);
				newStats.health += (task.pillarDistribution.h || 0) * (task.duration/30 * 5);
				newStats.freedom += (task.pillarDistribution.f || 0) * (task.duration/30 * 5);
			} else {
				if (task.categoryId?.includes('spiritual') || task.categoryId?.includes('relationship')) newStats.love += 5;
				else if (task.categoryId?.includes('exercise') || task.categoryId?.includes('sleep')) newStats.health += 5;
				else newStats.freedom += 5;
			}
		});
		newStats.total = newStats.love + newStats.health + newStats.freedom;
		setStats(newStats);
	};

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

	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col relative">

			{/* MODAL */}
			{showGreeting && (
				<GuardianGreeting onComplete={() => {
					setShowGreeting(false);
					window.location.reload();
				}} />
			)}

			{/* --- HEADER --- */}
			<PageHeader
				icon={PageIcon}
				title={
					<div className="flex items-center gap-3">
						<span>{getTimeBasedGreeting()}, <span className="text-blue-500">Architect</span></span>
						<button onClick={handleManualIgnition} className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30">
							<Sun size={18} />
						</button>
					</div>
				}
				subtitle={
					<div className="flex items-center gap-3">
						<span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs border border-slate-700 text-slate-400">Day {dayNumber}</span>
						<span className="text-slate-600">•</span>
						<span className="text-slate-400 text-xs">{currentDate}</span>

						{/* RESTORED: LOCAL MODE BADGE */}
						{isOfflineMode && (
							<span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-wide uppercase" title="Data read from Local Storage">
								<Database size={10} /> LOCAL MODE
							</span>
						)}
					</div>
				}
				actions={
					<>
						{/* SMART STACK (Schedule) */}
						<div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-[#1A2435] border border-slate-700 shadow-lg cursor-pointer hover:bg-slate-800 transition-colors group">
							<div className="relative">
								<div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
								<Calendar size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
							</div>
							<div className="flex flex-col gap-0.5">
								<div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
									UP NEXT • {schedule[0].time}
								</div>
								<div className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors max-w-[140px] truncate">
									{schedule[0].title}
								</div>
							</div>
						</div>

						{/* TOTAL SCORE */}
						<div className="flex items-center gap-4 pl-4 border-l border-slate-700">
							<div className="text-right hidden sm:block">
								<div className="text-[10px] text-slate-500 uppercase font-bold">Daily Target</div>
								<div className="text-xs font-bold text-amber-400">START</div>
							</div>
							<div className="text-3xl font-bold text-white tabular-nums tracking-tight">
								{Math.round(stats.total)} <span className="text-lg text-slate-600">/ 75</span>
							</div>
						</div>
					</>
				}
			/>

			<div className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto custom-scrollbar">
				<div className="max-w-7xl mx-auto flex flex-col gap-8">

					{/* --- PILLAR GAUGES --- */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<ArcGauge
							value={stats.love} max={25} color="#ef4444" label="LOVE & FAMILY" subLabel="Status"
							gradientFrom="from-[#1e1b2e]" gradientTo="to-[#0f172a]"
						/>
						<ArcGauge
							value={stats.health} max={25} color="#06b6d4" label="HEALTH & BODY" subLabel="Status"
							gradientFrom="from-[#0f2231]" gradientTo="to-[#0f172a]"
						/>
						<ArcGauge
							value={stats.freedom} max={25} color="#f59e0b" label="FREEDOM & FINANCE" subLabel="Status"
							gradientFrom="from-[#1f1e1b]" gradientTo="to-[#0f172a]"
						/>
					</div>

					{/* --- MAIN GRID (60/40 Split) --- */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

						{/* LEFT: CORE 3 */}
						<div className="lg:col-span-7 flex flex-col gap-6">

							{/* HEADER: Matched Icon Style */}
							<div className="flex items-center gap-3 pb-3 border-b border-slate-800">
								<div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
									<Zap size={18} />
								</div>
								<h2 className="text-sm font-bold text-white uppercase tracking-widest">Core Priorities</h2>
							</div>

							<div className="flex flex-col gap-3">
								{coreTasks.length > 0 ? coreTasks.map((task, index) => (
									<div key={index} className="bg-[#1A2435] border border-slate-700 hover:border-blue-500/50 rounded-xl p-5 transition-all group cursor-pointer shadow-lg">
										<div className="flex justify-between items-start">
											<div className="flex items-start gap-4">
												<div className="mt-1 w-6 h-6 rounded-lg border-2 border-slate-600 group-hover:border-blue-500 flex items-center justify-center transition-colors">
													<div className="w-3 h-3 bg-blue-500 rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
												</div>
												<div>
													<h3 className="text-lg font-bold text-white leading-tight mb-1">{task.name}</h3>
													<div className="flex items-center gap-3">
														<span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase tracking-wider">
															{task.valueTier}
														</span>
														{task.category && (
															<span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-2 py-0.5 rounded">
																{task.category}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-xl font-bold text-slate-200 font-mono">{task.duration}m</div>
												<div className="text-[10px] font-bold text-slate-500 uppercase">Duration</div>
											</div>
										</div>
									</div>
								)) : (
									<div className="p-10 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-[#0B1120]">
										<div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
											<Zap size={32} className="text-slate-600" />
										</div>
										<h3 className="text-lg font-bold text-white mb-2">Ready to Plan?</h3>
										<button onClick={handleManualIgnition} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mx-auto">
											<Sun size={18} /> Launch Planner
										</button>
									</div>
								)}
							</div>
						</div>

						{/* RIGHT: PROTOCOLS & FLEX */}
						<div className="lg:col-span-5 flex flex-col gap-8">

							{/* PROTOCOLS SECTION */}
							<div>
								{/* HEADER: Matched Style (Outside Card) */}
								<div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
									<div className="p-2 bg-slate-800/80 rounded-lg text-slate-400">
										<Repeat size={18} />
									</div>
									<h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Protocols</h3>
								</div>

								{/* CONTENT CARD */}
								<div className="bg-[#0f1522] border border-slate-800 rounded-2xl p-2 shadow-lg">
									<div className="flex flex-col gap-1">
										{protocols.length > 0 ? protocols.map((proto, i) => (
											<div key={i} className="bg-[#1A2435]/50 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between hover:bg-[#1A2435] transition-colors cursor-pointer">
												<div className="flex items-center gap-3">
													<div className="text-xl">{proto.icon || '⚡'}</div>
													<div>
														<div className="text-sm font-bold text-slate-200">{proto.name}</div>
														<div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
															<div className="h-full bg-blue-500 w-[10%]"></div>
														</div>
													</div>
												</div>
												<div className="text-xs font-bold text-slate-500">0/{proto.totalHabits}</div>
											</div>
										)) : (
											<div className="text-xs text-slate-500 italic p-4 text-center">No protocols active.</div>
										)}
									</div>
								</div>
							</div>

							{/* FLEX TASKS SECTION */}
							<div>
								{/* HEADER: Matched Style */}
								<div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
									<div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
										<Activity size={18} />
									</div>
									<h3 className="text-sm font-bold text-white uppercase tracking-widest">Flex Tasks</h3>
								</div>

								<div className="flex flex-col gap-2">
									{flexTasks.length > 0 ? flexTasks.map((task, i) => (
										<div key={i} className="flex items-center gap-3 p-3 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-[#1A2435]/30 transition-colors cursor-pointer bg-[#0f1522]">
											<div className="w-4 h-4 border-2 border-slate-600 rounded-md"></div>
											<span className="text-sm text-slate-300 font-medium truncate">{task.name}</span>
											<span className="ml-auto text-xs text-slate-500 font-mono">{task.duration}m</span>
										</div>
									)) : (
										<div className="text-xs text-slate-600 italic p-4 text-center border-2 border-dashed border-slate-800 rounded-xl">No flex tasks.</div>
									)}
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
