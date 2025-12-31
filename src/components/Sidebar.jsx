import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, History, Settings } from 'lucide-react';
import { APP_VERSION } from '../constants'; // IMPORT TRUTH

function Sidebar() {
	const navItems = [
		{ path: '/', icon: Home, label: 'Dashboard' },
		{ path: '/journal', icon: BookOpen, label: 'Journal' },
		{ path: '/history', icon: History, label: 'History' },
		{ path: '/settings', icon: Settings, label: 'Settings' },
	];

	return (
		<>
			{/* DESKTOP SIDEBAR (Left) */}
			{/* Color Correction: Aligned to Design System (#0f1522) */}
			<div className="hidden lg:flex flex-col w-64 h-full bg-[#0f1522] border-r border-slate-800 shrink-0 z-20 shadow-2xl">

				{/* Logo Area - Centered Alignment */}
				<div className="p-6 flex flex-col items-center justify-center border-b border-slate-800 h-24">
					<div className="flex items-baseline space-x-2">
						<h1 className="text-lg font-bold text-white tracking-tight leading-none whitespace-nowrap">
							Aspiration<span className="text-blue-500">Architect</span>
						</h1>
						<span className="text-[10px] text-slate-500 font-mono tracking-wide">
							{APP_VERSION}
						</span>
					</div>
					<p className="text-[10px] text-blue-400 font-bold tracking-widest mt-1 uppercase shadow-blue-900/50 drop-shadow-sm">
						Guardian Protocol
					</p>
				</div>

				{/* Navigation Items */}
				<nav className="flex-1 p-4 space-y-2 mt-4">
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							className={({ isActive }) => `
								flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
								${isActive
									? 'bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.6)] border border-blue-500 translate-x-1'
									: 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:translate-x-1'}
							`}
						>
							{({ isActive }) => (
								<>
									<item.icon
										size={20}
										className={isActive ? "text-white" : "transition-colors group-hover:text-blue-400"}
									/>
									<span className="font-medium text-sm relative z-10 tracking-wide">{item.label}</span>

									{/* Subtle Shine Effect (Inactive only) */}
									{!isActive && (
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
									)}
								</>
							)}
						</NavLink>
					))}
				</nav>

				{/* User Status / Footer */}
				<div className="p-4 border-t border-slate-800 bg-[#0B1120]">
					<div className="bg-slate-900/50 rounded-xl p-3 flex items-center space-x-3 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group">
						<div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center group-hover:scale-105 transition-transform">
							<span className="text-xs text-blue-400 font-bold">R</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-bold text-white truncate">Architect</p>
							<p className="text-[10px] text-green-400 flex items-center gap-1">
								<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
								Online
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* MOBILE NAV (Bottom) */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f1522] border-t border-slate-800 pb-safe z-50">
				<div className="flex justify-around items-center p-3">
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							className={({ isActive }) => `
								flex flex-col items-center p-2 rounded-lg transition-colors
								${isActive ? 'text-white' : 'text-slate-400'}
							`}
						>
							{({ isActive }) => (
								<>
									<div className={`
										p-1.5 rounded-xl transition-all duration-300
										${isActive ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : ''}
									`}>
										<item.icon size={22} className={isActive ? "text-blue-400" : ""} />
									</div>
									<span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-400' : ''}`}>
										{item.label}
									</span>
								</>
							)}
						</NavLink>
					))}
				</div>
			</div>
		</>
	);
}

export default Sidebar;
