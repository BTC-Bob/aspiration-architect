// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, HardDrive, AlertTriangle, Save, RefreshCw, LogOut, Check, Calendar } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // FIRESTORE IMPORTS
import { auth, db } from "../firebase";
import { APP_VERSION, getNavConfig } from '../config';
import PageHeader from '../components/PageHeader';

function Settings() {
	// --- STATE ENGINE ---
	const [username, setUsername] = useLocalStorage('guardian_username', 'Architect');

	// NEW: CLOUD SCHEDULE STATE
	const [schedule, setSchedule] = useState([
		{ id: 1, time: '09:00 AM', title: '' },
		{ id: 2, time: '12:00 PM', title: '' },
		{ id: 3, time: '03:00 PM', title: '' }
	]);

	const [user, setUser] = useState(null);
	const [storageUsage, setStorageUsage] = useState(0);
	const [isSaved, setIsSaved] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// --- CONFIGURATION ---
	const pageConfig = getNavConfig('settings');
	const PageIcon = pageConfig?.icon || User;

	// --- AUTH & DATA SYNC ---
	useEffect(() => {
		// Calculate Local Storage Usage
		const total = JSON.stringify(localStorage).length;
		setStorageUsage((total / 1024).toFixed(2));

		// Listen for Auth State & Fetch Data
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				try {
					const docRef = doc(db, "users", currentUser.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists() && docSnap.data().schedule) {
						setSchedule(docSnap.data().schedule);
					}
				} catch (error) {
					console.error("Error fetching schedule:", error);
				}
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// --- HANDLERS ---

	// Write to Firestore
	const handleSaveProfile = async () => {
		if (!user) return alert("You must be signed in to sync to the cloud.");

		setIsSaved(true);
		try {
			await setDoc(doc(db, "users", user.uid), {
				schedule: schedule,
				lastUpdated: new Date()
			}, { merge: true });

			// Visual Feedback
			setTimeout(() => setIsSaved(false), 2000);
		} catch (error) {
			console.error("Error saving to cloud:", error);
			setIsSaved(false);
		}
	};

	const handleScheduleChange = (id, field, value) => {
		setSchedule(schedule.map(item =>
			item.id === id ? { ...item, [field]: value } : item
		));
	};

	const handleHardReset = () => {
		if (window.confirm("WARNING: This will wipe all Tasks, Journals, and History. Are you sure?")) {
			localStorage.clear();
			window.location.reload();
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* MODULAR HEADER */}
			<PageHeader
				icon={PageIcon}
				title="System Configuration"
				subtitle="Manage protocol parameters and memory core."
			/>

			{/* --- MAIN CONTENT SCROLLABLE --- */}
			<div className="flex-1 overflow-y-auto custom-scrollbar p-8">
				<div className="w-full max-w-4xl space-y-8 pb-10">

					{/* --- IDENTITY SECTION --- */}
					<div className="bg-[#0f1522] rounded-2xl border border-slate-800 p-6 shadow-lg">
						<div className="flex items-center space-x-3 mb-6">
							<div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
								<User size={24} />
							</div>
							<h2 className="text-xl font-bold text-white">Identity Matrix</h2>
						</div>

						<div className="space-y-4 max-w-md">
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
									Designation / Name
								</label>
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
								/>
							</div>
						</div>
					</div>

					{/* --- DAILY BRIEFING CONFIGURATION (FIRESTORE SYNC) --- */}
					<div className="bg-[#0f1522] rounded-2xl border border-slate-800 p-6 shadow-lg">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
									<Calendar size={24} />
								</div>
								<div>
									<h2 className="text-xl font-bold text-white">Daily Briefing</h2>
									<p className="text-xs text-slate-500 mt-1">
										{isLoading ? "Connecting to Cloud..." : "Cloud Sync Active • Updates Dashboard in Real-Time"}
									</p>
								</div>
							</div>
							<button
								onClick={handleSaveProfile}
								disabled={isLoading || !user}
								className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
							>
								{isSaved ? <Check size={14} /> : <Save size={14} />}
								<span>{isSaved ? "Synced" : "Update Dashboard"}</span>
							</button>
						</div>

						<div className="space-y-3">
							{schedule.map((item) => (
								<div key={item.id} className="flex gap-4">
									<div className="w-32">
										<input
											type="text"
											value={item.time}
											onChange={(e) => handleScheduleChange(item.id, 'time', e.target.value)}
											className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-blue-400 font-mono text-sm focus:border-blue-500 outline-none text-center"
											placeholder="00:00 AM"
										/>
									</div>
									<div className="flex-1">
										<input
											type="text"
											value={item.title}
											onChange={(e) => handleScheduleChange(item.id, 'title', e.target.value)}
											className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
											placeholder="Enter Event Title (Leave empty to hide)"
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* --- SYSTEM DIAGNOSTICS --- */}
					<div className="bg-[#0f1522] rounded-2xl border border-slate-800 p-6 shadow-lg">
						<div className="flex items-center space-x-3 mb-6">
							<div className="p-2 bg-slate-700/30 rounded-lg text-slate-400">
								<HardDrive size={24} />
							</div>
							<h2 className="text-xl font-bold text-white">Memory Core Diagnostics</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="p-4 bg-[#0B1120] rounded-xl border border-slate-800">
								<p className="text-xs text-slate-500 uppercase font-bold">Local Storage Usage</p>
								<p className="text-2xl font-mono text-white mt-1">{storageUsage} KB</p>
							</div>
							<div className="p-4 bg-[#0B1120] rounded-xl border border-slate-800">
								<p className="text-xs text-slate-500 uppercase font-bold">System Version</p>
								<p className="text-2xl font-mono text-blue-400 mt-1">{APP_VERSION}</p>
							</div>
						</div>
					</div>

					{/* --- DANGER ZONE & SESSION CONTROL --- */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-red-900/5 rounded-2xl border border-red-900/20 p-6">
							<div className="flex items-center space-x-3 mb-4">
								<div className="p-2 bg-red-500/10 rounded-lg text-red-500">
									<AlertTriangle size={24} />
								</div>
								<h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
							</div>
							<button
								onClick={handleHardReset}
								className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-bold transition-all"
							>
								<RefreshCw size={18} />
								<span>Factory Reset</span>
							</button>
						</div>

						<div className="bg-[#0f1522] rounded-2xl border border-slate-800 p-6 shadow-lg">
							<div className="flex items-center space-x-3 mb-4">
								<div className="p-2 bg-slate-700/50 rounded-lg text-white">
									<LogOut size={24} />
								</div>
								<h2 className="text-xl font-bold text-white">Session Control</h2>
							</div>
							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl font-bold transition-all"
							>
								<LogOut size={18} />
								<span>Sign Out</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Settings;
