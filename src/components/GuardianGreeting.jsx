// src/components/GuardianGreeting.jsx
import React, { useState } from 'react';
import { Sun, Scale, Activity, Eye, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { getFormattedDate } from '../utils/dateHelpers';

// PRE-DEFINED MORNING PRAYER
[cite_start]// Source: ASPIRATION-ARCHITECT-v0.02.docx [cite: 1]
// NOTE: Text remains fully intact.
const PRAYER_TEXT = [
    "As the new day begins, I embrace the opportunity to design a purposeful and fulfilling day.",
    "With each morning, I am reminded that every action contributes to the blueprint of my year.",
    "Today, I step forward with intention and clarity, aligning my actions with my long-term aspirations.",
    "I recognize each decision as a foundational stone in the structure of my year.",
    "I approach my ambitions with dedication and resilience, celebrating both small steps and significant milestones.",
    "In every interaction, I aim to make positive impacts, seeing each as a chance to contribute to my overarching vision.",
    "May this day reflect my journey towards a year of growth, fulfillment, and purpose, aligning my daily efforts with my vision for the future."
];

const GuardianGreeting = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [fade, setFade] = useState(true);

    // FORM STATE (The Architect's Metrics)
    const [data, setData] = useState({
        sleepScore: '',
        weight: '',
        bpSystolic: '',
        bpDiastolic: '',
        pureViewYesterday: null // true/false
    });

    // NAVIGATION HANDLER
    const handleNext = () => {
        setFade(false);
        setTimeout(() => {
            setStep(step + 1);
            setFade(true);
        }, 300);
    };

    // COMPLETION HANDLER
    const handleFinish = () => {
        console.log("Ignition Data Logged:", data);
        const today = getFormattedDate();
        localStorage.setItem(`checkin_${today}`, 'true');
        setFade(false);
        setTimeout(onComplete, 500);
    };

    // --- STEP 1: ALIGNMENT (The Prayer) ---
    if (step === 1) return (
        <div className={`fixed inset-0 z-50 bg-[#0B1120]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-3xl w-full flex flex-col h-full md:h-auto max-h-[95vh] justify-center">

                {/* Header Icon & Title */}
                <div className="text-center mb-6 md:mb-8 flex-none">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <Sun size={14} /> Step 1 of 3: Mindset Alignment
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Architect's Ignition</h1>
                </div>

                {/* The Manifest Container (Creative Enhancement) */}
                <div className="flex-1 min-h-0 mb-8 relative group">
                    {/* glowing backdrop effect */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-indigo-500/5 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                    {/* Main Content Box */}
                    <div className="relative h-full bg-[#1A2435]/80 border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col">
                        {/* Subtle Blueprint Grid Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        {/* Scrollable Text Area */}
                        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
                            <div className="space-y-4 text-left">
                                {PRAYER_TEXT.map((line, i) => (
                                    <p key={i} className="text-sm md:text-base text-slate-200 font-medium leading-loose">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                         {/* Bottom fade aesthetic */}
                        <div className="h-8 bg-gradient-to-t from-[#1A2435] to-transparent absolute bottom-0 left-0 right-0 pointer-events-none"></div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex-none text-center">
                    <button
                        onClick={handleNext}
                        className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase transition-all flex items-center gap-3 mx-auto shadow-lg shadow-blue-900/30 active:scale-[0.98]"
                    >
                        I Am Aligned <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );

    // --- STEP 2: PHYSIOLOGY (Weight & Sleep) ---
    if (step === 2) return (
        <div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="mb-6 flex items-center justify-between relative z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Activity size={20} className="text-blue-400" /> Physiology Check
                    </h2>
                    <span className="text-xs font-bold text-slate-500 uppercase">Step 2 of 3</span>
                </div>

                <div className="space-y-6 relative z-10">
                    {/* SLEEP */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Whoop Sleep Score</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number" placeholder="85"
                                value={data.sleepScore}
                                onChange={(e) => setData({...data, sleepScore: e.target.value})}
                                className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white font-mono text-xl focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-slate-400 font-bold">%</span>
                        </div>
                    </div>

                    {/* WEIGHT */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Morning Weight</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number" placeholder="210.5"
                                value={data.weight}
                                onChange={(e) => setData({...data, weight: e.target.value})}
                                className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white font-mono text-xl focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-slate-400 font-bold">lbs</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={!data.sleepScore || !data.weight}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${(!data.sleepScore || !data.weight) ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                        Next Phase
                    </button>
                </div>
            </div>
        </div>
    );

    // --- STEP 3: VITALS & INTEGRITY (BP & PureView) ---
    if (step === 3) return (
        <div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="mb-6 flex items-center justify-between relative z-10">
                     <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Scale size={20} className="text-emerald-400" /> Vitality & Integrity
                    </h2>
                    <span className="text-xs font-bold text-slate-500 uppercase">Step 3 of 3</span>
                </div>

                <div className="space-y-8 relative z-10">
                    {/* BLOOD PRESSURE */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                            <Heart size={12} /> Blood Pressure (mmHg)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number" placeholder="120"
                                value={data.bpSystolic}
                                onChange={(e) => setData({...data, bpSystolic: e.target.value})}
                                className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white font-mono text-xl text-center focus:border-emerald-500 outline-none"
                            />
                            <span className="text-slate-600 text-xl">/</span>
                            <input
                                type="number" placeholder="80"
                                value={data.bpDiastolic}
                                onChange={(e) => setData({...data, bpDiastolic: e.target.value})}
                                className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white font-mono text-xl text-center focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* PUREVIEW CHECK */}
                    <div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <Eye size={20} className={data.pureViewYesterday === true ? "text-emerald-400" : data.pureViewYesterday === false ? "text-rose-400" : "text-slate-500"} />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white">PureView Integrity Check</h3>
                                <p className="text-xs text-slate-400 mt-1 mb-3">Did you maintain wholesome visual standards yesterday?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setData({...data, pureViewYesterday: true})}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === true ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-emerald-500/50'}`}
                                    >
                                        YES
                                    </button>
                                    <button
                                        onClick={() => setData({...data, pureViewYesterday: false})}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${data.pureViewYesterday === false ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-rose-500/50'}`}
                                    >
                                        NO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                    <button
                        onClick={handleFinish}
                        disabled={!data.bpSystolic || !data.bpDiastolic || data.pureViewYesterday === null}
                        className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 transition-all ${
                            (!data.bpSystolic || !data.bpDiastolic || data.pureViewYesterday === null)
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-900/20'
                        }`}
                    >
                        <CheckCircle size={20} /> Launch Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuardianGreeting;
