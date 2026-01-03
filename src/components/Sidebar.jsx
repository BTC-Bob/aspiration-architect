// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, BookOpen, History, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  // CRITICAL FIX: This hook makes the component "aware" of the current URL
  const location = useLocation();

  // Helper to determine if a menu item is active
  const isActive = (path) => location.pathname === path;

  const MENU_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Library', path: '/library', icon: <Library size={20} /> },
    { label: 'Journal', path: '/journal', icon: <BookOpen size={20} /> },
    { label: 'History', path: '/history', icon: <History size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#050914] border-r border-slate-800 flex flex-col z-50">

      {/* LOGO AREA */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-white font-bold tracking-tight">Aspiration<span className="text-blue-400">Architect</span></span>
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
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50 group">
          <LogOut size={20} className="group-hover:text-rose-400 transition-colors" />
          <span className="font-medium text-sm uppercase tracking-wider">Sign Out</span>
        </button>
        <div className="text-center mt-4 text-[10px] text-slate-600 font-mono">
          v0.2.1 • Alpha
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
