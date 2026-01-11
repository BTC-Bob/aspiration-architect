// src/components/GuardianGreeting.jsx
import React, { useState, useEffect } from 'react';
import {
	Sun, Scale, Activity, CheckCircle, ArrowRight, Moon,
	Calendar as CalendarIcon, Plus, Search, X, AlertCircle,
	Settings, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getFormattedDate } from '../utils/dateHelpers';

// --- CONFIGURATION ---

// v0.3 MASTER CATEGORY LIST (Fallback)
const STATIC_CATEGORIES = [
	// LOVE PRIMARY
	{ id: 'cat_spiritual', name: 'Spiritual / Prayer', dist: { l: 0.6, h: 0.3, f: 0.1 }, tier: 'high-impact' },
	{ id: 'cat_relationship', name: 'Relationship / Quality Time', dist: { l: 0.7, h: 0.1, f: 0.2 }, tier: 'high-impact' },
	{ id: 'cat_family', name: 'Family / Household', dist: { l: 0.6, h: 0.2, f: 0.2 }, tier: 'standard' },
	{ id: 'cat_travel', name: 'Travel / Vacation', dist: { l: 0.5, h: 0.3, f: 0.2 }, tier: 'high-impact' },
	{ id: 'cat_service', name: 'Volunteering / Service', dist: { l: 0.8, h: 0.1, f: 0.1 }, tier: 'standard' },

	// HEALTH PRIMARY
	{ id: 'cat_exercise', name: 'Exercise / Fitness', dist: { l: 0.1, h: 0.6, f: 0.3 }, tier: 'high-impact' },
	{ id: 'cat_nutrition', name: 'Nutrition / Meal Prep', dist: { l: 0.2, h: 0.7, f: 0.1 }, tier: 'standard' },
	{ id: 'cat_sleep', name: 'Sleep / Recovery', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },
	{ id: 'cat_rest', name: 'Rest / Leisure', dist: { l: 0.2, h: 0.6, f: 0.2 }, tier: 'standard' },
	{ id: 'cat_grooming', name: 'Personal Care / Grooming', dist: { l: 0.3, h: 0.5, f: 0.2 }, tier: 'maintenance' },
	{ id: 'cat_medical', name: 'Medical / Appointments', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },

	// FREEDOM PRIMARY
	{ id: 'cat_deepwork', name: 'Deep Work (Career)', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'high-impact' },
	{ id: 'cat_finance', name: 'Finance / Budgeting', dist: { l: 0.1, h: 0.1, f: 0.8 }, tier: 'standard' },
	{ id: 'cat_creative', name: 'Creative / Side Hustle', dist: { l: 0.2, h: 0.2, f: 0.6 }, tier: 'high-impact' },
	{ id: 'cat_learning', name: 'Learning / Skill Building', dist: { l: 0.1, h: 0.3, f: 0.6 }, tier: 'standard' },
	{ id: 'cat_home_maint', name: 'Home Maintenance', dist: { l: 0.3, h: 0.2, f: 0.5 }, tier: 'maintenance' },
	{ id: 'cat_auto_maint', name: 'Auto Maintenance', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'maintenance' },

	// BALANCED
	{ id: 'cat_admin', name: 'Admin / Errands', dist: { l: 0.4, h: 0.2, f: 0.4 }, tier: 'maintenance' }
];

// FALLBACK PROTOCOLS (If DB is empty)
const STATIC_PROTOCOLS = [
	{ id: 'protocol_morning', name: 'Morning Protocol', icon: '☀', habitIds: ['make_bed', 'hydrate', 'prayer'], completionBonus: 5 },
	{ id: 'protocol_evening', name: 'Evening Protocol', icon: '☾', habitIds: ['shutdown', 'reflect'], completionBonus: 5 }
];

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
	const [categories, setCategories] = useState(STATIC_CATEGORIES);

	// PROTOCOLS
	const [allProtocols, setAllProtocols] = useState([]); // Full library list
	const [activeProtocols, setActiveProtocols] = useState([]); // Selected for today
	const [showProtocolSelector, setShowProtocolSelector] = useState(false);

	// Task Selection State
	const [selectedTasks, setSelectedTasks] = useState([]);
	const [showTaskSelector, setShowTaskSelector] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// New Task Creation State
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newTaskData, setNewTaskData] = useState({ name: '', categoryId: '', duration: 30 });

	// LOAD LIBRARY DATA
	useEffect(() => {
		const fetchLibrary = async () => {
			try {
				// 1. Fetch Habits/Tasks
				const habitsSnap = await getDocs(collection(db, 'habits'));
				const habitsList = habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setLibraryTasks(habitsList);

				// 2. Fetch Protocols
				const protocolsSnap = await getDocs(collection(db, 'protocols'));
				let protocolsList = protocolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

				// FALLBACK IF EMPTY
				if (protocolsList.length === 0) {
					protocolsList = STATIC_PROTOCOLS;
				}

				setAllProtocols(protocolsList);
				// Auto-select ALL protocols initially
				setActiveProtocols(protocolsList);

			} catch (err) {
				console.error("Error loading library:", err);
				setAllProtocols(STATIC_PROTOCOLS); // Fail safe
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

	// --- STEP 4 HELPERS ---

	const toggleProtocol = (proto) => {
		if (activeProtocols.find(p => p.id === proto.id)) {
			setActiveProtocols(activeProtocols.filter(p => p.id !== proto.id));
		} else {
			setActiveProtocols([...activeProtocols, proto]);
		}
	};

	const openTaskSelector = () => {
		setSearchQuery('');
		setIsCreatingNew(false);
		setShowTaskSelector(true);
	};

	const addLibraryTask = (taskTemplate) => {
		const newTask = {
			...taskTemplate,
			taskId: taskTemplate.id,
			instanceId: Date.now(),
			status: 'active'
		};
		setSelectedTasks([...selectedTasks, newTask]);
		setShowTaskSelector(false);
	};

	const startCreateTask = () => {
		setNewTaskData({
			name: searchQuery,
			categoryId: categories[0]?.id || '',
			duration: 60,
			valueTier: 'standard'
		});
		setIsCreatingNew(true);
	};

	const confirmCreateTask = () => {
		const selectedCat = categories.find(c => c.id === newTaskData.categoryId);
		const newTask = {
			taskId: `custom-${Date.now()}`,
			name: newTaskData.name,
			categoryId: newTaskData.categoryId,
			duration: parseInt(newTaskData.duration),
			valueTier: selectedCat?.tier || 'standard',
			pillarDistribution: selectedCat?.dist || { l: 0, h: 0, f: 0 },
			instanceId: Date.now(),
			status: 'active'
		};
		setSelectedTasks([...selectedTasks, newTask]);
		setShowTaskSelector(false);
		setIsCreatingNew(false);
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
						status: 'active',
						pvEarned: 0
					})),
					flex: []
				},

				// 4. Protocols
				protocolProgress: activeProtocols.map(p => ({
					protocolId: p.id,
					name: p.name,
					totalHabits: p.habitIds ? p.habitIds.length : 0,
					habitsCompleted: [],
					isComplete: false,
					completionBonus: p.completionBonus
				}))
			};

			// WRITE TO FIRESTORE
			await setDoc(doc(db, 'dailyLogs', today), dailyLog);

			// UI FINISH (Failsafe Navigation)
			setFade(false);

			// 1. Try standard callback
			if (onComplete) {
				setTimeout(onComplete, 500);
			}

			// 2. Hard reload fallback if app doesn't navigate (Safety Net)
			setTimeout(() => {
				window.location.reload();
			}, 1500);

		} catch (err) {
			console.error("Error saving Daily Log:", err);
			setLoading(false);
			alert("Error saving Plan: " + err.message);
		}
	};

	// --- RENDER STEPS ---

	// STEP 1: PRAYER
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
						{PRAYER_LINES.map((line, i) => (
							<p key={i} className="text-lg md:text-xl text-slate-300 font-medium leading-loose tracking-wide max-w-3xl relative z-10">
								<HighlightedText text={line} />
							</p>
						))}
					</div>
				</div>
				<div className="flex-none text-center">
					<button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full font-bold tracking-[0.15em] uppercase transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105">
						<span className="flex items-center gap-3">I Am Aligned <ArrowRight size={18} /></span>
					</button>
				</div>
			</div>
		</div>
	);

	// STEP 2: PHYSIOLOGY
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

	// STEP 3: VITALITY
	if (step === 3) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
				<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
					<Scale size={20} className="text-emerald-400" /> Vitality & Integrity
				</h2>
				<div className="space-y-6">
					<div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
						<h3 className="text-sm font-bold text-white mb-3">Digital Sunset</h3>
						<div className="flex gap-2">
							<button onClick={() => setData({...data, digitalSunsetYesterday: true})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.digitalSunsetYesterday === true ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>YES</button>
							<button onClick={() => setData({...data, digitalSunsetYesterday: false})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.digitalSunsetYesterday === false ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}>NO</button>
						</div>
					</div>
					<div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
						<h3 className="text-sm font-bold text-white mb-3">PureView Check</h3>
						<div className="flex gap-2">
							<button onClick={() => setData({...data, pureViewYesterday: true})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === true ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>YES</button>
							<button onClick={() => setData({...data, pureViewYesterday: false})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === false ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500'}`}>NO</button>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
					<button onClick={handleNext} disabled={data.digitalSunsetYesterday === null || data.pureViewYesterday === null} className={`px-6 py-3 rounded-xl font-bold text-sm ${data.digitalSunsetYesterday === null ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
				</div>
			</div>
		</div>
	);

	// STEP 4: PLAN TODAY
	if (step === 4) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-2xl w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col h-[85vh]">

				{/* HEADER */}
				<div className="mb-6 flex items-center justify-between">
					 <h2 className="text-xl font-bold text-white flex items-center gap-3">
						<CalendarIcon size={20} className="text-amber-400" /> Plan Your Day
					</h2>
					<span className="text-xs font-bold text-slate-500 uppercase">Step 4 of 4</span>
				</div>

				{/* CONTENT */}
				<div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">

					{/* 1. PROTOCOLS MANAGER */}
					<div className="bg-[#1A2435]/30 p-4 rounded-2xl border border-slate-800 relative">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
								<CheckCircle size={12} /> Daily Protocols
							</h3>
							<button onClick={() => setShowProtocolSelector(!showProtocolSelector)} className="text-blue-400 hover:text-white text-xs font-bold flex items-center gap-1">
								<Settings size={12} /> {showProtocolSelector ? 'Done' : 'Manage'}
							</button>
						</div>

						{/* Active List */}
						<div className="flex flex-wrap gap-2">
							{activeProtocols.length > 0 ? activeProtocols.map(proto => (
								<div key={proto.id} className="flex items-center gap-2 bg-[#0B1120] border border-slate-700 px-3 py-2 rounded-lg">
									<span>{proto.icon}</span>
									<span className="text-sm font-medium text-slate-300">{proto.name}</span>
								</div>
							)) : (
								<div className="text-xs text-slate-500 italic">No protocols active. Click "Manage" to add.</div>
							)}
						</div>

						{/* Protocol Selector Dropdown */}
						{showProtocolSelector && (
							<div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 gap-2">
								{allProtocols.map(proto => {
									const isActive = activeProtocols.find(p => p.id === proto.id);
									return (
										<button
											key={proto.id}
											onClick={() => toggleProtocol(proto)}
											className={`flex items-center justify-between p-3 rounded-lg border text-sm font-bold transition-all ${isActive ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
										>
											<span className="flex items-center gap-2">{proto.icon} {proto.name}</span>
											{isActive && <CheckCircle size={14} className="text-blue-400" />}
										</button>
									);
								})}
								{allProtocols.length === 0 && <div className="text-center text-xs text-slate-500 py-2">Library empty. Run /seed</div>}
							</div>
						)}
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

							{/* ADD TASK BUTTON */}
							<button onClick={openTaskSelector} className="w-full py-3 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl text-slate-500 hover:text-blue-400 flex items-center justify-center gap-2 transition-colors text-sm font-medium">
								<Plus size={16} /> {selectedTasks.length === 0 ? 'Create Your First Task' : 'Add Core Task'}
							</button>
						</div>
					</div>
				</div>

				{/* FOOTER */}
				<div className="mt-6 pt-6 border-t border-slate-800">
					<button
						onClick={handleFinish}
						disabled={loading}
						className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
					>
						{loading ? 'Igniting...' : 'Launch Dashboard'}
					</button>
				</div>

				{/* --- SMART TASK SELECTOR MODAL --- */}
				{showTaskSelector && (
					<div className="absolute inset-0 z-50 bg-[#0f1522] rounded-3xl p-6 flex flex-col">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-bold text-white">
								{isCreatingNew ? 'Create New Task' : 'Select Task'}
							</h3>
							<button onClick={() => setShowTaskSelector(false)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={16}/></button>
						</div>

						{!isCreatingNew ? (
							<>
								<div className="relative mb-4">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
									<input
										type="text"
										placeholder="Search library..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										autoFocus
										className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
									/>
								</div>

								<div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
									{libraryTasks.length === 0 && searchQuery.length === 0 && (
										<div className="text-center p-4">
											<div className="inline-flex p-3 bg-slate-800/50 rounded-full mb-3 text-slate-500">
												<AlertCircle size={24} />
											</div>
											<p className="text-sm text-slate-400 mb-2">Library is empty.</p>
											<button onClick={() => setIsCreatingNew(true)} className="text-blue-400 text-sm font-bold hover:underline">
												Create Custom Task Now
											</button>
										</div>
									)}

									{libraryTasks
										.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
										.map(task => (
											<button key={task.id} onClick={() => addLibraryTask(task)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-left border border-transparent hover:border-slate-700">
												<span className="text-xl">{task.icon || '⚡'}</span>
												<div>
													<div className="text-sm font-bold text-slate-200">{task.name}</div>
													<div className="text-xs text-slate-500">{task.duration}m • {task.valueTier}</div>
												</div>
											</button>
									))}

									{(searchQuery.length > 0 || libraryTasks.length === 0) && (
										<button onClick={startCreateTask} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-left mt-2">
											<div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
												<Plus size={20} />
											</div>
											<div>
												<div className="text-sm font-bold text-blue-400">Create "{searchQuery || 'New Task'}"</div>
												<div className="text-xs text-blue-300/70">Add to library & plan</div>
											</div>
										</button>
									)}
								</div>
							</>
						) : (
							<>
								<div className="flex-1 overflow-y-auto space-y-6">
									<div>
										<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Task Name</label>
										<input
											type="text"
											value={newTaskData.name}
											onChange={(e) => setNewTaskData({...newTaskData, name: e.target.value})}
											className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
											placeholder="e.g. Deep Work on App"
										/>
									</div>

									<div>
										<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category (Determines PV)</label>
										<select
											value={newTaskData.categoryId}
											onChange={(e) => setNewTaskData({...newTaskData, categoryId: e.target.value})}
											className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none appearance-none"
										>
											<option value="">Select Category...</option>
											{categories.map(cat => (
												<option key={cat.id} value={cat.id}>{cat.name}</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duration</label>
										<div className="grid grid-cols-3 gap-2">
											{/* SHORT */}
											<button onClick={() => setNewTaskData({...newTaskData, duration: 15})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 15 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>15m</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 30})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 30 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>30m</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 45})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 45 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>45m</button>

											{/* FOCUS */}
											<button onClick={() => setNewTaskData({...newTaskData, duration: 60})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 60 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>1h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 90})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 90 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>1.5h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 120})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 120 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>2h</button>

											{/* DEEP */}
											<button onClick={() => setNewTaskData({...newTaskData, duration: 180})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 180 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>3h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 240})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 240 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>4h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 360})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 360 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>6h</button>
										</div>
									</div>
								</div>

								<button
									onClick={confirmCreateTask}
									disabled={!newTaskData.name || !newTaskData.categoryId}
									className={`w-full py-4 rounded-xl font-bold mt-4 ${(!newTaskData.name || !newTaskData.categoryId) ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
								>
									Add to Plan
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);

	return null;
};

export default GuardianGreeting;
