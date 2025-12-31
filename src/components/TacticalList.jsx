// src/components/TacticalList.jsx
import React from 'react';
import { Zap, CheckCircle } from 'lucide-react';

/**
 * TACTICAL LIST WIDGET
 * Encapsulates the "Daily Menu" logic.
 * Features: Internal Scrolling, Selection State, and Design System compliance.
 */
const TacticalList = ({ tasks, selectedIds, onToggle }) => {

	// Filter for active tasks (The "Menu")
	// In the future, "Guardian Algorithm" sorting happens here.
	const activeTasks = tasks.filter(t => t.status === 'active');

	return (
		<div className="flex flex-col h-full min-h-0 bg-[#0f1522] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

			{/* WIDGET HEADER (Fixed) */}
			<div className="flex-none p-4 border-b border-slate-800 bg-[#1A2435]/50 flex items-center justify-between backdrop-blur-sm">
				<h2 className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2">
					<Zap size={16} className="text-blue-400" />
					TACTICAL PRIORITIES
				</h2>
				<span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
					{selectedIds.length} / {activeTasks.length} DONE
				</span>
			</div>

			{/* SCROLLABLE LIST AREA */}
			<div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
				{activeTasks.map((task) => {
					const isSelected = selectedIds.includes(task.id);

					// Visual Logic (Preserved from v0.2.0)
					let borderClass = isSelected
						? 'border-blue-500/50 bg-blue-900/10'
						: 'border-slate-800/50 bg-[#0B1120] hover:border-slate-600';

					let iconColor = isSelected ? 'text-blue-400' : 'text-slate-600';
					let textColor = isSelected ? 'text-slate-100' : 'text-slate-400';

					return (
						<div
							key={task.id}
							onClick={() => onToggle(task.id)}
							className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${borderClass}`}
						>
							<div className="flex items-center gap-3 overflow-hidden">
								<div className={`flex-none transition-colors ${iconColor}`}>
									{isSelected ? <CheckCircle size={18} className="fill-blue-500/20" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-700 group-hover:border-slate-500"></div>}
								</div>
								<div className="min-w-0">
									<div className={`font-medium text-sm truncate transition-colors ${textColor}`}>
										{task.label}
									</div>
									<div className="flex items-center gap-2 mt-0.5">
										<span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 rounded-sm ${
											task.category === 'health' ? 'text-cyan-400 bg-cyan-950/30' :
											task.category === 'freedom' ? 'text-amber-400 bg-amber-950/30' :
											'text-rose-400 bg-rose-950/30'
										}`}>
											{task.category}
										</span>
										{task.notes && <span className="text-[10px] text-slate-600 truncate max-w-[150px]">{task.notes}</span>}
									</div>
								</div>
							</div>

							<div className={`flex-none text-xs font-bold px-2 py-1 rounded ${isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
								{task.points > 0 ? '+' : ''}{task.points}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TacticalList;
