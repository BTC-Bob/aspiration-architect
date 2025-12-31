// src/pages/Library.jsx
import React, { useState } from 'react';
import { Database, Plus, Trash2, Save, Sliders, Zap } from 'lucide-react';
import { MASTER_LIBRARY } from '../data/master_library';

// Helper to get pillar color
const getPillarColor = (category) => {
	if (category === 'love') return 'text-rose-400';
	if (category === 'health') return 'text-cyan-400';
	if (category === 'freedom') return 'text-amber-400';
	return 'text-slate-400';
};

const Library = () => {
	// LOCAL STATE (The "Browser Memory" Layer)
	// Eventually, this will sync with Firebase.
	const [library, setLibrary] = useState(MASTER_LIBRARY);
	const [newItem, setNewItem] = useState({
		label: '',
		category: 'freedom',
		points: 10,
		type: 'project'
	});

	// HANDLER: Create New Item
	const handleAddItem = () => {
		if (!newItem.label) return;
		const item = {
			id: Date.now().toString(), // Temporary ID
			...newItem,
			status: 'active',
			tier: 'good' // simplistic auto-tier for now
		};
		setLibrary([item, ...library]);
		setNewItem({ ...newItem, label: '' }); // Reset Form
	};

	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* --- HEADER --- */}
			<div className="flex-none p-6 border-b border-slate-800/50 bg-[#0B1120]">
				<div className="flex items-center gap-3">
					<div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
						<Database size={24} className="text-blue-400" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">The Architect's Ledger</h1>
						<p className="text-slate-400 text-sm">Manage the Master Library of Protocols</p>
					</div>
				</div>
			</div>

			{/* --- MAIN CONTENT (Split View) --- */}
			<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-0">

				{/* LEFT: THE SPECIFICATION CARD (Form) */}
				<div className="lg:col-span-4 p-6 bg-[#0f1522] border-r border-slate-800 overflow-y-auto custom-scrollbar">
					<div className="bg-[#1A2435] border border-slate-700/50 rounded-2xl p-6 shadow-xl">
						<h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
							<Sliders size={14} /> Specification
						</h2>

						{/* INPUT: Title */}
						<div className="mb-5">
							<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Task Protocol Name</label>
							<input
								type="text"
								value={newItem.label}
								onChange={(e) => setNewItem({...newItem, label: e.target.value})}
								placeholder="e.g. Complete CNA Module 1"
								className="w-full bg-[#0B1120] border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
							/>
						</div>

						{/* SELECT: Pillar */}
						<div className="mb-5">
							<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Pillar Alignment</label>
							<div className="grid grid-cols-3 gap-2">
								{['health', 'freedom', 'love'].map(cat => (
									<button
										key={cat}
										onClick={() => setNewItem({...newItem, category: cat})}
										className={`p-2 rounded-lg border text-xs font-bold uppercase transition-all ${
											newItem.category === cat
											? `border-${cat === 'love' ? 'rose' : cat === 'health' ? 'cyan' : 'amber'}-500 bg-${cat === 'love' ? 'rose' : cat === 'health' ? 'cyan' : 'amber'}-500/10 text-white`
											: 'border-slate-700 text-slate-500 hover:border-slate-600'
										}`}
									>
										{cat}
									</button>
								))}
							</div>
						</div>

						{/* SLIDER: Potency */}
						<div className="mb-8">
							<div className="flex justify-between items-end mb-2">
								<label className="text-[10px] uppercase font-bold text-slate-500">Potency (PV)</label>
								<span className="text-xl font-bold text-blue-400">{newItem.points}</span>
							</div>
							<input
								type="range"
								min="1" max="50"
								value={newItem.points}
								onChange={(e) => setNewItem({...newItem, points: parseInt(e.target.value)})}
								className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
							/>
							<div className="flex justify-between text-[10px] text-slate-600 mt-1">
								<span>Low</span>
								<span>Medium</span>
								<span>Critical</span>
							</div>
						</div>

						{/* ACTION: Save */}
						<button
							onClick={handleAddItem}
							className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
						>
							<Plus size={18} /> INITIALIZE PROTOCOL
						</button>
					</div>
				</div>

				{/* RIGHT: THE ARCHIVES (List) */}
				<div className="lg:col-span-8 p-6 overflow-y-auto custom-scrollbar bg-[#0B1120]">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-lg font-bold text-white flex items-center gap-2">
							<Database size={18} className="text-slate-500" />
							Active Archives
						</h2>
						<span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
							{library.length} ENTRIES
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{library.map((item) => (
							<div key={item.id} className="group p-4 rounded-xl border border-slate-800 bg-[#0f1522] hover:border-slate-700 transition-all flex justify-between items-center">
								<div>
									<div className="font-medium text-slate-200 text-sm">{item.label}</div>
									<div className="flex items-center gap-2 mt-1">
										<span className={`text-[10px] font-bold uppercase tracking-wider ${getPillarColor(item.category)}`}>
											{item.category}
										</span>
										<span className="text-[10px] text-slate-600">•</span>
										<span className="text-[10px] text-slate-500">{item.points} PV</span>
									</div>
								</div>
								<button className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-all">
									<Trash2 size={16} />
								</button>
							</div>
						))}
					</div>
				</div>

			</div>
		</div>
	);
};

export default Library;
