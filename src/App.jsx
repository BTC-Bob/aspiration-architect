// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GuardianProvider } from './context/GuardianContext';

// Components
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import History from './pages/History';
import Settings from './pages/Settings';
import SeedDatabase from './pages/SeedDatabase'; // Temporary Utility

import { APP_NAME, APP_VERSION } from './config';

const App = () => {

	// DYNAMIC BROWSER TITLE INJECTION
	useEffect(() => {
		document.title = `${APP_NAME} ${APP_VERSION}`;
	}, []);

	return (
		<GuardianProvider>
			<Router>
				<div className="flex h-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden">
					{/* NAVIGATION SIDEBAR */}
					<Sidebar />

					{/* MAIN CONTENT AREA */}
					<main className="flex-1 relative overflow-hidden flex flex-col">
						<Routes>
							{/* REDIRECT ROOT TO DASHBOARD */}
							<Route path="/" element={<Navigate to="/dashboard" replace />} />

							{/* CORE WORKFLOW */}
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/library"   element={<Library />} />
							<Route path="/history"   element={<History />} />
							<Route path="/settings"  element={<Settings />} />

							{/* UTILITY (Temporary) */}
							<Route path="/seed"      element={<SeedDatabase />} />

							{/* PLACEHOLDERS */}
							<Route path="/journal"   element={<div className="p-10 text-slate-500">Journal Module Coming Soon...</div>} />
						</Routes>
					</main>
				</div>
			</Router>
		</GuardianProvider>
	);
};

export default App;
