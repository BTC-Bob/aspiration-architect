// src/pages/History.jsx
import React, { useState, useMemo } from 'react';
import { generateMockHistory } from '../utils/mockHistory';
import { Calendar, TrendingUp, Activity, Moon, Scale, Trophy, ChevronRight } from 'lucide-react';

const History = () => {
    // 1. Load Data (In production, this would fetch from Database)
    const historyData = useMemo(() => generateMockHistory(), []);
    const [selectedDay, setSelectedDay] = useState(historyData[historyData.length - 1]);

    // 2. Calculate Aggregate Stats
    const totalPV = historyData.reduce((acc, day) => acc + day.pv, 0);
    const annualGoal = 4400;
    const progressPct = (totalPV / annualGoal) * 100;
    const avgPV = (totalPV / historyData.length).toFixed(1);

    // 3. Helper for Heatmap Colors
    const getHeatmapColor = (pv) => {
        if (pv === 0) return 'bg-slate-800';
        if (pv < 5) return 'bg-blue-900';
        if (pv < 12) return 'bg-blue-700';
        if (pv < 20) return 'bg-cyan-600';
        return 'bg-amber-500'; // ZENITH
    };

    return (
        <div className="h-screen w-full bg-[#0B1120] text-slate-100 font-sans overflow-hidden flex flex-col">

            {/* --- HEADER: THE SCORECARD --- */}
            <div className="flex-none p-8 border-b border-slate-800 bg-[#0B1120] z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Trophy size={28} className="text-amber-500" />
                            The Vault
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Performance Archive & Biometric Trends</p>
                    </div>

                    {/* MACRO PROGRESS BAR */}
                    <div className="flex-1 max-w-2xl">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                            <span className="text-blue-400">Annual Progression</span>
                            <span className="text-white">{totalPV.toLocaleString()} / {annualGoal.toLocaleString()} PV</span>
                        </div>
                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            ></div>
                            {/* Marker for "Today's Expected Pace" could go here */}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-slate-500 font-mono">PACE: {avgPV} PV/DAY</span>
                            <span className="text-[10px] text-emerald-400 font-bold">{(progressPct).toFixed(1)}% COMPLETE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT: SCROLLABLE --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">

                {/* ZONE B: HEATMAP (The Grid) */}
                <div className="mb-10">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Calendar size={16} /> Consistency Heatmap (Last 90 Days)
                    </h2>
                    {/* CSS GRID FOR HEATMAP */}
                    <div className="flex flex-wrap gap-1">
                        {historyData.map((day, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedDay(day)}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-white transition-all ${getHeatmapColor(day.pv)} ${selectedDay.date === day.date ? 'ring-2 ring-white z-10 scale-110' : 'opacity-80 hover:opacity-100'}`}
                                title={`${day.date}: ${day.pv} PV`}
                            ></div>
                        ))}
                    </div>
                    {/* LEGEND */}
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500 font-bold uppercase">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Rest</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-900 rounded-sm"></div> Fair</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-600 rounded-sm"></div> Good</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> Zenith</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ZONE C: CHARTS (Weight & Sleep) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* CHART 1: WEIGHT TREND */}
                        <div className="bg-[#0f1522] border border-slate-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Scale size={16} className="text-blue-400" /> Weight Trend
                                </h3>
                                <span className="text-xs font-mono text-slate-400">90 Day Moving Avg</span>
                            </div>
                            {/* CUSTOM SVG LINE CHART */}
                            <div className="h-40 w-full relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    {/* Generate Line Path */}
                                    <polyline
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        points={historyData.map((d, i) => {
                                            const x = (i / (historyData.length - 1)) * 100; // % width
                                            const y = 100 - ((d.weight - 200) / (220 - 200)) * 100; // Normalize 200-220lbs range
                                            return `${x * 8},${y * 1.5}`; // Approximate scaling for SVG
                                        }).join(' ')}
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>
                                {/* Grid Lines (Visual only) */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                    <div className="border-t border-slate-500 w-full h-0"></div>
                                    <div className="border-t border-slate-500 w-full h-0"></div>
                                    <div className="border-t border-slate-500 w-full h-0"></div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                                <span>START: {historyData[0].weight} lbs</span>
                                <span>CURRENT: {historyData[historyData.length-1].weight} lbs</span>
                            </div>
                        </div>

                        {/* CHART 2: SLEEP QUALITY */}
                        <div className="bg-[#0f1522] border border-slate-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Moon size={16} className="text-indigo-400" /> Sleep Performance
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-[10px] text-slate-400">80%+</span>
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div> <span className="text-[10px] text-slate-400">&lt;60%</span>
                                </div>
                            </div>
                            {/* CSS BAR CHART */}
                            <div className="h-24 flex items-end gap-[2px]">
                                {historyData.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-sm transition-all hover:opacity-100 ${d.sleep >= 80 ? 'bg-emerald-500/80' : d.sleep >= 60 ? 'bg-indigo-500/50' : 'bg-rose-500/50'}`}
                                        style={{ height: `${d.sleep}%` }}
                                        title={`${d.date}: ${d.sleep}%`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ZONE D: SELECTED DAY ARCHIVE (The Inspector) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-0 bg-[#1A2435] border border-slate-700 rounded-2xl p-6 shadow-2xl">
                            <div className="text-center pb-6 border-b border-slate-600/50">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SELECTED ARCHIVE</div>
                                <h2 className="text-2xl font-bold text-white">{selectedDay.day}</h2>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${getHeatmapColor(selectedDay.pv).replace('bg-', 'bg-').replace('800', '700')} text-white`}>
                                    {selectedDay.pv} PV EARNED
                                </div>
                            </div>

                            <div className="py-6 space-y-4">
                                {/* METRICS GRID */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0B1120] p-3 rounded-xl border border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Weight</div>
                                        <div className="text-lg font-mono text-white">{selectedDay.weight}</div>
                                    </div>
                                    <div className="bg-[#0B1120] p-3 rounded-xl border border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Sleep</div>
                                        <div className={`text-lg font-mono ${selectedDay.sleep > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedDay.sleep}%</div>
                                    </div>
                                    <div className="bg-[#0B1120] p-3 rounded-xl border border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Dig. Sunset</div>
                                        <div className={`text-lg font-bold ${selectedDay.digitalSunset ? 'text-indigo-400' : 'text-slate-600'}`}>{selectedDay.digitalSunset ? 'YES' : 'NO'}</div>
                                    </div>
                                    <div className="bg-[#0B1120] p-3 rounded-xl border border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">PureView</div>
                                        <div className={`text-lg font-bold ${selectedDay.pureView ? 'text-emerald-400' : 'text-slate-600'}`}>{selectedDay.pureView ? 'YES' : 'NO'}</div>
                                    </div>
                                </div>

                                {/* TASK SNAPSHOTS */}
                                <div className="mt-6">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                        <Activity size={12} /> Protocol Log
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedDay.tasks.map((task, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                {task.completed ? <CheckCircleIcon size={14} className="text-blue-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}
                                                <span className={task.completed ? 'text-white' : 'text-slate-500 line-through'}>{task.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon Component
const CheckCircleIcon = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default History;
