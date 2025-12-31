import React, { useState, useEffect } from 'react';
import { Search, PenTool, Calendar, Save, Trash2, Plus, Clock, ChevronLeft, FileText, Sparkles } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage'; // MEMORY CORE

function Journal() {
	// --- STATE ENGINE (PERSISTENT) ---
	// 1. Journal Database - Now saves to local storage!
	const [entries, setEntries] = useLocalStorage('guardian_journal', [
		{
			id: 1,
			title: "Morning Alignment",
			body: "Felt a bit scattered this morning. Need to focus on the 'Freedom' pillar today. The CNA packet is the bottleneck.",
			date: "Dec 29",
			time: "07:30 AM",
			tags: ["Reflection", "Strategy"]
		},
		{
			id: 2,
			title: "Weekly Review",
			body: "Good progress on health. Sleep score was 85% average. Need to be more intentional about calling Mom.",
			date: "Dec 28",
			time: "08:00 PM",
			tags: ["Review"]
		}
	]);

	// 2. Interface State (UI state doesn't need to save)
	const [selectedId, setSelectedId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// 3. Editor State
	const [editorTitle, setEditorTitle] = useState("");
	const [editorBody, setEditorBody] = useState("");
	const [isDirty, setIsDirty] = useState(false);

	// --- LOGIC ENGINE ---

	// Select an Entry
	const handleSelectEntry = (entry) => {
		setSelectedId(entry.id);
		setEditorTitle(entry.title);
		setEditorBody(entry.body);
		setIsDirty(false);
	};

	// Create New Entry
	const handleNewEntry = () => {
		const newId = Date.now();
		const now = new Date();
		const newEntry = {
			id: newId,
			title: "New Reflection",
			body: "",
			date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
			time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			tags: ["Draft"]
		};
		setEntries([newEntry, ...entries]); // Add to top
		handleSelectEntry(newEntry);
	};

	// Save Entry
	const handleSave = () => {
		setEntries(entries.map(entry =>
			entry.id === selectedId
				? { ...entry, title: editorTitle, body: editorBody, tags: ["Saved"] }
				: entry
		));
		setIsDirty(false);
	};

	// Delete Entry
	const handleDelete = (id) => {
		setEntries(entries.filter(e => e.id !== id));
		if (selectedId === id) {
			setSelectedId(null);
			setEditorTitle("");
			setEditorBody("");
		}
	};

	// Search Filter
	const filteredEntries = entries.filter(entry =>
		entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		entry.body.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Detect Changes
	useEffect(() => {
		if (selectedId) {
			const currentEntry = entries.find(e => e.id === selectedId);
			if (currentEntry && (editorTitle !== currentEntry.title || editorBody !== currentEntry.body)) {
				setIsDirty(true);
			} else {
				setIsDirty(false);
			}
		}
	}, [editorTitle, editorBody, selectedId, entries]);


	return (
		<div className="w-full h-full flex flex-col space-y-6">

			{/* --- HEADER --- */}
			<div className="flex items-center justify-between pb-6 border-b border-slate-800 shrink-0">
				<div>
					<h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Journal & Reflection</h1>
					<p className="text-slate-400 mt-1">Capture your thoughts. Clear your mind.</p>
				</div>
				<button
					onClick={handleNewEntry}
					className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
				>
					<PenTool size={18} />
					<span>New Entry</span>
				</button>
			</div>

			{/* --- MAIN WORKSPACE --- */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">

				{/* === LEFT: ENTRY LIST (4 cols) === */}
				{/* Color Correction: #0f1522 */}
				<div className="lg:col-span-4 bg-[#0f1522] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
					{/* Search Bar */}
					<div className="p-4 border-b border-slate-800">
						<div className="relative group">
							<Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search entries..."
								className="w-full bg-[#0B1120] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
							/>
						</div>
					</div>

					{/* List Container */}
					<div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
						{filteredEntries.length > 0 ? (
							filteredEntries.map((entry) => (
								<div
									key={entry.id}
									onClick={() => handleSelectEntry(entry)}
									className={`
										p-4 rounded-xl border cursor-pointer transition-all duration-200 group
										${selectedId === entry.id
											? 'bg-blue-900/20 border-blue-500/50 shadow-md'
											: 'bg-transparent border-transparent hover:bg-[#1e293b] hover:border-slate-700'}
									`}
								>
									<div className="flex justify-between items-center mb-1">
										<span className={`text-xs font-bold ${selectedId === entry.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`}>
											{entry.date}
										</span>
										<span className="text-[10px] text-slate-600 font-mono">{entry.time}</span>
									</div>
									<h4 className={`text-sm font-bold mb-1 truncate ${selectedId === entry.id ? 'text-white' : 'text-slate-300'}`}>
										{entry.title}
									</h4>
									<p className="text-xs text-slate-500 truncate line-clamp-1">
										{entry.body || "No additional text..."}
									</p>
								</div>
							))
						) : (
							<div className="text-center py-10 opacity-50">
								<FileText size={32} className="mx-auto text-slate-600 mb-2" />
								<p className="text-sm text-slate-500">No entries found.</p>
							</div>
						)}
					</div>
				</div>

				{/* === RIGHT: EDITOR (8 cols) === */}
				{/* Color Correction: #0f1522 */}
				<div className="lg:col-span-8 bg-[#0f1522] rounded-2xl border border-slate-800 flex flex-col overflow-hidden relative shadow-lg">

					{selectedId ? (
						<>
							{/* Editor Toolbar */}
							<div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0f1522]">
								<div className="flex items-center space-x-2 text-slate-500 text-xs">
									<Clock size={14} />
									<span>Last edited just now</span>
								</div>

								<div className="flex items-center space-x-3">
									<button
										onClick={() => handleDelete(selectedId)}
										className="p-2 text-slate-500 hover:text-red-400 transition-colors"
										title="Delete Entry"
									>
										<Trash2 size={18} />
									</button>
									<button
										onClick={handleSave}
										disabled={!isDirty}
										className={`
											flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
											${isDirty
												? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
												: 'bg-slate-800 text-slate-500 cursor-not-allowed'}
										`}
									>
										<Save size={16} />
										<span>{isDirty ? "Save Changes" : "Saved"}</span>
									</button>
								</div>
							</div>

							{/* Input Area */}
							<div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
								<input
									type="text"
									value={editorTitle}
									onChange={(e) => setEditorTitle(e.target.value)}
									placeholder="Entry Title..."
									className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder-slate-600 focus:outline-none mb-6"
								/>
								<textarea
									value={editorBody}
									onChange={(e) => setEditorBody(e.target.value)}
									placeholder="What is on your mind, Architect? The page is listening..."
									className="w-full h-full bg-transparent border-none text-lg text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
								/>
							</div>
						</>
					) : (
						/* Empty State */
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50 select-none">
							<div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
								<Sparkles size={40} className="text-blue-500/50" />
							</div>
							<h2 className="text-2xl font-bold text-white mb-2">Ready to Reflect?</h2>
							<p className="text-slate-400 max-w-md mx-auto mb-8">
								Select an entry from the left, or create a new one to start documenting your journey.
							</p>
							<button
								onClick={handleNewEntry}
								className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-2 transition-colors"
							>
								<Plus size={20} />
								<span>Create First Entry Today</span>
							</button>
						</div>
					)}
				</div>

			</div>
		</div>
	);
}

export default Journal;
