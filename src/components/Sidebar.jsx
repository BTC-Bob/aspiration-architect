// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, Settings, Database, LogOut } from 'lucide-react';
import { APP_VERSION } from '../constants';

const Sidebar = () => {
	const navItems = [
		{ icon: LayoutDashboard, label: 'Dashboard', path: '/' },
		{ icon: Database, label: 'Library', path: '/library' }, // NEW LINK
		{ icon: BookOpen, label: 'Journal', path: '/journal' },
		{ icon: History, label: 'History', path: '/history' },
		{ icon: Settings, label: 'Settings', path: '/settings' },
	];

	return (
		<aside className="w-20 lg:w-64 bg-[#0f1522] border-r border-slate-800 flex flex-col flex-none h-screen transition-all duration-300">
			{/* BRAND */}
			<div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800/50">
				<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
					<span className="text-white font-bold text-lg">A</span>
				</div>
				<span className="hidden lg:block ml-3 font-bold text-slate-100 tracking-tight">
					Aspiration<span className="text-blue-500">Architect</span>
				</span>
			</div>

			{/* NAV */}
			<nav className="flex-1 py-6 px-3 space-y-2">
				{navItems.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
								isActive
									? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
									: 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
							}`
						}
					>
						<item.icon size={20} className="shrink-0" />
						<span className="hidden lg:block text-sm font-medium">{item.label}</span>
					</NavLink>
				))}
			</nav>

			{/* FOOTER */}
			<div className="p-4 border-t border-slate-800/50">
				<button className="w-full flex items-center justify-center lg:justify-start gap-3 p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg">
					<LogOut size={18} />
					<span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Sign Out</span>
				</button>
				<div className="hidden lg:block text-center mt-4 text-[10px] text-slate-700 font-mono">
					{APP_VERSION}
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
