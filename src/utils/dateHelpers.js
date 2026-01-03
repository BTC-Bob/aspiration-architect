// src/utils/dateHelpers.js
import { EPOCH_START } from '../config'; // <--- FIXED IMPORT PATH

/**
 * Calculates the current Day Number relative to EPOCH_START.
 * Uses strict MM-DD-YYYY parsing from config/constants.js.
 * * Logic:
 * If Today == EPOCH_START, returns 1.
 * If Today is 1 day after, returns 2.
 */
export const getDayNumber = () => {
	// 1. Parse the MM-DD-YYYY string manually for safety
	const [mm, dd, yyyy] = EPOCH_START.split('-');

	// 2. Create Date Object (Month is 0-indexed in JS: 0=Jan, 11=Dec)
	const start = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
	const now = new Date();

	// 3. Normalize to Midnight (Ignore hours/minutes) to prevent drift
	start.setHours(0, 0, 0, 0);
	now.setHours(0, 0, 0, 0);

	// 4. Calculate difference in days
	const diffTime = now - start;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	// 5. Handle Pre-Launch (Negative days)
	if (diffDays < 0) return 0;

	// 6. Return Day Number (0 diff = Day 1)
	return diffDays + 1;
};

/**
 * Returns today's date formatted strictly as MM-DD-YYYY
 */
export const getFormattedDate = () => {
	const today = new Date();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const yyyy = today.getFullYear();

	return `${mm}-${dd}-${yyyy}`;
};
