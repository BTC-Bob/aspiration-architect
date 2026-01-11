// src/components/GuardianGreeting.jsx
import React, { useState, useEffect } from 'react';
import {
	Sun, Scale, Activity, Eye, CheckCircle, ArrowRight, Moon,
	Calendar as CalendarIcon, Clock, Plus, Search, X
} from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getFormattedDate } from '../utils/dateHelpers';

// --- CONFIGURATION ---
const KEYWORDS_TO_HIGHLIGHT = [
	"embrace", "design", "fulfilling", "contributes", "blueprint",
	"intention", "clarity", "aspirations", "dedication",
	"my year-long journey", "make positive impacts", "overarching vision",
	"reflections", "interactions", "growth", "achievement",
	"vision for the future"
];

const PRAYER_LINES = [
	"As the new day begins, I embrace the opportunity to design a purposeful and fulfilling day.",
	"With each morning, I am reminded that every action contributes to the blueprint of my year.",
	"Today, I step forward with intention and clarity, aligning my actions with my long-term aspirations.",
	"I recognize each decision as a foundational stone in the structure of my year.",
	"I approach my ambitions with dedication and resilience, celebrating both small steps and significant milestones.",
	"Each achievement, no matter its size, adds to the mosaic of my year-long journey.",
	"In every interaction, I aim to make positive impacts, seeing each as a chance to contribute constructively to my daily goals and my overarching vision.",
	"This day is a canvas for my aspirations, a chance to add meaningful strokes to the larger picture of my year.",
	"My actions, reflections, and interactions are integral parts of my ongoing narrative of growth and achievement.",
	"May this day reflect my journey towards a year of growth, fulfillment, and purpose, aligning my daily efforts with my vision for the future."
];

// Helper: Highlights specific words
const HighlightedText = ({ text }) => {
	const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(`\\b(${KEYWORDS_TO_HIGHLIGHT.map(escapeRegExp).join('|')})\\b`, 'gi');
	const parts = text.split(pattern);

	return (
		<span>
			{parts.map((part, i) =>
				KEYWORDS_TO_HIGHLIGHT.some(k => k.toLowerCase() === part.toLowerCase()) ? (
					<span key={i} className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
						{part}
					</span>
				) : (
					<span key={i}>{part}</span>
				)
			)}
		</span>
	);
};

const GuardianGreeting = ({ onComplete }) => {
	const [step, setStep] = useState(1);
	const [fade, setFade] = useState(true);
	const [loading, setLoading] = useState(false);

	// FORM STATE
	const [data, setData] = useState({
		sleepScore: '',
		weight: '',
		digitalSunsetYesterday: null,
		pureViewYesterday: null
	});

	// PLANNING STATE (Step 4)
	const [libraryTasks, setLibraryTasks] = useState([]);
	const [selectedTasks, setSelectedTasks] = useState([]); // Array of task objects
	const [showTaskSelector, setShowTaskSelector] = useState(false);
	const [protocols, setProtocols] = useState([]);

	// LOAD LIBRARY DATA
	useEffect(() => {
		const fetchLibrary = async () => {
			try {
				// 1. Fetch Tasks
				// Note: In a real app, we might query only 'isLibraryItem: true'
				// For now, we'll assume we seed some tasks or user creates them.
				// Since we seeded HABITS but not TASKS, we'll use Habits as the source for now.
				const habitsSnap = await getDocs(collection(db, 'habits'));
				const habitsList = habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setLibraryTasks(habitsList);

				// 2. Fetch Protocols
				const protocolsSnap = await getDocs(collection(db, 'protocols'));
				const protocolsList = protocolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

				// Auto-select protocols based on today? (Simple all-active for now)
				setProtocols(protocolsList);

			} catch (err) {
				console.error("Error loading library:", err);
			}
		};
		fetchLibrary();
	}, []);

	const handleNext = () => {
		setFade(false);
		setTimeout(() => {
			setStep(step + 1);
			setFade(true);
		}, 300);
	};

	// --- STEP 4 LOGIC: ADDING TASKS ---
	const addTaskToPlan = (taskTemplate) => {
		const newTask = {
			...taskTemplate,
			taskId: taskTemplate.id, // Keep reference
			instanceId: Date.now(), // Unique ID for today's list
			status: 'active'
		};
		setSelectedTasks([...selectedTasks, newTask]);
		setShowTaskSelector(false);
	};

	const removeTask = (instanceId) => {
		setSelectedTasks(selectedTasks.filter(t => t.instanceId !== instanceId));
	};

	// --- FINAL SUBMISSION ---
	const handleFinish = async () => {
		setLoading(true);
		try {
			const today = getFormattedDate();

			// CONSTRUCT THE DAILY LOG OBJECT
			const dailyLog = {
				date: today,
				createdAt: new Date().toISOString(),

				// 1. Physiology
				physiology: {
					sleepScore: parseInt(data.sleepScore) || 0,
					weight: parseFloat(data.weight) || 0
				},

				// 2. Accountability
				accountability: {
					digitalSunset: data.digitalSunsetYesterday,
					pureView: data.pureViewYesterday
				},

				// 3. The Plan
				plannedTasks: {
					core: selectedTasks.map(t => ({
						...t,
						status: 'active', // Reset status for the day
						pvEarned: 0 // Initialize PV
					})),
					flex: [] // Future feature
				},

				// 4. Protocols
				protocolProgress: protocols.map(p => ({
					protocolId: p.id,
					name: p.name,
					totalHabits: p.habitIds.length,
					habitsCompleted: [],
					isComplete: false,
					completionBonus: p.completionBonus
				}))
			};

			// WRITE TO FIRESTORE
			await setDoc(doc(db, 'dailyLogs', today), dailyLog);

			// UI FINISH
			setFade(false);
			setTimeout(onComplete, 500);

		} catch (err) {
			console.error("Error saving Daily Log:", err);
			setLoading(false);
		}
	};

	// --- STEP 1: PRAYER ---
	if (step === 1) return (
		<div className={`fixed inset-0 z-50 bg-[#050914] flex items-center justify-center p-4 transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-4xl w-full flex flex-col h-[90vh] md:h-[85vh]">
				<div className="text-center mb-6 flex-none">
					<div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
						<Sun size={14} className="text-blue-400" />
						<span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">The Architect's Ignition</span>
					</div>
				</div>
				<div className="flex-1 min-h-0 mb-8 relative bg-[#0f1522]/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
					<div className="flex-none p-6 text-center border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-sm relative z-10">
						<h1 className="text-3xl font-bold text-white tracking-tight font-serif">Morning Prayer</h1>
						<div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-4 opacity-50"></div>
					</div>
					<div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 text-center flex flex-col justify-start items-center space-y-8 relative z-0">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
						{PRAYER_LINES.map((line, i) => (
							<p key={i} className="text-lg md:text-xl text-slate-300 font-medium leading-loose tracking-wide max-w-3xl relative z-10">
								<HighlightedText text={line} />
							</p>
						))}
						<div className="h-8 shrink-0"></div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1522] to-transparent pointer-events-none z-10"></div>
				</div>
				<div className="flex-none text-center">
					<button onClick={handleNext} className="relative group bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full font-bold tracking-[0.15em] uppercase transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95">
						<span className="flex items-center gap-3">I Am Aligned <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
						<span className="absolute -inset-1 rounded-full border border-blue-400/30 opacity-0 group-hover:opacity-100 animate-ping pointer-events-none"></span>
					</button>
				</div>
			</div>
		</div>
	);

	// --- STEP 2: PHYSIOLOGY ---
	if (step === 2) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
				<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
					<Activity size={20} className="text-blue-400" /> Physiology Check
				</h2>
				<div className="space-y-6">
					<div>
						<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Whoop Sleep Score</label>
						<div className="flex items-center gap-4">
							<input type="number" value={data.sleepScore} onChange={(e) => setData({...data, sleepScore: e.target.value})} className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white text-xl focus:border-blue-500 outline-none" />
							<span className="text-slate-400 font-bold">%</span>
						</div>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Morning Weight</label>
						<div className="flex items-center gap-4">
							<input type="number" value={data.weight} onChange={(e) => setData({...data, weight: e.target.value})} className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white text-xl focus:border-blue-500 outline-none" />
							<span className="text-slate-400 font-bold">lbs</span>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
					<button onClick={handleNext} disabled={!data.sleepScore || !data.weight} className={`px-6 py-3 rounded-xl font-bold text-sm ${(!data.sleepScore || !data.weight) ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
				</div>
			</div>
		</div>
	);

	// --- STEP 3: ACCOUNTABILITY ---
	if (step === 3) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

				<div className="mb-6 flex items-center justify-between relative z-10">
					 <h2 className="text-xl font-bold text-white flex items-center gap-3">
						<Scale size={20} className="text-emerald-400" /> Vitality & Integrity
					</h2>
					<span className="text-xs font-bold text-slate-500 uppercase">Step 3 of 4</span>
				</div>

				<div className="space-y-6 relative z-10">
					{/* DIGITAL SUNSET */}
					<div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
						<div className="flex items-start gap-3">
							<Moon size={20} className={data.digitalSunsetYesterday === true ? "text-indigo-400" : "text-slate-500"} />
							<div className="flex-1">
								<h3 className="text-sm font-bold text-white">Digital Sunset</h3>
								<p className="text-xs text-slate-400 mt-1 mb-3">Did you execute the "Shutdown Protocol" (Zero Screens) last night?</p>
								<div className="flex gap-2">
									<button onClick={() => setData({...data, digitalSunsetYesterday: true})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.digitalSunsetYesterday === true ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-indigo-500/50'}`}>YES</button>
									<button onClick={() => setData({...data, digitalSunsetYesterday: false})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.digitalSunsetYesterday === false ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'}`}>NO</button>
								</div>
							</div>
						</div>
					</div>

					{/* PUREVIEW CHECK */}
					<div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
						<div className="flex items-start gap-3">
							<Eye size={20} className={data.pureViewYesterday === true ? "text-emerald-400" : "text-slate-500"} />
							<div className="flex-1">
								<h3 className="text-sm font-bold text-white">PureView Integrity Check</h3>
								<p className="text-xs text-slate-400 mt-1 mb-3">Did you maintain wholesome visual standards yesterday?</p>
								<div className="flex gap-2">
									<button onClick={() => setData({...data, pureViewYesterday: true})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === true ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-emerald-500/50'}`}>YES</button>
									<button onClick={() => setData({...data, pureViewYesterday: false})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === false ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-rose-500/50'}`}>NO</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
					<button onClick={handleNext} disabled={data.digitalSunsetYesterday === null || data.pureViewYesterday === null} className={`px-6 py-3 rounded-xl font-bold text-sm ${data.digitalSunsetYesterday === null ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
				</div>
			</div>
		</div>
	);

	// --- STEP 4: PLAN TODAY (NEW) ---
	if (step === 4) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-2xl w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col h-[80vh]">

				<div className="mb-6 flex items-center justify-between">
					 <h2 className="text-xl font-bold text-white flex items-center gap-3">
						<CalendarIcon size={20} className="text-amber-400" /> Plan Your Day
					</h2>
					<span className="text-xs font-bold text-slate-500 uppercase">Step 4 of 4</span>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">

					{/* 1. PROTOCOLS (Auto-Added) */}
					<div className="bg-[#1A2435]/30 p-4 rounded-2xl border border-slate-800">
						<h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
							<CheckCircle size={12} /> Today's Protocols
						</h3>
						<div className="flex flex-wrap gap-2">
							{protocols.map(proto => (
								<div key={proto.id} className="flex items-center gap-2 bg-[#0B1120] border border-slate-700 px-3 py-2 rounded-lg opacity-80">
									<span>{proto.icon}</span>
									<span className="text-sm font-medium text-slate-300">{proto.name}</span>
								</div>
							))}
						</div>
					</div>

					{/* 2. CORE TASKS */}
					<div>
						<h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
							<CheckCircle size={12} /> Core Priorities
						</h3>

						<div className="space-y-2">
							{selectedTasks.map(task => (
								<div key={task.instanceId} className="flex items-center justify-between bg-[#1A2435] border border-slate-700 p-3 rounded-xl group">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
											{task.icon || '⚡'}
										</div>
										<div>
											<div className="text-sm font-bold text-slate-200">{task.name}</div>
											<div className="text-xs text-slate-500">{task.duration}m • {task.valueTier}</div>
										</div>
									</div>
									<button onClick={() => removeTask(task.instanceId)} className="text-slate-600 hover:text-rose-400 p-2">
										<X size={16} />
									</button>
								</div>
							))}

							{/* Add Button */}
							<button onClick={() => setShowTaskSelector(true)} className="w-full py-3 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl text-slate-500 hover:text-blue-400 flex items-center justify-center gap-2 transition-colors text-sm font-medium">
								<Plus size={16} /> Add Core Task
							</button>
						</div>
					</div>
				</div>

				<div className="mt-6 pt-6 border-t border-slate-800">
					<button
						onClick={handleFinish}
						disabled={loading}
						className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
					>
						{loading ? 'Igniting...' : 'Launch Dashboard'}
					</button>
				</div>

				{/* TASK SELECTOR MODAL */}
				{showTaskSelector && (
					<div className="absolute inset-0 z-50 bg-[#0f1522] rounded-3xl p-6 flex flex-col">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-bold text-white">Select Task</h3>
							<button onClick={() => setShowTaskSelector(false)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={16}/></button>
						</div>

						{/* Search (Visual Only for now) */}
						<div className="relative mb-4">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
							<input type="text" placeholder="Search library..." className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
						</div>

						<div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
							{libraryTasks.map(task => (
								<button
									key={task.id}
									onClick={() => addTaskToPlan(task)}
									className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-left border border-transparent hover:border-slate-700"
								>
									<span className="text-xl">{task.icon || '⚡'}</span>
									<div>
										<div className="text-sm font-bold text-slate-200">{task.name}</div>
										<div className="text-xs text-slate-500">{task.duration}m • {task.valueTier}</div>
									</div>
								</button>
							))}
							{libraryTasks.length === 0 && (
								<div className="text-center py-10 text-slate-500 text-sm">
									No tasks found in library.
									<br/>(Run /seed to populate)
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return null;
};

export default GuardianGreeting;
