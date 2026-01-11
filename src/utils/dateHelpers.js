// src/utils/dateHelpers.js
import { EPOCH_START } from '../config';

/**
 * MASTER DATE UTILITIES
 * Enforces strict "MM-DD-YYYY" format and handles Epoch calculations.
 */

// --- 1. EPOCH LOGIC (PRESERVED FROM v0.2) ---

/**
 * Calculates the current Day Number relative to EPOCH_START.
 * Logic: If Today == EPOCH_START, returns 1.
 */
export const getDayNumber = () => {
	if (!EPOCH_START) return 1; // Fallback if config is missing

	// Parse MM-DD-YYYY manually to avoid timezone issues
	const [mm, dd, yyyy] = EPOCH_START.split('-');

	// Create Date Objects (Month is 0-indexed)
	const start = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
	const now = new Date();

	// Normalize to Midnight
	start.setHours(0, 0, 0, 0);
	now.setHours(0, 0, 0, 0);

	// Calculate difference
	const diffTime = now - start;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	// Handle Pre-Launch or Same Day
	if (diffDays < 0) return 0;
	return diffDays + 1;
};


// --- 2. FORMATTING UTILITIES (NEW v0.3) ---

/**
 * Returns "MM-DD-YYYY" string.
 * Supports optional date argument (defaults to Today).
 */
export const getFormattedDate = (date = new Date()) => {
	const d = new Date(date);
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const year = d.getFullYear();
	return `${month}-${day}-${year}`;
};

/**
 * Returns "Monday", "Tuesday", etc.
 */
export const getDayName = (date = new Date()) => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[date.getDay()];
};

/**
 * Returns "Morning", "Afternoon", or "Evening" based on current hour.
 * Used for the Dashboard Greeting.
 */
export const getGreetingTime = () => {
	const hour = new Date().getHours();
	if (hour < 5) return 'Burning late'; // Late night logic from specs
	if (hour < 12) return 'Morning';
	if (hour < 17) return 'Afternoon'; // 12pm - 4:59pm
	return 'Evening'; // 5pm+
};

/**
 * Returns an array of date strings (MM-DD-YYYY) for the current week.
 * Starts on Sunday.
 */
export const getCurrentWeek = () => {
	const curr = new Date();
	const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
	const week = [];

	for (let i = 0; i < 7; i++) {
		let next = new Date(curr.getTime());
		next.setDate(first + i);
		week.push(getFormattedDate(next));
	}
	return week;
};

/**
 * Returns a readable date like "Jan 11, 2026".
 * Input: "MM-DD-YYYY" string.
 */
export const getReadableDate = (dateString) => {
	if (!dateString) return '';
	const [month, day, year] = dateString.split('-');
	// Note: Date constructor uses 0-indexed month
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
};
