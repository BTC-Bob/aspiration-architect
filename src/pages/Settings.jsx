import React, { useState, useEffect } from 'react';
import { User, HardDrive, AlertTriangle, Save, RefreshCw, LogOut } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Settings() {
	// --- STATE ENGINE ---
	const [username, setUsername] = useLocalStorage('guardian_username', 'Architect');
	const [storageUsage, setStorageUsage] = useState(0);
	const [isSaved, setIsSaved] = useState(false);

	// --- LOGIC ---
	useEffect(() => {
		const total = JSON.stringify(localStorage).length;
		setStorageUsage((total / 1024).toFixed(2));
	}, []);

	const handleSaveProfile = () => {
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 2000);
	};

	const handleHardReset = () => {
		if (window.confirm("WARNING: This will wipe all Tasks, Journals, and History. Are you sure?")) {
			localStorage.clear();
			window.location.reload();
		}
	};

	// --- LOGOUT FUNCTION ---
	const handleLogout = async () => {
		try {
			await signOut(auth);
			// The App.jsx wrapper will automatically detect this and redirect
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<div className="w-full h-full flex flex-col space-y-8 max-w-4xl pb-10">

			{/* --- HEADER --- */}
			<div className="border-b border-slate-800 pb-6 shrink-0">
				<h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">System Configuration</h1>
				<p className="text-slate-400 mt-1">Manage protocol parameters and memory core.</p>
			</div>

			{/* --- IDENTITY SECTION --- */}
			{/* Color Correction: #0f1522 */}
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
					<button
						onClick={handleSaveProfile}
						className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
					>
						{isSaved ? <CheckIcon /> : <Save size={18} />}
						<span>{isSaved ? "Identity Updated" : "Save Changes"}</span>
					</button>
				</div>
			</div>

			{/* --- SYSTEM DIAGNOSTICS --- */}
			{/* Color Correction: #0f1522 */}
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
						<p className="text-2xl font-mono text-blue-400 mt-1">v0.1.0</p>
					</div>
				</div>
			</div>

			{/* --- DANGER ZONE & SESSION CONTROL --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

				{/* Hard Reset */}
				<div className="bg-red-900/5 rounded-2xl border border-red-900/20 p-6">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-red-500/10 rounded-lg text-red-500">
							<AlertTriangle size={24} />
						</div>
						<h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
					</div>
					<p className="text-slate-400 text-sm mb-6">
						Permanently erase all tasks and history.
					</p>
					<button
						onClick={handleHardReset}
						className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-bold transition-all"
					>
						<RefreshCw size={18} />
						<span>Factory Reset</span>
					</button>
				</div>

				{/* Session Logout */}
				<div className="bg-[#0f1522] rounded-2xl border border-slate-800 p-6 shadow-lg">
					<div className="flex items-center space-x-3 mb-4">
						<div className="p-2 bg-slate-700/50 rounded-lg text-white">
							<LogOut size={24} />
						</div>
						<h2 className="text-xl font-bold text-white">Session Control</h2>
					</div>
					<p className="text-slate-400 text-sm mb-6">
						Terminate secure connection and lock the protocol.
					</p>
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
	);
}

// Simple internal icon
const CheckIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="20 6 9 17 4 12"></polyline>
	</svg>
);

export default Settings;
