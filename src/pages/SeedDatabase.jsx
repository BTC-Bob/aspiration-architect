// src/pages/SeedDatabase.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { writeBatch, doc } from 'firebase/firestore';
import { Database, CheckCircle } from 'lucide-react';

const SeedDatabase = () => {
	const [status, setStatus] = useState('ready'); // ready, seeding, complete, error
	const [log, setLog] = useState([]);

	const addLog = (msg) => setLog(prev => [...prev, msg]);

	const handleSeed = async () => {
		setStatus('seeding');
		setLog([]);
		const batch = writeBatch(db);

		try {
			// --- 1. CATEGORIES (The Rules) ---
			// Distributions based on Master Spec v0.3 & Journal Examples
			// Order: Love (R), Health (C), Freedom (A)
			const categories = [
				// LOVE PRIMARY (60% Love, 10% Health, 30% Freedom)
				{ id: 'cat_spiritual', name: 'Spiritual / Prayer', dist: { l: 0.6, h: 0.3, f: 0.1 }, tier: 'high-impact' },
				{ id: 'cat_relationship', name: 'Relationship / Quality Time', dist: { l: 0.7, h: 0.1, f: 0.2 }, tier: 'high-impact' },
				{ id: 'cat_family', name: 'Family / Household', dist: { l: 0.6, h: 0.2, f: 0.2 }, tier: 'standard' },
				{ id: 'cat_travel', name: 'Travel / Vacation', dist: { l: 0.5, h: 0.3, f: 0.2 }, tier: 'high-impact' },
				{ id: 'cat_service', name: 'Volunteering / Service', dist: { l: 0.8, h: 0.1, f: 0.1 }, tier: 'standard' },

				// HEALTH PRIMARY (10% Love, 60% Health, 30% Freedom)
				{ id: 'cat_exercise', name: 'Exercise / Fitness', dist: { l: 0.1, h: 0.6, f: 0.3 }, tier: 'high-impact' },
				{ id: 'cat_nutrition', name: 'Nutrition / Meal Prep', dist: { l: 0.2, h: 0.7, f: 0.1 }, tier: 'standard' },
				{ id: 'cat_sleep', name: 'Sleep / Recovery', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },
				{ id: 'cat_rest', name: 'Rest / Leisure', dist: { l: 0.2, h: 0.6, f: 0.2 }, tier: 'standard' },
				{ id: 'cat_grooming', name: 'Personal Care / Grooming', dist: { l: 0.3, h: 0.5, f: 0.2 }, tier: 'maintenance' },
				{ id: 'cat_medical', name: 'Medical / Appointments', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'high-impact' },

				// FREEDOM PRIMARY (10% Love, 20% Health, 70% Freedom)
				{ id: 'cat_deepwork', name: 'Deep Work (Career)', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'high-impact' },
				{ id: 'cat_finance', name: 'Finance / Budgeting', dist: { l: 0.1, h: 0.1, f: 0.8 }, tier: 'standard' },
				{ id: 'cat_creative', name: 'Creative / Side Hustle', dist: { l: 0.2, h: 0.2, f: 0.6 }, tier: 'high-impact' },
				{ id: 'cat_learning', name: 'Learning / Skill Building', dist: { l: 0.1, h: 0.3, f: 0.6 }, tier: 'standard' },
				{ id: 'cat_home_maint', name: 'Home Maintenance', dist: { l: 0.3, h: 0.2, f: 0.5 }, tier: 'maintenance' },
				{ id: 'cat_auto_maint', name: 'Auto Maintenance', dist: { l: 0.1, h: 0.2, f: 0.7 }, tier: 'maintenance' },

				// BALANCED (Admin Example: 40% Love, 20% Health, 40% Freedom)
				{ id: 'cat_admin', name: 'Admin / Errands', dist: { l: 0.4, h: 0.2, f: 0.4 }, tier: 'maintenance' },

				// NEGATIVE (Penalties)
				{ id: 'neg_integrity', name: 'Negative: Integrity Slip', dist: { l: 0.4, h: 0.2, f: 0.4 }, tier: 'negative' },
				{ id: 'neg_health', name: 'Negative: Poor Health Choice', dist: { l: 0.1, h: 0.8, f: 0.1 }, tier: 'negative' },
			];

			categories.forEach(cat => {
				const ref = doc(db, 'categories', cat.id);
				batch.set(ref, cat);
			});
			addLog(`Prepared ${categories.length} Categories...`);

			// --- 2. HABITS (The Building Blocks) ---
			const habits = [
				{ id: 'hab_hydrate', name: 'Hydrate (16oz)', categoryId: 'cat_nutrition', duration: 15, valueTier: 'maintenance', icon: '💧' },
				{ id: 'hab_make_bed', name: 'Make Bed', categoryId: 'cat_home_maint', duration: 5, valueTier: 'maintenance', icon: '🛏' },
				{ id: 'hab_prayer', name: 'Morning Prayer', categoryId: 'cat_spiritual', duration: 10, valueTier: 'standard', icon: '🙏' },
				{ id: 'hab_stretch', name: 'Morning Stretch', categoryId: 'cat_exercise', duration: 10, valueTier: 'standard', icon: '🧘' },
				{ id: 'hab_calendar', name: 'Review Calendar', categoryId: 'cat_admin', duration: 5, valueTier: 'maintenance', icon: '📅' },
				{ id: 'hab_shutdown', name: 'Digital Sunset', categoryId: 'cat_sleep', duration: 30, valueTier: 'high-impact', icon: '🌑' },
				{ id: 'hab_reflect', name: 'Evening Reflection', categoryId: 'cat_spiritual', duration: 15, valueTier: 'standard', icon: '💭' },
			];

			habits.forEach(hab => {
				const ref = doc(db, 'habits', hab.id);
				batch.set(ref, hab);
			});
			addLog(`Prepared ${habits.length} Habits...`);

			// --- 3. PROTOCOLS (The Containers) ---
			const protocols = [
				{
					id: 'protocol_morning',
					name: 'Morning Protocol',
					icon: '☀',
					timeOfDay: 'morning',
					schedule: { type: 'daily', days: [0,1,2,3,4,5,6] },
					habitIds: ['hab_make_bed', 'hab_hydrate', 'hab_stretch', 'hab_calendar', 'hab_prayer'],
					completionBonus: 5
				},
				{
					id: 'protocol_evening',
					name: 'Evening Protocol',
					icon: '☾',
					timeOfDay: 'evening',
					schedule: { type: 'daily', days: [0,1,2,3,4,5,6] },
					habitIds: ['hab_shutdown', 'hab_reflect'],
					completionBonus: 5
				}
			];

			protocols.forEach(proto => {
				const ref = doc(db, 'protocols', proto.id);
				batch.set(ref, proto);
			});
			addLog(`Prepared ${protocols.length} Protocols...`);

			// COMMIT
			await batch.commit();
			addLog('BATCH WRITE COMMITTED SUCCESSFULLY.');
			setStatus('complete');

		} catch (error) {
			console.error(error);
			addLog(`ERROR: ${error.message}`);
			setStatus('error');
		}
	};

	return (
		<div className="min-h-screen bg-[#0B1120] text-slate-300 p-12 flex flex-col items-center justify-center font-sans">
			<div className="max-w-2xl w-full bg-[#0f1522] border border-slate-800 rounded-3xl p-8 shadow-2xl">
				<div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-6">
					<div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
						<Database size={32} />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white">Genesis Script (v0.3)</h1>
						<p className="text-slate-500">Database Seeding Utility</p>
					</div>
				</div>

				<div className="bg-slate-950 rounded-xl p-6 font-mono text-xs text-slate-400 h-64 overflow-y-auto mb-8 border border-slate-800">
					{log.length === 0 ? <span className="opacity-30">// Ready to initialize system...</span> : log.map((l, i) => <div key={i}>{l}</div>)}
				</div>

				<div className="flex justify-end">
					{status === 'complete' ? (
						<button disabled className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold">
							<CheckCircle size={20} /> System Online
						</button>
					) : (
						<button
							onClick={handleSeed}
							disabled={status === 'seeding'}
							className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
						>
							{status === 'seeding' ? 'Initializing...' : 'Execute Genesis Seed'}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SeedDatabase;
