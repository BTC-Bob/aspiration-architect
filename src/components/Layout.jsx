import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
	return (
		<div className="flex w-full h-screen bg-guardian-bg overflow-hidden text-guardian-text font-sans antialiased selection:bg-pillar-health/30">

			{/* Navigation */}
			<Sidebar />

			{/* Main Content Area */}
			<main className="flex-1 h-full overflow-hidden relative flex flex-col">

				{/* Content Scroll Container */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth custom-scrollbar">
					<div className="max-w-7xl mx-auto w-full h-full pb-24 lg:pb-0">
						{children}
					</div>
				</div>

			</main>
		</div>
	);
};

export default Layout;
