import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import History from './pages/History'; // RESTORED
import Settings from './pages/Settings';
import Login from './pages/Login';

// --- SECURITY COMPONENT ---
// This wrapper checks if you are logged in.
const ProtectedRoute = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	if (loading) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-[#0B1120] text-blue-500">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
			</div>
		);
	}

	if (!user) {
		// If not logged in, KICK to login page
		return <Navigate to="/login" replace />;
	}

	return children;
};

// --- MAIN LAYOUT ---
const AppLayout = ({ children }) => {
	const location = useLocation();
	const isLoginPage = location.pathname === '/login';

	return (
		<div className="flex h-screen bg-[#0B1120] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
			{!isLoginPage && <Sidebar />}
			<main className={`flex-1 overflow-y-auto overflow-x-hidden relative ${!isLoginPage ? 'p-4 md:p-8' : 'p-0'}`}>
				<div className={`max-w-7xl mx-auto h-full ${!isLoginPage ? '' : 'flex flex-col'}`}>
					 {children}
				</div>
			</main>
		</div>
	);
};

function App() {
	return (
		<Router>
			<AppLayout>
				<Routes>
					<Route path="/login" element={<Login />} />

					{/* ALL OTHER ROUTES ARE LOCKED */}
					<Route path="/" element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					} />
					<Route path="/journal" element={
						<ProtectedRoute>
							<Journal />
						</ProtectedRoute>
					} />
					<Route path="/history" element={
						<ProtectedRoute>
							<History />
						</ProtectedRoute>
					} />
					<Route path="/settings" element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					} />
				</Routes>
			</AppLayout>
		</Router>
	);
}

export default App;
