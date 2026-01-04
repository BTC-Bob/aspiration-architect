// src/components/PageHeader.jsx
import React from 'react';

/**
 * THE UNIVERSAL HEADER COMPONENT
 * Enforces strict alignment, padding, and icon consistency across all pages.
 * @param {Component} icon - The Lucide Icon component to render
 * @param {ReactNode} title - The main heading (text or JSX)
 * @param {ReactNode} subtitle - The subtext (text or JSX)
 * @param {ReactNode} actions - Optional right-side content (stats, buttons, etc.)
 */
const PageHeader = ({ icon: Icon, title, subtitle, actions }) => {
	return (
		<div className="flex-none h-24 px-8 border-b border-slate-800 bg-[#0B1120] z-20 flex items-center">
			<div className="flex-1 flex flex-col xl:flex-row xl:items-center justify-between gap-6">

				{/* LEFT: STANDARD IDENTITY BLOCK */}
				<div className="flex items-center gap-4">

					{/* 1. THE BORDERED ICON CONTAINER */}
					<div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex-shrink-0">
						<Icon size={28} className="text-blue-400" />
					</div>

					{/* 2. TEXT / TITLES */}
					<div className="flex flex-col justify-center">
						<div className="text-3xl font-bold text-white tracking-tight leading-tight">
							{title}
						</div>

						<div className="text-slate-400 text-sm mt-1 font-medium leading-tight">
							{subtitle}
						</div>
					</div>
				</div>

				{/* RIGHT: DYNAMIC ACTIONS */}
				{actions && (
					<div className="flex items-center gap-6">
						{actions}
					</div>
				)}
			</div>
		</div>
	);
};

export default PageHeader;
