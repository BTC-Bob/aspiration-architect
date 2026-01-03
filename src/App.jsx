// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import History from './pages/History';
import { APP_NAME, APP_VERSION } from './config'; // Import Source of Truth

const App = () => {

	// UPDATE 1: DYNAMIC TITLE INJECTION
	// This ensures the Browser Tab ALWAYS matches the config.js version
	useEffect(() => {
		document.title = `${APP_NAME} ${APP_VERSION}`;
	}, []);

	return (
		<Router>
			<div className="flex h-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden">
				{/* SIDEBAR NAVIGATION */}
				<Sidebar />

				{/* MAIN CONTENT AREA */}
				<main className="flex-1 relative overflow-hidden flex flex-col">
					<Routes>
						{/* DEFAULT ROUTE */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />

						{/* PAGES */}
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/library"   element={<Library />} />
						<Route path="/history"   element={<History />} />

						{/* FUTURE PAGES */}
						<Route path="/journal"   element={<div className="p-10 text-slate-500">Journal Module Coming Soon...</div>} />
						<Route path="/settings"  element={<div className="p-10 text-slate-500">Settings Module Coming Soon...</div>} />
					</Routes>
				</main>
			</div>
		</Router>
	);
};

export default App;
