// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Library from './pages/Library'; // NEW IMPORT
// import Journal from './pages/Journal'; (Existing placeholders)
// import History from './pages/History';
// import Settings from './pages/Settings';
// import Login from './pages/Login';

const App = () => {
	// Simple Layout Wrapper
	const AppLayout = ({ children }) => (
		<div className="flex min-h-screen bg-[#0B1120]">
			<Sidebar />
			<main className="flex-1 h-screen overflow-hidden">
				{children}
			</main>
		</div>
	);

	return (
		<Router>
			<Routes>
				{/* Public Routes */}
				{/* <Route path="/login" element={<Login />} /> */}

				{/* Protected Routes */}
				<Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
				<Route path="/library" element={<AppLayout><Library /></AppLayout>} /> {/* NEW ROUTE */}

				{/* Placeholders for future phases */}
				<Route path="/journal" element={<AppLayout><div className="p-10 text-slate-500">Journal Module Loading...</div></AppLayout>} />
				<Route path="/history" element={<AppLayout><div className="p-10 text-slate-500">History Module Loading...</div></AppLayout>} />
				<Route path="/settings" element={<AppLayout><div className="p-10 text-slate-500">Settings Module Loading...</div></AppLayout>} />
			</Routes>
		</Router>
	);
};

export default App;
