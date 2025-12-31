import React, { useMemo } from 'react';
import { Calendar, TrendingUp, Award, Activity, ArrowUpRight } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

function History() {
	// --- MEMORY CORE LINK ---
	// We read the LIVE tasks to get today's real score
	const [tasks] = useLocalStorage('guardian_tasks', []);

	// --- LOGIC ENGINE ---
	const historyData = useMemo(() => {
		// 1. Calculate TODAY'S Real Score
		const todayScore = tasks.reduce((acc, task) =>
			task.completed ? acc + task.points : acc, 0
		);

		// 2. Generate "Ghost Data" for the previous 6 days (Simulation)
		// In the future, this would come from a real database
		const pastDays = [
			{ day: 'Tue', score: 35, label: 'Dec 23' },
			{ day: 'Wed', score: 42, label: 'Dec 24' },
			{ day: 'Thu', score: 28, label: 'Dec 25' },
			{ day: 'Fri', score: 55, label: 'Dec 26' }, // High score
			{ day: 'Sat', score: 48, label: 'Dec 27' },
			{ day: 'Sun', score: 30, label: 'Dec 28' },
		];

		// 3. Combine for the 7-Day Chart
		return [
			...pastDays,
			{ day: 'Today', score: todayScore, label: 'Dec 29', isToday: true }
		];
	}, [tasks]);

	// Calculate Average
	const averageScore = Math.round(
		historyData.reduce((acc, d) => acc + d.score, 0) / historyData.length
	);

	return (
		<div className="w-full h-full flex flex-col space-y-8">

			{/* --- HEADER --- */}
			<div className="border-b border-slate-800 pb-6 shrink-0">
				<h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Protocol History</h1>
				<p className="text-slate-400 mt-1">Performance metrics and longitudinal analysis.</p>
			</div>

			{/* --- STATS ROW --- */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
				{/* Average Card - Color Correction: #0f1522 */}
				<div className="bg-[#0f1522] p-5 rounded-2xl border border-slate-800 flex items-center space-x-4 shadow-lg">
					<div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
						<Activity size={24} />
					</div>
					<div>
						<p className="text-slate-400 text-xs uppercase font-bold tracking-wider">7-Day Average</p>
						<p className="text-2xl font-bold text-white">{averageScore} PV</p>
					</div>
				</div>

				{/* Best Day Card */}
				<div className="bg-[#0f1522] p-5 rounded-2xl border border-slate-800 flex items-center space-x-4 shadow-lg">
					<div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
						<Award size={24} />
					</div>
					<div>
						<p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Best Performance</p>
						<p className="text-2xl font-bold text-white">55 PV <span className="text-xs text-slate-500 font-normal ml-1">Dec 26</span></p>
					</div>
				</div>

				{/* Momentum Card */}
				<div className="bg-[#0f1522] p-5 rounded-2xl border border-slate-800 flex items-center space-x-4 shadow-lg">
					<div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
						<TrendingUp size={24} />
					</div>
					<div>
						<p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Momentum</p>
						<div className="flex items-center text-green-400 font-bold">
							<span className="text-2xl">Stable</span>
							<ArrowUpRight size={16} className="ml-2" />
						</div>
					</div>
				</div>
			</div>

			{/* --- MAIN CHART: THE WEEKLY PULSE --- */}
			{/* Background Alignment: #0f1522 */}
			<div className="flex-1 bg-[#0f1522] rounded-2xl border border-slate-800 p-8 flex flex-col relative overflow-hidden shadow-2xl">
				<div className="flex justify-between items-center mb-8">
					<h3 className="text-lg font-bold text-white flex items-center">
						<Calendar size={18} className="mr-2 text-slate-400" />
						Weekly Cadence
					</h3>
					<div className="flex items-center space-x-4 text-xs">
						<div className="flex items-center text-slate-400">
							<span className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
							Routine
						</div>
						<div className="flex items-center text-white">
							<span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_#3b82f6]" />
							High Performance
						</div>
						<div className="flex items-center text-green-400">
							<span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_#22c55e]" />
							Target (50+)
						</div>
					</div>
				</div>

				{/* CSS BAR CHART */}
				<div className="flex-1 flex items-end justify-between space-x-2 md:space-x-6 px-4">
					{historyData.map((data, index) => {
						// Logic for bar color/height
						const height = Math.min((data.score / 60) * 100, 100); // Cap at 100% height
						const isTargetMet = data.score >= 50;

						return (
							<div key={index} className="flex-1 flex flex-col items-center group relative">
								{/* Tooltip */}
								<div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded border border-slate-600 mb-2 pointer-events-none whitespace-nowrap z-10">
									{data.score} Points
								</div>

								{/* The Bar */}
								<div className="w-full bg-slate-800/20 rounded-t-lg relative h-full flex items-end overflow-hidden group-hover:bg-slate-800/40 transition-colors">
									{/* Target Line (Background) */}
									<div className="absolute bottom-[83%] w-full h-[1px] bg-slate-700 border-t border-dashed border-slate-600 opacity-50" title="Target Line"></div>

									{/* Fill */}
									<div
										style={{ height: `${height}%` }}
										className={`
											w-full rounded-t-lg transition-all duration-1000 ease-out relative
											${data.isToday
												? (isTargetMet ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-blue-500 shadow-[0_0_20px_#3b82f6]')
												: (isTargetMet ? 'bg-green-500/80' : 'bg-slate-700')
											}
										`}
									>
										{/* Scanline Effect */}
										{data.isToday && (
											<div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 animate-pulse shadow-[0_0_10px_white]"></div>
										)}
									</div>
								</div>

								{/* Label */}
								<div className="mt-4 text-center">
									<p className={`text-sm font-bold ${data.isToday ? 'text-white' : 'text-slate-500'}`}>{data.day}</p>
									<p className="text-[10px] text-slate-600 hidden md:block">{data.label}</p>
								</div>
							</div>
						);
					})}
				</div>

				{/* Target Line Label */}
				<div className="absolute left-4 top-[24%] -translate-y-1/2 text-[10px] font-mono text-slate-600 pointer-events-none">
					TARGET (50 PV)
				</div>
			</div>
		</div>
	);
}

export default History;
