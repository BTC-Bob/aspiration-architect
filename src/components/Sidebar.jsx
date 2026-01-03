// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, BookOpen, History, Settings, LogOut } from 'lucide-react';
import { APP_VERSION } from '../config';

const Sidebar = () => {
	const location = useLocation();
	const isActive = (path) => location.pathname === path;

	const MENU_ITEMS = [
		{ label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
		{ label: 'Library',   path: '/library',   icon: <Library         size={20} /> },
		{ label: 'Journal',   path: '/journal',   icon: <BookOpen        size={20} /> },
		{ label: 'History',   path: '/history',   icon: <History         size={20} /> },
		{ label: 'Settings',  path: '/settings',  icon: <Settings        size={20} /> },
	];

	return (
		<aside className="w-64 bg-[#050914] border-r border-slate-800 flex flex-col z-50">

			{/* LOGO AREA + VERSION */}
			<div className="h-24 flex flex-col items-center justify-center px-6 border-b border-slate-800/50 py-4">
				<div className="flex items-center w-full mb-1">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20 flex-shrink-0">
						<span className="text-white font-bold text-xl">A</span>
					</div>

					{/* UPDATE 2: CENTER ALIGN VERSION UNDER NAME */}
					{/* Added 'items-center' to align children (Name & Version) relative to each other */}
					<div className="flex flex-col items-start">
						<span className="text-white font-bold tracking-tight leading-none text-lg">
							Aspiration<span className="text-blue-400">Architect</span>
						</span>
						{/* Centered relative to the text block container via flex alignment if needed,
						    or we leave it aligned start to match the text flow.
						    Based on screenshot, it implies centered under the WORDS.
						    I will use w-full and text-center on the version span to force visual centering. */}
						<span className="text-[9px] text-slate-500 font-mono mt-1 w-full text-center tracking-wider">{APP_VERSION}</span>
					</div>
				</div>
			</div>

			{/* NAVIGATION MENU */}
			<nav className="flex-1 px-4 py-6 space-y-2">
				{MENU_ITEMS.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
							isActive(item.path)
								? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
								: 'text-slate-400 hover:text-white hover:bg-slate-800/50'
						}`}
					>
						<div className={`${isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
							{item.icon}
						</div>
						<span className="font-medium text-sm tracking-wide">{item.label}</span>
					</Link>
				))}
			</nav>

			{/* FOOTER */}
			<div className="p-4 border-t border-slate-800/50">
				{/* UPDATE 3: MAKE SIGN OUT A BUTTON */}
				<button className="flex items-center justify-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-all bg-[#0B1120] border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 shadow-sm active:scale-[0.98] group">
					<LogOut size={18} className="group-hover:text-rose-400 transition-colors" />
					<span className="font-bold text-xs uppercase tracking-wider">Sign Out</span>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
