// src/components/GuardianGreeting.jsx
import React, { useState } from 'react';
import { Sun, Scale, Activity, Eye, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { getFormattedDate } from '../utils/dateHelpers';

// --- CONFIGURATION ---
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

// Helper: Highlights specific words with a "Glowing" effect
const HighlightedText = ({ text }) => {
    // Escape special regex characters just in case
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b(${KEYWORDS_TO_HIGHLIGHT.map(escapeRegExp).join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return (
        <span>
            {parts.map((part, i) =>
                KEYWORDS_TO_HIGHLIGHT.some(k => k.toLowerCase() === part.toLowerCase()) ? (
                    <span key={i} className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500 hover:text-cyan-300">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

const GuardianGreeting = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [fade, setFade] = useState(true);

    // FORM STATE
    const [data, setData] = useState({
        sleepScore: '',
        weight: '',
        bpSystolic: '',
        bpDiastolic: '',
        pureViewYesterday: null
    });

    const handleNext = () => {
        setFade(false);
        setTimeout(() => {
            setStep(step + 1);
            setFade(true);
        }, 300);
    };

    const handleFinish = () => {
        console.log("Ignition Data Logged:", data);
        const today = getFormattedDate();
        localStorage.setItem(`checkin_${today}`, 'true');
        setFade(false);
        setTimeout(onComplete, 500);
    };

    // --- STEP 1: MINDSET (THE GLOWING MANIFEST) ---
    if (step === 1) return (
        <div className={`fixed inset-0 z-50 bg-[#050914] flex items-center justify-center p-4 transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>

            <div className="max-w-4xl w-full flex flex-col h-full md:h-auto max-h-[95vh]">

                {/* Header Badge */}
                <div className="text-center mb-8 flex-none">
                    <div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
                        <Sun size={14} className="text-blue-400 animate-pulse" />
                        <span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">The Architect's Ignition</span>
                    </div>
                </div>

                {/* The Manifest Container */}
                <div className="flex-1 min-h-0 mb-10 relative group">
                    {/* Atmospheric Glow Behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative h-full overflow-y-auto custom-scrollbar px-4 md:px-12 text-center flex flex-col justify-center space-y-8">
                        {PRAYER_LINES.map((line, i) => (
                            <p key={i} className="text-base md:text-xl text-slate-300 font-medium leading-relaxed tracking-wide">
                                <HighlightedText text={line} />
                            </p>
                        ))}
                    </div>
                </div>

                {/* Pulsating Action Button */}
                <div className="flex-none text-center pb-8">
                    <button
                        onClick={handleNext}
                        className="relative group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold tracking-[0.15em] uppercase transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95"
                    >
                        <span className="flex items-center gap-3">
                            I Am Aligned <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Ping Effect Ring */}
                        <span className="absolute -inset-1 rounded-2xl border border-blue-400/50 opacity-0 group-hover:opacity-100 animate-ping pointer-events-none"></span>
                    </button>
                </div>
            </div>
        </div>
    );

    // --- STEP 2: PHYSIOLOGY ---
    if (step === 2) return (
        <div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Activity size={20} className="text-blue-400" /> Physiology Check
                </h2>
                <div className="space-y-6">
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
                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                    <button onClick={handleNext} disabled={!data.sleepScore || !data.weight} className={`px-6 py-3 rounded-xl font-bold text-sm ${(!data.sleepScore || !data.weight) ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white'}`}>Next Phase</button>
                </div>
            </div>
        </div>
    );

    // --- STEP 3: VITALS ---
    if (step === 3) return (
        <div className={`fixed inset-0 z-50 bg-[#0B1120] flex items-center justify-center p-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-md w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Scale size={20} className="text-emerald-400" /> Vitality & Integrity
                </h2>
                <div className="space-y-8">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Heart size={12} /> Blood Pressure</label>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="120" value={data.bpSystolic} onChange={(e) => setData({...data, bpSystolic: e.target.value})} className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white text-xl text-center focus:border-emerald-500 outline-none" />
                            <span className="text-slate-600 text-xl">/</span>
                            <input type="number" placeholder="80" value={data.bpDiastolic} onChange={(e) => setData({...data, bpDiastolic: e.target.value})} className="w-24 bg-[#1A2435] border border-slate-700 rounded-xl p-3 text-white text-xl text-center focus:border-emerald-500 outline-none" />
                        </div>
                    </div>
                    <div className="bg-[#1A2435]/50 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <Eye size={20} className={data.pureViewYesterday === true ? "text-emerald-400" : "text-slate-500"} />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white">PureView Integrity Check</h3>
                                <p className="text-xs text-slate-400 mt-1 mb-3">Maintained standards yesterday?</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setData({...data, pureViewYesterday: true})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border ${data.pureViewYesterday === true ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>YES</button>
                                    <button onClick={() => setData({...data, pureViewYesterday: false})} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border ${data.pureViewYesterday === false ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>NO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <button onClick={handleFinish} disabled={!data.bpSystolic || !data.bpDiastolic || data.pureViewYesterday === null} className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 ${(!data.bpSystolic || !data.bpDiastolic || data.pureViewYesterday === null) ? 'bg-slate-800 text-slate-600' : 'bg-emerald-600 text-white'}`}>
                        <CheckCircle size={20} /> Launch Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuardianGreeting;
