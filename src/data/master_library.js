// src/data/master_library.js

/**
 * THE MASTER LIBRARY
 * This is the "Menu" of available actions for the day.
 * * STRUCTURE:
 * - id: Unique stable identifier (never change this after using it)
 * - label: The text shown on the dashboard
 * - category: 'health' | 'freedom' | 'love' (Strict for balance logic)
 * - points: Base PV value
 * - tier: 'poor' | 'fair' | 'good' | 'solid' | 'fantastic' | 'zenith'
 * - status: 'active' (shows in list) | 'archived' (hidden history)
 */

export const MASTER_LIBRARY = [
	// ======================================================
	// 🟢 HEALTH (The Vessel)
	// ======================================================
	{
		id: 'h_sleep_poor',
		label: 'Sleep Score < 50% (Penalty)',
		category: 'health',
		points: -5,
		tier: 'poor',
		status: 'active',
		type: 'penalty'
	},
	{
		id: 'h_morning_prayer',
		label: 'Morning Prayer (Recite/Voice Clone)',
		category: 'health',
		points: 3,
		tier: 'fair',
		status: 'active'
	},
	{
		id: 'h_grooming',
		label: 'Full Grooming (Shave/Nails/Heels)',
		category: 'health',
		points: 3,
		tier: 'fair',
		status: 'active'
	},
	{
		id: 'h_pureview_streak',
		label: 'PureView: Wholesome Visuals (Daily)',
		category: 'health',
		points: 5,
		tier: 'good',
		status: 'active'
	},
	{
		id: 'h_gym_cardio',
		label: 'Gym / Treadmill (60m)',
		category: 'health',
		points: 12,
		tier: 'decent', // Maps to 'good' visually
		status: 'active'
	},
	{
		id: 'h_nutrition_plan',
		label: 'Adhered to Nutrition Plan',
		category: 'health',
		points: 10,
		tier: 'good',
		status: 'active'
	},
	{
		id: 'h_sleep_80',
		label: 'Sleep Score > 80% (Whoop)',
		category: 'health',
		points: 20,
		tier: 'solid',
		status: 'active'
	},
	{
		id: 'h_medical_appt',
		label: 'Medical Appointment / Procedure',
		category: 'health',
		points: 15,
		tier: 'solid',
		status: 'active',
		notes: 'Biopsy, Eye Surgery, Checkups'
	},

	// ======================================================
	// 🟠 FREEDOM (The Autonomy)
	// ======================================================
	{
		id: 'f_debt_action',
		label: 'Debt Consolidation Action / Payment',
		category: 'freedom',
		points: 15,
		tier: 'good',
		status: 'active',
		notes: 'Budgeting, Planning, Paying'
	},
	{
		id: 'f_deep_work_cna',
		label: 'CNA Packet Project (Deep Work)',
		category: 'freedom',
		points: 12,
		tier: 'good',
		status: 'active',
		notes: 'Website, Skool, Videos'
	},
	{
		id: 'f_home_maintenance',
		label: 'Home Maintenance / Repairs',
		category: 'freedom',
		points: 5,
		tier: 'good',
		status: 'active',
		notes: 'Cleaning, Fixing, Improving'
	},
	{
		id: 'f_income_boost',
		label: 'Secured Income Boost',
		category: 'freedom',
		points: 30,
		tier: 'fantastic',
		status: 'active'
	},
	{
		id: 'f_subscription_audit',
		label: 'Cancelled Unnecessary Subscription',
		category: 'freedom',
		points: 5,
		tier: 'fair',
		status: 'active'
	},
	{
		id: 'f_creative_work',
		label: 'Creative Work / Side Hustle',
		category: 'freedom',
		points: 10,
		tier: 'good',
		status: 'active',
		notes: 'Tattoo designs, plants, writing'
	},

	// ======================================================
	// 🔴 LOVE (The Connection)
	// ======================================================
	{
		id: 'l_card_gift',
		label: 'Sent Card or Thoughtful Gift',
		category: 'love',
		points: 14,
		tier: 'good',
		status: 'active'
	},
	{
		id: 'l_call_family',
		label: 'Call Family (Mom/Kids/Brother)',
		category: 'love',
		points: 10,
		tier: 'good',
		status: 'active'
	},
	{
		id: 'l_jenda_date',
		label: 'Date Night / Quality Time (Jenda)',
		category: 'love',
		points: 20,
		tier: 'solid',
		status: 'active',
		notes: 'Focused presence'
	},
	{
		id: 'l_intimacy',
		label: 'Fulfilling Intimacy',
		category: 'love',
		points: 25,
		tier: 'solid',
		status: 'active',
		notes: 'Mutual Satisfaction'
	},
	{
		id: 'l_trip_planning',
		label: 'Plan/Book Getaway Trip',
		category: 'love',
		points: 15,
		tier: 'good',
		status: 'active'
	}
];

export const PV_TIERS = {
	poor: { min: -10, label: 'POOR', color: 'text-red-500' },
	fair: { min: 1, label: 'FAIR', color: 'text-slate-400' },
	good: { min: 14, label: 'GOOD', color: 'text-blue-400' },
	solid: { min: 20, label: 'SOLID', color: 'text-emerald-400' },
	fantastic: { min: 38, label: 'FANTASTIC', color: 'text-amber-400' },
	zenith: { min: 100, label: 'ZENITH', color: 'text-purple-500' }
};
