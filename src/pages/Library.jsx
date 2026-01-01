// src/pages/Library.jsx
import React, { useState } from 'react';
import { Database, Plus, Trash2, Sliders, Layers, Clock, Repeat, CheckSquare } from 'lucide-react';
import { MASTER_LIBRARY } from '../data/master_library';

// --- THE GUARDIAN SCORING LOGIC ---
const SCORING_TIERS = [
	{ id: 'neg', label: 'Negative Behavior', quality: 'POOR', min: -5, max: -1, desc: 'Actions to avoid (e.g., Poor Sleep, Junk Food).' },
	{ id: 'lvl1', label: 'L1: Routine & Personal Care', quality: 'FAIR', min: 1, max: 3, desc: 'Maintenance, Grooming, Errands.' },
	{ id: 'lvl2', label: 'L2: Health & Wellness', quality: 'DECENT', min: 8, max: 12, desc: 'Gym, Sleep >60%, Hydration, Nutrition.' },
	{ id: 'lvl3', label: 'L3: Growth & Connection', quality: 'GOOD', min: 14, max: 21, desc: 'Bills Paid, Thoughtful Gifts, Sleep >70%.' },
	{ id: 'lvl4', label: 'L4: Holistic Well-Being', quality: 'SOLID', min: 20, max: 30, desc: 'Side Hustle Work, Home Repairs, Sleep >80%.' },
	{ id: 'lvl5', label: 'L5: Efficiency Achievement', quality: 'WONDERFUL', min: 32, max: 48, desc: 'Business Objectives, Auto-Systems, Automation.' },
	{ id: 'lvl6', label: 'L6: Lifestyle Boost', quality: 'FANTASTIC', min: 38, max: 57, desc: 'Income Boost, Credit Score milestones.' },
	{ id: 'lvl7', label: 'L7: High Impact', quality: 'EXCEPTIONAL', min: 50, max: 79, desc: 'Major Life Upgrades, Perfect Days.' },
	{ id: 'lvl8', label: 'L8: Pinnacle Achievement', quality: 'PINNACLE', min: 80, max: 99, desc: 'Buying Land, New Car, Major Renovation.' },
	{ id: 'lvl9', label: 'L9: Zenith', quality: 'ZENITH', min: 100, max: 150, desc: 'Life-Altering Milestones (Eudemonic Ascent).' },
];

const Library = () => {
	const [library, setLibrary] = useState(MASTER_LIBRARY);

	// FORM STATE
	const [newItem, setNewItem] = useState({
		label: '',
		categories: ['love'],
		tierId: 'lvl2',
		points: 10,
		type: 'habit', // 'habit' or 'project'
		duration: 15   // Minutes
	});

	const PILLARS = ['love', 'health', 'freedom'];

	// TIER HANDLER
	const handleTierChange = (newTierId) => {
		const tier = SCORING_TIERS.find(t => t.id === newTierId);
		setNewItem({
			...newItem,
			tierId: newTierId,
			points: Math.round((tier.min + tier.max) / 2)
		});
	};

	// CATEGORY TOGGLE HANDLER
	const toggleCategory = (cat) => {
		const current = newItem.categories;
		if (current.includes(cat)) {
			if (current.length > 1) {
				setNewItem({ ...newItem, categories: current.filter(c => c !== cat) });
			}
		} else {
			setNewItem({ ...newItem, categories: [...current, cat] });
		}
	};

	const currentTier = SCORING_TIERS.find(t => t.id === newItem.tierId);
	const splitPoints = Math.floor(newItem.points / newItem.categories.length * 10) / 10;

	const handleAddItem = () => {
		if (!newItem.label) return;
		const item = {
			id: Date.now().toString(),
			...newItem,
			category: newItem.categories[0], // Fallback
			status: 'active'
		};
		setLibrary([item, ...library]);
		setNewItem({ ...newItem, label: '' }); // Reset only label
	};

	return (
		<div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

			{/* HEADER */}
			<div className="flex-none p-6 border-b border-slate-800/50 bg-[#0B1120]">
				<div className="flex items-center gap-3">
					<div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
						<Database size={24} className="text-blue-400" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">The Architect's Ledger</h1>
						<p className="text-slate-400 text-sm">Define Protocols based on Time, Energy, and Impact.</p>
					</div>
				</div>
			</div>

			{/* MAIN CONTENT */}
			<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-0">

				{/* LEFT: CALIBRATOR */}
				<div className="lg:col-span-4 p-6 bg-[#0f1522] border-r border-slate-800 overflow-y-auto custom-scrollbar">
					<div className="bg-[#1A2435] border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">

						<h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
							<Sliders size={14} /> Protocol Calibrator
						</h2>

						{/* 1. NAME */}
						<div className="mb-5">
							<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Protocol Name</label>
							<input
								type="text"
								value={newItem.label}
								onChange={(e) => setNewItem({...newItem, label: e.target.value})}
								placeholder="e.g. Deep Work Session"
								className="w-full bg-[#0B1120] border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
							/>
						</div>

						{/* 2. PILLARS */}
						<div className="mb-5">
							<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Pillar Alignment</label>
							<div className="grid grid-cols-3 gap-2">
								{PILLARS.map(cat => {
									const isActive = newItem.categories.includes(cat);
									let activeColor = '';
									if (cat === 'love') activeColor = 'border-rose-500 bg-rose-500/10 text-rose-400';
									if (cat === 'health') activeColor = 'border-cyan-500 bg-cyan-500/10 text-cyan-400';
									if (cat === 'freedom') activeColor = 'border-amber-500 bg-amber-500/10 text-amber-400';
									return (
										<button
											key={cat}
											onClick={() => toggleCategory(cat)}
											className={`relative p-2 rounded-lg border text-xs font-bold uppercase transition-all duration-200 ${
												isActive
												? `${activeColor} shadow-[0_0_10px_rgba(0,0,0,0.3)]`
												: 'border-slate-700 text-slate-600 bg-[#0B1120] hover:border-slate-500'
											}`}
										>
											{cat}
											{isActive && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-current shadow-sm"></div>}
										</button>
									);
								})}
							</div>
							<div className="mt-2 flex flex-wrap gap-2">
								{newItem.categories.length > 1 && newItem.categories.map(cat => (
									<span key={cat} className="text-[9px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
										{splitPoints} PV to {cat.toUpperCase()}
									</span>
								))}
							</div>
						</div>

						{/* 3. TYPE & DURATION (NEW) */}
						<div className="grid grid-cols-2 gap-4 mb-5">
							{/* TYPE TOGGLE */}
							<div>
								<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Type</label>
								<div className="flex bg-[#0B1120] p-1 rounded-lg border border-slate-700">
									<button
										onClick={() => setNewItem({...newItem, type: 'habit'})}
										className={`flex-1 flex items-center justify-center gap-1 py-2 rounded text-[10px] font-bold uppercase ${newItem.type === 'habit' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
									>
										<Repeat size={12} /> Habit
									</button>
									<button
										onClick={() => setNewItem({...newItem, type: 'project'})}
										className={`flex-1 flex items-center justify-center gap-1 py-2 rounded text-[10px] font-bold uppercase ${newItem.type === 'project' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
									>
										<CheckSquare size={12} /> Proj.
									</button>
								</div>
							</div>

							{/* DURATION SLIDER */}
							<div>
								<div className="flex justify-between mb-2">
									<label className="text-[10px] uppercase font-bold text-slate-500">Duration</label>
									<span className="text-xs font-bold text-white">{newItem.duration}m</span>
								</div>
								<input
									type="range" min="5" max="180" step="5"
									value={newItem.duration}
									onChange={(e) => setNewItem({...newItem, duration: parseInt(e.target.value)})}
									className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
								/>
							</div>
						</div>

						{/* 4. TIER */}
						<div className="mb-6">
							<label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center gap-2">
								<Layers size={12} /> Structural Classification
							</label>
							<select
								value={newItem.tierId}
								onChange={(e) => handleTierChange(e.target.value)}
								className="w-full bg-[#0B1120] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
							>
								{SCORING_TIERS.map(tier => (
									<option key={tier.id} value={tier.id}>
										{tier.label} ({tier.min}-{tier.max} PV)
									</option>
								))}
							</select>
						</div>

						{/* 5. POINTS */}
						<div className="mb-8 p-4 rounded-xl bg-[#0B1120] border border-slate-800">
							<div className="flex justify-between items-end mb-4">
								<div>
									<div className="text-[10px] uppercase font-bold text-slate-500">Value (PV)</div>
									<div className="text-2xl font-bold text-white tracking-tighter mt-1">{newItem.points}</div>
								</div>
								<div className="text-right">
									<div className="text-[10px] uppercase font-bold text-slate-500">Quality</div>
									<div className={`text-sm font-bold tracking-widest px-2 py-0.5 rounded mt-1 bg-slate-800 text-blue-400 border border-blue-500/20`}>
										{currentTier.quality}
									</div>
								</div>
							</div>
							<input
								type="range" min={currentTier.min} max={currentTier.max}
								value={newItem.points}
								onChange={(e) => setNewItem({...newItem, points: parseInt(e.target.value)})}
								className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
							/>
						</div>

						{/* SAVE */}
						<button
							onClick={handleAddItem}
							className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
						>
							<Plus size={18} /> INITIALIZE PROTOCOL
						</button>
					</div>
				</div>

				{/* RIGHT: ARCHIVES */}
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
									<div className="font-medium text-slate-200 text-sm flex items-center gap-2">
										{item.type === 'habit' ? <Repeat size={12} className="text-blue-400" /> : <CheckSquare size={12} className="text-amber-400" />}
										{item.label}
									</div>
									<div className="flex items-center gap-2 mt-1 flex-wrap">
										{(item.categories || [item.category]).map(cat => (
											<span key={cat} className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cat === 'health' ? 'text-cyan-400 bg-cyan-950/30' : cat === 'freedom' ? 'text-amber-400 bg-amber-950/30' : 'text-rose-400 bg-rose-950/30'}`}>{cat}</span>
										))}
										<span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
											<Clock size={10} /> {item.duration || 15}m
										</span>
										<span className="text-[10px] text-slate-600 font-bold">• {item.points} PV</span>
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
