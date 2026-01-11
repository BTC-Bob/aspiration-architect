// src/components/GuardianGreeting.jsx
import React, { useState, useEffect } from 'react';
import {
	Sun, Scale, Activity, CheckCircle, ArrowRight, Moon,
	Calendar as CalendarIcon, Plus, Search, X, AlertCircle,
	Settings, ShieldAlert, LogOut, Terminal, ChevronLeft,
	Shield, ShieldCheck, User
} from 'lucide-react';
import { db, auth, googleProvider } from '../firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { signInAnonymously, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFormattedDate } from '../utils/dateHelpers';

// --- CONFIGURATION ---
const STATIC_CATEGORIES = [
	{ id: 'cat_spiritual', name: 'Spiritual / Prayer', dist: { l: 0.6, h: 0.3, f: 0.1 }, tier: 'high-impact' },
	{ id: 'cat_relationship', name: 'Relationship / Quality Time', dist: { l: 0.7, h: 0.1, f: 0.2 }, tier: 'high-impact' },
	{ id: 'cat_family', name: 'Family / Household', dist: { l: 0.6, h: 0.2, f: 0.2 }, tier: 'standard' },
	{ id: 'cat_travel', name: 'Travel / Vacation', dist: { l: 0.5, h: 0.3, f: 0.2 }, tier: 'high-impact' },
	{ id: 'cat_service', name: 'Volunteering / Service', dist: { l: 0.8, h: 0.1, f: 0.1 }, tier: 'standard' },
	{ id: 'cat_exercise', name: 'Exercise / Fitness', dist: { l: 0.1, h: 0.6, f: 0.3 }, tier: 'high-impact' },
	{ id: 'cat_nutrition', name: 'Nutrition / Meal Prep', dist: { l: 0.2, h: 0.7, f: 0.1 }, tier: 'standard' },
	{ id: 'cat_sleep', name: 'Sleep / Recovery', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },
	{ id: 'cat_rest', name: 'Rest / Leisure', dist: { l: 0.2, h: 0.6, f: 0.2 }, tier: 'standard' },
	{ id: 'cat_grooming', name: 'Personal Care / Grooming', dist: { l: 0.3, h: 0.5, f: 0.2 }, tier: 'maintenance' },
	{ id: 'cat_medical', name: 'Medical / Appointments', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },
	{ id: 'cat_deepwork', name: 'Deep Work (Career)', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'high-impact' },
	{ id: 'cat_finance', name: 'Finance / Budgeting', dist: { l: 0.1, h: 0.1, f: 0.8 }, tier: 'standard' },
	{ id: 'cat_creative', name: 'Creative / Side Hustle', dist: { l: 0.2, h: 0.2, f: 0.6 }, tier: 'high-impact' },
	{ id: 'cat_learning', name: 'Learning / Skill Building', dist: { l: 0.1, h: 0.3, f: 0.6 }, tier: 'standard' },
	{ id: 'cat_home_maint', name: 'Home Maintenance', dist: { l: 0.3, h: 0.2, f: 0.5 }, tier: 'maintenance' },
	{ id: 'cat_auto_maint', name: 'Auto Maintenance', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'maintenance' },
	{ id: 'cat_admin', name: 'Admin / Errands', dist: { l: 0.4, h: 0.2, f: 0.4 }, tier: 'maintenance' }
];

// FALLBACK PROTOCOLS (Ensures list is never empty)
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

// --- SUB-COMPONENTS ---

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

// Visual Progress Indicator
const StepProgress = ({ current, total = 4 }) => (
	<div className="flex gap-2 px-1 flex-1 h-1.5 self-center">
		{[...Array(total)].map((_, i) => (
			<div
				key={i}
				className={`h-full flex-1 rounded-full transition-all duration-500 ${
					i + 1 <= current
					? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
					: 'bg-slate-800'
				}`}
			/>
		))}
	</div>
);

// Auth Badge (Responsive & Inline)
const AuthBadge = ({ user }) => {
	if (!user) return (
		<div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full mb-4 self-end">
			<AlertCircle size={14} className="text-red-400" />
			<span className="text-[10px] font-bold text-red-300 uppercase tracking-wider hidden md:inline">Offline</span>
		</div>
	);

	if (user.isAnonymous) return (
		<div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4 self-end">
			<Shield size={14} className="text-amber-400" />
			<span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider hidden md:inline">Guest</span>
		</div>
	);

	return (
		<div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 self-end">
			{user.photoURL ? (
				<img src={user.photoURL} alt="User" className="w-4 h-4 rounded-full" />
			) : (
				<ShieldCheck size={14} className="text-emerald-400" />
			)}
			<span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider hidden md:inline">Connected</span>
		</div>
	);
};

const GuardianGreeting = ({ onComplete }) => {
	const [step, setStep] = useState(0);
	const [fade, setFade] = useState(true);
	const [loading, setLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	const [debugStatus, setDebugStatus] = useState('');
	const [showForceExit, setShowForceExit] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	const [data, setData] = useState({
		sleepScore: '',
		weight: '',
		digitalSunsetYesterday: null,
		pureViewYesterday: null
	});

	const [libraryTasks, setLibraryTasks] = useState([]);
	const [categories, setCategories] = useState(STATIC_CATEGORIES);
	const [allProtocols, setAllProtocols] = useState([]);
	const [activeProtocols, setActiveProtocols] = useState([]);
	const [showProtocolSelector, setShowProtocolSelector] = useState(false);

	const [selectedTasks, setSelectedTasks] = useState([]);
	const [showTaskSelector, setShowTaskSelector] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newTaskData, setNewTaskData] = useState({ name: '', categoryId: '', duration: 30 });

	// AUTH LISTENER
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			if (user) {
				if (step === 0) {
					setFade(false);
					setTimeout(() => {
						setStep(1);
						setFade(true);
					}, 500);
				}
			} else {
				if (step === 0) setLoading(false);
			}
		});
		return () => unsubscribe();
	}, [step]);

	// LOAD LIBRARY
	useEffect(() => {
		const fetchLibrary = async () => {
			try {
				const habitsSnap = await getDocs(collection(db, 'habits'));
				const habitsList = habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setLibraryTasks(habitsList);

				const protocolsSnap = await getDocs(collection(db, 'protocols'));
				let protocolsList = protocolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

				// CRITICAL FIX: Fallback to STATIC if DB is empty to prevent blank screens
				if (protocolsList.length === 0) protocolsList = STATIC_PROTOCOLS;

				setAllProtocols(protocolsList);
				setActiveProtocols(protocolsList); // Auto-select for today

			} catch (err) {
				console.error("Error loading library:", err);
				setAllProtocols(STATIC_PROTOCOLS); // Fail safe
				setActiveProtocols(STATIC_PROTOCOLS);
			}
		};
		fetchLibrary();
	}, []);

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (error) {
			console.error("Google Auth Error:", error);
			setLoading(false);
			setErrorMsg("Login failed. Please verify Authorized Origins in Google Cloud Console.");
		}
	};

	const handleGuestLogin = async () => {
		setLoading(true);
		try {
			await signInAnonymously(auth);
		} catch (error) {
			console.error("Guest Auth Error:", error);
			setLoading(false);
			setErrorMsg("Guest mode disabled. Check Firebase Console.");
		}
	};

	const handleNext = () => {
		setFade(false);
		setTimeout(() => {
			setStep(step + 1);
			setFade(true);
		}, 300);
	};

	const handleBack = () => {
		if (step > 1) {
			setFade(false);
			setTimeout(() => {
				setStep(step - 1);
				setFade(true);
			}, 300);
		}
	};

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

	const handleFinish = async () => {
		setLoading(true);
		setErrorMsg(null);
		setShowForceExit(false);

		const failsafeTimer = setTimeout(() => {
			setShowForceExit(true);
			setDebugStatus('Connection unstable. Use Force Launch below.');
		}, 3000);

		try {
			setDebugStatus('1/4 Authenticating...');
			if (auth && !auth.currentUser) {
				try {
					await signInAnonymously(auth);
					setDebugStatus('1/4 Auth Success');
				} catch (authErr) {
					console.warn("Auth check failed, attempting write anyway.");
				}
			}

			setDebugStatus('2/4 Packing Payload...');
			const today = getFormattedDate();

			const dailyLogRaw = {
				date: today,
				createdAt: new Date().toISOString(),
				physiology: {
					sleepScore: parseInt(data.sleepScore) || 0,
					weight: parseFloat(data.weight) || 0
				},
				accountability: {
					digitalSunset: data.digitalSunsetYesterday === undefined ? null : data.digitalSunsetYesterday,
					pureView: data.pureViewYesterday === undefined ? null : data.pureViewYesterday
				},
				plannedTasks: {
					core: selectedTasks.map(t => ({
						...t,
						status: 'active',
						pvEarned: 0,
						notes: t.notes || null,
						icon: t.icon || '⚡'
					})),
					flex: []
				},
				protocolProgress: activeProtocols.map(p => ({
					protocolId: p.id,
					name: p.name,
					totalHabits: p.habitIds ? p.habitIds.length : 0,
					habitsCompleted: [],
					isComplete: false,
					completionBonus: p.completionBonus || 0
				}))
			};
			const dailyLogClean = JSON.parse(JSON.stringify(dailyLogRaw));

			setDebugStatus(`3/4 Writing to dailyLogs/${today}...`);
			const writePromise = setDoc(doc(db, 'dailyLogs', today), dailyLogClean);
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Database Timeout")), 3000)
			);

			await Promise.race([writePromise, timeoutPromise]);

			clearTimeout(failsafeTimer);
			setDebugStatus('4/4 DONE. Launching...');
			setFade(false);
			setTimeout(() => {
				window.location.reload();
			}, 500);

		} catch (err) {
			clearTimeout(failsafeTimer);
			setLoading(false);
			setDebugStatus(`FAILED: ${err.message}`);
			setErrorMsg(err.message);
			setShowForceExit(true);
		}
	};

	// --- RENDER ---

	// STEP 0: IDENTITY GATE
	if (step === 0) return (
		<div className={`fixed inset-0 z-50 bg-[#050914] flex items-center justify-center p-4 transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
				<div className="flex justify-center mb-6">
					<div className="p-4 bg-blue-900/20 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
						<ShieldCheck size={48} className="text-blue-400" />
					</div>
				</div>
				<h1 className="text-2xl font-bold text-white mb-2">Identify Yourself</h1>
				<p className="text-slate-400 text-sm mb-8 leading-relaxed">
					To secure your daily plan and ensure data permanence, the Guardian Protocol requires authentication.
				</p>

				<div className="space-y-3">
					<button
						onClick={handleGoogleLogin}
						disabled={loading}
						className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3"
					>
						<User size={20} /> Login with Google
					</button>

					<div className="relative py-2">
						<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
						<div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f1522] px-2 text-slate-600 font-bold">OR</span></div>
					</div>

					<button
						onClick={handleGuestLogin}
						disabled={loading}
						className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
					>
						<Shield size={18} /> Initialize Guest Protocol
					</button>
				</div>

				{errorMsg && (
					<div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold flex items-center justify-center gap-2">
						<AlertCircle size={16} /> {errorMsg}
					</div>
				)}
			</div>
		</div>
	);

	// STEP 1: PRAYER
	if (step === 1) return (
		<div className={`fixed inset-0 z-50 bg-[#050914] flex items-center justify-center p-4 transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-4xl w-full flex flex-col h-[90vh] md:h-[85vh] relative">

				{/* FLEX HEADER (Fixes Overlap) */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 flex-none">
					<div className="hidden md:block w-32"></div> {/* Spacer for center alignment */}
					<div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
						<Sun size={14} className="text-blue-400" />
						<span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">The Architect's Ignition</span>
					</div>
					<AuthBadge user={currentUser} />
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
					{/* Integrated Progress into Footer */}
					<div className="flex justify-center mb-4 max-w-xs mx-auto">
						<StepProgress current={1} />
					</div>
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
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col">

				{/* FLEX HEADER (Fixes Overlap) */}
				<div className="flex justify-between items-center gap-4 mb-6">
					<StepProgress current={2} />
					<AuthBadge user={currentUser} />
				</div>

				<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
					<Activity size={20} className="text-blue-400" /> Physiology Check
				</h2>
				<div className="space-y-6 flex-1">
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
				<div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
					<button onClick={handleBack} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold px-4 py-2">
						<ChevronLeft size={16} /> Back
					</button>
					<button onClick={handleNext} disabled={!data.sleepScore || !data.weight} className={`px-6 py-3 rounded-xl font-bold text-sm ${(!data.sleepScore || !data.weight) ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
				</div>
			</div>
		</div>
	);

	// STEP 3: VITALITY
	if (step === 3) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col">

				{/* FLEX HEADER */}
				<div className="flex justify-between items-center gap-4 mb-6">
					<StepProgress current={3} />
					<AuthBadge user={currentUser} />
				</div>

				<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
					<Scale size={20} className="text-emerald-400" /> Vitality & Integrity
				</h2>
				<div className="space-y-6 flex-1">
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
				<div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
					<button onClick={handleBack} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold px-4 py-2">
						<ChevronLeft size={16} /> Back
					</button>
					<button onClick={handleNext} disabled={data.digitalSunsetYesterday === null || data.pureViewYesterday === null} className={`px-6 py-3 rounded-xl font-bold text-sm ${data.digitalSunsetYesterday === null ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
				</div>
			</div>
		</div>
	);

	// STEP 4: PLAN TODAY
	if (step === 4) return (
		<div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
			<div className="max-w-2xl w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col h-[85vh]">

				<div className="mb-4">
					<div className="flex justify-between items-center gap-4 mb-2">
						<StepProgress current={4} />
						<AuthBadge user={currentUser} />
					</div>
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-white flex items-center gap-3">
							<CalendarIcon size={20} className="text-amber-400" /> Plan Your Day
						</h2>
						<span className="text-xs font-bold text-slate-500 uppercase">Step 4 of 4</span>
					</div>
				</div>

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

							<button onClick={openTaskSelector} className="w-full py-3 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl text-slate-500 hover:text-blue-400 flex items-center justify-center gap-2 transition-colors text-sm font-medium">
								<Plus size={16} /> {selectedTasks.length === 0 ? 'Create Your First Task' : 'Add Core Task'}
							</button>
						</div>
					</div>
				</div>

				<div className="mt-6 pt-6 border-t border-slate-800">
					<div className="mb-2 text-center">
						<span className={`text-[10px] font-mono tracking-wider flex items-center justify-center gap-2 ${errorMsg ? 'text-red-400' : 'text-slate-500'}`}>
							{debugStatus && <Terminal size={10} />} {debugStatus}
						</span>
					</div>

					{errorMsg && (
						<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold">
							<ShieldAlert size={16} />
							<span className="flex-1">{errorMsg}</span>
						</div>
					)}

					{showForceExit && (
						<button
							onClick={() => window.location.reload()}
							className="w-full mb-3 py-3 rounded-xl font-bold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-2 text-sm border border-slate-700"
						>
							<LogOut size={16} /> FORCE LAUNCH DASHBOARD (SKIP SAVE)
						</button>
					)}

					<div className="flex gap-3">
						<button
							onClick={handleBack}
							className="px-6 py-4 rounded-2xl font-bold bg-slate-800 text-slate-400 hover:text-white transition-colors"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={handleFinish}
							disabled={loading}
							className="flex-1 py-4 rounded-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
						>
							{loading ? 'IGNITING...' : 'LAUNCH DASHBOARD'}
						</button>
					</div>
				</div>

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
											<button onClick={() => setNewTaskData({...newTaskData, duration: 15})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 15 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>15m</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 30})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 30 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>30m</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 45})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 45 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>45m</button>

											<button onClick={() => setNewTaskData({...newTaskData, duration: 60})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 60 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>1h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 90})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 90 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>1.5h</button>
											<button onClick={() => setNewTaskData({...newTaskData, duration: 120})} className={`py-2 rounded-lg text-xs font-bold border ${newTaskData.duration === 120 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>2h</button>

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
