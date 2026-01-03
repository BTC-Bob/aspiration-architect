// src/config/navigation.js
import { LayoutDashboard, Library, BookOpen, History, Settings } from 'lucide-react';

export const NAV_ITEMS = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: LayoutDashboard
	},
	{
		id: 'library',
		label: 'Library',
		path: '/library',
		icon: Library
	},
	{
		id: 'journal',
		label: 'Journal',
		path: '/journal',
		icon: BookOpen
	},
	{
		id: 'history',
		label: 'History',
		path: '/history',
		icon: History
	},
	{
		id: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: Settings
	}
];

export const getNavConfig = (id) => NAV_ITEMS.find(item => item.id === id);
