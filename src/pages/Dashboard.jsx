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
	const currentDate = rawDate.replace(/\//g, '-'); // Sanitize path

	const pageConfig = getNavConfig('dashboard');
	const PageIcon = pageConfig?.icon;

	// --- STATE ---
	const [loading, setLoading] = useState(true);
	const [isOfflineMode, setIsOfflineMode] = useState(false);
	const [dataSource, setDataSource] = useState('Checking...');

	// Data Containers
	const [coreTasks, setCoreTasks] = useState([]);
	const [flexTasks, setFlexTasks] = useState([]);
	const [protocols, setProtocols] = useState([]);
	const [stats, setStats] = useState({ total: 0, love: 0, health: 0, freedom: 0 });

	// Modal State
	const [showGreeting, setShowGreeting] = useState(false);

	// --- DATA LOADING ENGINE ---
	useEffect(() => {
		// 1. TRY LOCAL BACKUP FIRST (Anti-Fragile)
		const localKey = `dailyLog_${currentDate}_backup`;
		const localBackup = localStorage.getItem(localKey);

		if (localBackup) {
			try {
				console.log("Loading from Local Backup");
				const parsed = JSON.parse(localBackup);
				loadDashboardFromData(parsed);
				setDataSource('Local Backup');
				setIsOfflineMode(true);
				setLoading(false);
			} catch (e) {
				console.error("Local backup corrupted", e);
			}
		}

		// 2. LISTEN TO CLOUD (If allowed)
		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				// Correct Path: users/{uid}/dailyLogs/{date}
				const docRef = doc(db, "users", user.uid, "dailyLogs", currentDate);

				const unsubSnapshot = onSnapshot(docRef, (docSnap) => {
					if (docSnap.exists()) {
						console.log("Cloud Data Found");
						loadDashboardFromData(docSnap.data());
						setDataSource('Cloud Sync');
						setIsOfflineMode(false);
						setLoading(false);
					} else {
						// Doc doesn't exist yet (User hasn't done greeting)
						if (!localBackup) {
							setLoading(false);
							setDataSource('No Data Found');
						}
					}
				}, (err) => {
					console.warn("Cloud Sync Blocked:", err.message);
					if (!localBackup) {
						setLoading(false);
						setDataSource('Connection Blocked');
					}
				});
				return () => unsubSnapshot();
			} else {
				if (!localBackup) setLoading(false);
			}
		});

		return () => unsubscribeAuth();
	}, [currentDate]);

	// HELPER: Hydrate State
	const loadDashboardFromData = (data) => {
		if (!data) return;

		if (data.plannedTasks) {
			setCoreTasks(data.plannedTasks.core || []);
			setFlexTasks(data.plannedTasks.flex || []);
		}
		if (data.protocolProgress) {
			setProtocols(data.protocolProgress || []);
		}

		// Recalculate Stats if they exist, or default to 0
		// (In a real app, you'd calc this from completed tasks)
		// For now, just placeholder
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

			{/* --- THE GUARDIAN GATE (MODAL) --- */}
			{showGreeting && (
				<GuardianGreeting onComplete={() => {
					setShowGreeting(false);
					window.location.reload(); // Reload to fetch the newly saved data
				}} />
			)}

			{/* --- HEADER --- */}
			<PageHeader
				icon={PageIcon}
				title={
					<div className="flex items-center gap-3">
						<span>{getTimeBasedGreeting()}, <span className="text-blue-500">Architect</span></span>
						<button onClick={handleManualIgnition} className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30" title="Re-open Planning">
							<Sun size={18} />
						</button>
					</div>
				}
				subtitle={
					<div className="flex items-center gap-3">
						<span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs border border-slate-700 text-slate-400">Day {dayNumber}</span>
						<span className="text-slate-600">•</span>
						<span className="text-slate-400 text-xs">{currentDate}</span>
						{isOfflineMode && (
							<span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
								<CloudOff size={10} /> OFFLINE
							</span>
						)}
					</div>
				}
			/>

			{/* --- MAIN DASHBOARD LAYOUT (60/40 Split) --- */}
			<div className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto custom-scrollbar">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

					{/* LEFT COLUMN: CORE 3 (60%) */}
					<div className="lg:col-span-7 flex flex-col gap-6">

						{/* CORE 3 HEADER */}
						<div className="flex items-center gap-2 pb-2 border-b border-slate-800">
							<div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
								<Zap size={16} />
							</div>
							<h2 className="text-sm font-bold text-white uppercase tracking-widest">Core Priorities</h2>
						</div>

						{/* CORE TASK CARDS */}
						<div className="flex flex-col gap-3">
							{coreTasks.length > 0 ? coreTasks.map((task, index) => (
								<div key={index} className="bg-[#1A2435] border border-slate-700 hover:border-blue-500/50 rounded-xl p-5 transition-all group cursor-pointer shadow-lg">
									<div className="flex justify-between items-start">
										<div className="flex items-start gap-4">
											{/* Custom Checkbox */}
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
									<p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
										No core tasks found for today. Initialize your Guardian Protocol to set your targets.
									</p>
									<button
										onClick={handleManualIgnition}
										className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mx-auto"
									>
										<Sun size={18} /> Launch Planner
									</button>
								</div>
							)}
						</div>

					</div>

					{/* RIGHT COLUMN: PROTOCOLS & FLEX (40%) */}
					<div className="lg:col-span-5 flex flex-col gap-8">

						{/* PROTOCOLS */}
						<div className="bg-[#0f1522] border border-slate-800 rounded-2xl p-5 shadow-lg">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
									<Repeat size={14} /> Active Protocols
								</h3>
							</div>

							<div className="flex flex-col gap-2">
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
										<div className="text-xs font-bold text-slate-500">
											0/{proto.totalHabits}
										</div>
									</div>
								)) : (
									<div className="text-xs text-slate-500 italic p-2 text-center">
										No protocols active.
									</div>
								)}
							</div>
						</div>

						{/* FLEX TASKS */}
						<div>
							<div className="flex items-center gap-2 mb-3">
								<Activity size={14} className="text-amber-500" />
								<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flex Tasks</h3>
							</div>
							<div className="flex flex-col gap-2">
								{flexTasks.length > 0 ? flexTasks.map((task, i) => (
									<div key={i} className="flex items-center gap-3 p-3 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-[#1A2435]/30 transition-colors cursor-pointer bg-[#0f1522]">
										<div className="w-4 h-4 border-2 border-slate-600 rounded-md"></div>
										<span className="text-sm text-slate-300 font-medium truncate">{task.name}</span>
										<span className="ml-auto text-xs text-slate-500 font-mono">{task.duration}m</span>
									</div>
								)) : (
									<div className="text-xs text-slate-600 italic p-2 text-center border border-dashed border-slate-800 rounded-lg">
										No flex tasks.
									</div>
								)}
							</div>
						</div>

					</div>

				</div>
			</div>

			{/* DEBUG FOOTER (Temporary) */}
			<div className="absolute bottom-1 right-1 text-[9px] font-mono text-slate-700 bg-black/50 px-2 rounded pointer-events-none">
				SRC: {dataSource} | ID: {currentDate}
			</div>
		</div>
	);
};

export default Dashboard;
