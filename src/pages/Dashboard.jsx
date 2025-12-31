import React, { useState, useEffect } from 'react';
import {
	Shield, Calendar, ArrowRight, CheckCircle2, Activity, Heart, DollarSign, Zap, BookOpen, AlertTriangle
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import ArcGauge from '../components/ArcGauge';

function Dashboard() {
	const navigate = useNavigate();
	const [username] = useLocalStorage('guardian_username', 'Architect');

	// --- STATE: TASKS ---
	const [tasks, setTasks] = useLocalStorage('guardian_tactical_tasks', [
		{ id: 1, text: "Schedule Mom's Cardiology Appt", category: "LOVE", pv: 10, impact: "HIGH", completed: false },
		{ id: 2, text: "Complete CNA Packet Website", category: "FREEDOM", pv: 10, impact: "HIGH", completed: false },
		{ id: 3, text: "Review Monthly Budget", category: "FREEDOM", pv: 3, impact: "LOW", completed: false },
		{ id: 4, text: "Prepare Meal Plan for Week", category: "HEALTH", pv: 5, impact: "MED", completed: true },
	]);

	const [newTaskText, setNewTaskText] = useState('');

	// --- STATE: CALENDAR ---
	const [events, setEvents] = useState([]);
	const [calendarError, setCalendarError] = useState(null);
	const [isSyncing, setIsSyncing] = useState(true);

	// --- LOGIC: FETCH GOOGLE CALENDAR ---
	useEffect(() => {
		const fetchCalendar = async () => {
			const token = localStorage.getItem('google_access_token');

			if (!token) {
				setCalendarError("Auth Token Missing");
				setIsSyncing(false);
				return;
			}

			try {
				const now = new Date();
				// 1. HORIZON FIX: Look 7 days ahead, not just today
				const timeMin = new Date(now).toISOString();
				const future = new Date(now);
				future.setDate(now.getDate() + 7);
				const timeMax = future.toISOString();

				const response = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
					{
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					}
				);

				if (!response.ok) throw new Error("Sync Failed");

				const data = await response.json();

				const formattedEvents = data.items.map(item => {
					// Date Logic for Smart Badges
					const eventDate = new Date(item.start.dateTime || item.start.date); // Handle all-day events too
					const today = new Date();
					const tomorrow = new Date(today);
					tomorrow.setDate(tomorrow.getDate() + 1);

					let dateLabel = "DATE";
					if (eventDate.toDateString() === today.toDateString()) dateLabel = "TODAY";
					else if (eventDate.toDateString() === tomorrow.toDateString()) dateLabel = "TMRW";
					else dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

					return {
						id: item.id,
						title: item.summary || "Untitled Event",
						time: item.start.dateTime
							? new Date(item.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
							: "All Day",
						dateLabel: dateLabel, // New Smart Label
						location: item.location || ""
					};
				});

				setEvents(formattedEvents);
				setCalendarError(null);
			} catch (err) {
				console.error("Calendar Error:", err);
				setCalendarError("Offline");
			} finally {
				setIsSyncing(false);
			}
		};

		fetchCalendar();
	}, []);

	const toggleTask = (id) => {
		setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
	};

	const addTask = (e) => {
		if (e.key === 'Enter' && newTaskText.trim()) {
			const newTask = {
				id: Date.now(),
				text: newTaskText,
				category: "GENERAL",
				pv: 5,
				impact: "MED",
				completed: false
			};
			setTasks([...tasks, newTask]);
			setNewTaskText('');
		}
	};

	const totalPv = tasks.reduce((acc, t) => t.completed ? acc + t.pv : acc, 0);

	return (
		<div className="w-full h-full flex flex-col space-y-8 max-w-[1600px] mx-auto pb-10">

			{/* --- HEADER --- */}
			<div className="relative flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-6">

				{/* 1. LEFT: Protocol Status Indicators (DUAL BADGE SYSTEM) */}
				<div className="w-full md:w-1/4 flex flex-col space-y-2">

						{/* Badge 1: Identity/Security Status */}
						<span className="w-fit bg-blue-900/30 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-800 flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
								Guardian Protocol Active
						</span>

						{/* Badge 2: Data Stream Status (RESTORED & MATCHED) */}
						{calendarError ? (
								<span className="w-fit bg-red-900/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full border border-red-800 flex items-center gap-2">
									<Activity size={12} className="animate-pulse" />
									Sync Offline
								</span>
						) : (
								<span className="w-fit bg-emerald-900/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-800 flex items-center gap-2">
									<Activity size={12} />
									Live Sync
								</span>
						)}
				</div>

				{/* 2. CENTER: Greeting */}
				<div className="w-full md:w-2/4 text-center md:absolute md:left-1/2 md:-translate-x-1/2">
					<h1 className="text-4xl font-bold text-white tracking-tight">
						Good morning, <span className="text-blue-500">{username}</span>
					</h1>
					<p className="text-slate-400 mt-2 text-sm max-w-lg mx-auto">
						Mom's Physical Therapy is coming up at 10:00 AM. Let's clear the deck before then.
					</p>
				</div>

				{/* 3. RIGHT: PV Gauge (#1A2435) */}
				<div className="w-full md:w-1/4 flex justify-end">
						 <div className="bg-[#1A2435] p-3 pr-5 pl-5 rounded-2xl border border-slate-700/50 flex items-center space-x-4 shadow-lg min-w-[160px]">
								<div className="flex-1">
									 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Daily PV</p>
									 <div className="flex items-baseline space-x-1">
											<span className="text-3xl font-bold text-white leading-none">{totalPv}</span>
											<span className="text-xs text-slate-500 font-medium">/ 50</span>
									 </div>
								</div>
								<div className="h-10 w-2 bg-slate-800/50 rounded-full overflow-hidden flex flex-col-reverse">
									 <div className="bg-blue-500 w-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ height: `${Math.min((totalPv/50)*100, 100)}%` }}></div>
								</div>
						 </div>
				</div>
			</div>

			{/* --- THREE PILLARS --- */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				 <ArcGauge
						value={0} max={10} color="#ef4444" label="Love & Family" subLabel="Connection Needed"
						gradientFrom="from-[#1e1b2e]" gradientTo="to-[#0f172a]"
				 />
				 <ArcGauge
						value={5} max={10} color="#06b6d4" label="Health & Body" subLabel="Maintenance Required"
						gradientFrom="from-[#0f2231]" gradientTo="to-[#0f172a]"
				 />
				 <ArcGauge
						value={0} max={10} color="#f59e0b" label="Freedom & Finance" subLabel="Action Required"
						gradientFrom="from-[#1f1e1b]" gradientTo="to-[#0f172a]"
				 />
			</div>

			{/* --- MAIN CONTENT GRID --- */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

				{/* LEFT COLUMN: TACTICAL PRIORITIES */}
				<div className="lg:col-span-2 space-y-6">
					 <div className="flex items-center justify-between">
							<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tactical Priorities</h3>
							<div className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">{tasks.filter(t => !t.completed).length} Active Tasks</div>
					 </div>

					 <div className="space-y-3">
							{tasks.map(task => (
								 <div
									 key={task.id}
									 onClick={() => toggleTask(task.id)}
									 className={`group relative overflow-hidden bg-[#0f1522] border ${task.completed ? 'border-slate-800 opacity-50' : 'border-slate-800 hover:border-blue-500/50'} p-5 rounded-xl cursor-pointer transition-all duration-200`}
								 >
										<div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/5 transition-all duration-500"></div>

										<div className="flex items-center justify-between relative z-10">
											 <div className="flex items-center space-x-4">
													<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-600 group-hover:border-blue-500'}`}>
														 {task.completed && <CheckCircle2 size={14} className="text-slate-900" />}
													</div>
													<div>
														 <p className={`font-medium text-lg ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.text}</p>
														 <div className="flex items-center space-x-3 mt-1">
																<span className={`text-[10px] font-bold uppercase tracking-wider ${
																		task.category === 'LOVE' ? 'text-red-400' :
																		task.category === 'HEALTH' ? 'text-cyan-400' :
																		task.category === 'FREEDOM' ? 'text-amber-400' : 'text-slate-400'
																}`}>
																		{task.category}
																</span>
																<span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">+{task.pv} PV</span>
																{task.impact === 'HIGH' && (
																		<span className="flex items-center text-[10px] text-yellow-500 font-bold">
																				<Zap size={10} className="mr-1 fill-yellow-500" /> HIGH IMPACT
																		</span>
																)}
														 </div>
													</div>
											 </div>
									</div>
								 </div>
							))}
					 </div>

					 {/* Input */}
					 <div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								 <span className="text-slate-500 text-xl">+</span>
							</div>
							<input
								 type="text"
								 value={newTaskText}
								 onChange={(e) => setNewTaskText(e.target.value)}
								 onKeyDown={addTask}
								 placeholder="Input tactical command..."
								 className="w-full bg-[#0f1522] border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-mono shadow-inner"
							/>
					 </div>
				</div>

				{/* RIGHT COLUMN: STRATEGIC OUTLOOK */}
				<div className="space-y-6">
					 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategic Outlook</h3>

					 {/* UPCOMING WIDGET */}
					 <div className="bg-[#0f1522] border border-slate-800 rounded-2xl p-0 overflow-hidden">
							<div className="bg-slate-800/30 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
								 <div className="flex items-center space-x-2 text-white font-bold">
										<Calendar size={16} className="text-blue-400" />
										<span>Upcoming</span>
								 </div>
								 {/* FUNCTIONAL CALENDAR LINK */}
								 <a
									href="https://calendar.google.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-slate-500 hover:text-white transition-colors"
								 >
									View Calendar
								 </a>
							</div>

							<div className="p-4 space-y-3 min-h-[140px]">
								 {isSyncing ? (
										<div className="flex flex-col items-center justify-center h-full py-6 text-slate-500 space-y-2">
												 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
												 <span className="text-xs">Syncing Protocol...</span>
										</div>
								 ) : events.length === 0 ? (
										<div className="text-center py-6 text-slate-500 text-sm">No tactical events scheduled.</div>
								 ) : (
										events.map((event) => (
												<div key={event.id} className="flex items-start space-x-4 p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700">
														<div className="bg-slate-800 rounded-lg p-2 text-center min-w-[50px] border border-slate-700">
																{/* 2. DYNAMIC DATE LABEL */}
																<span className={`block text-[9px] font-bold uppercase ${event.dateLabel === 'TODAY' ? 'text-green-400' : 'text-slate-400'}`}>{event.dateLabel}</span>
																<span className="block text-white font-bold text-sm">{event.time.split(' ')[0]}</span>
														</div>
														<div>
																<h4 className="text-slate-200 font-medium text-sm leading-tight">{event.title}</h4>
																{event.location && (
																		<p className="text-xs text-slate-500 mt-1 flex items-center">
																				<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
																				{event.location}
																		</p>
																)}
														</div>
												</div>
										))
								 )}
							</div>
					 </div>

					 {/* JOURNAL WIDGET */}
					 <div className="bg-gradient-to-b from-[#0f1522] to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/journal')}>
							<div className="absolute right-[-20px] bottom-[-20px] opacity-5 text-slate-400 group-hover:opacity-10 transition-opacity">
								 <BookOpen size={120} />
							</div>
							<h4 className="text-white font-bold mb-2">Daily Reflection</h4>
							<p className="text-slate-400 text-sm italic mb-4 relative z-10">
								 "Focus today was on balancing the immediate needs with the long-term goals. Need to remember that rest is also a productive activity..."
							</p>
							<div className="flex items-center text-blue-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
								 Open Journal <ArrowRight size={12} className="ml-1" />
							</div>
					 </div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
