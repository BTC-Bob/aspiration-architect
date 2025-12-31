/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class', // Enforce dark mode preference
	theme: {
		extend: {
			colors: {
				// THE DEEP SPACE THEME (Design System v1.1)
				guardian: {
					bg: '#0B1120',      // Main App Background
					card: '#0f1522',    // Standard Card
					pv: '#1A2435',      // High-Contrast PV Card
					border: '#1e293b',  // matching slate-800
				},
				// THE 3 PILLARS (Strict Hex Codes)
				pillar: {
					love: '#ef4444',    // Red-500
					health: '#06b6d4',  // Cyan-500
					freedom: '#f59e0b', // Amber-500
				},
				// GRADIENT STOPS (For Gauges/Backgrounds)
				'love-start': '#1e1b2e',
				'love-end': '#0f172a',
				'health-start': '#0f2231',
				'health-end': '#0f172a',
				'freedom-start': '#1f1e1b',
				'freedom-end': '#0f172a',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
