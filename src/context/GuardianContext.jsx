// src/context/GuardianContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFormattedDate } from '../utils/dateHelpers';

const GuardianContext = createContext();

export const useGuardian = () => useContext(GuardianContext);

export const GuardianProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// DAILY STATE
	const [dailyLog, setDailyLog] = useState(null);
	const [todayDate, setTodayDate] = useState(getFormattedDate());

	// LIVE STATS (Calculated from dailyLog)
	const [stats, setStats] = useState({
		totalPV: 0,
		lovePV: 0,
		healthPV: 0,
		freedomPV: 0,
		completionRate: 0
	});

	// 1. AUTH LISTENER
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// 2. DAILY LOG LISTENER (Real-time Sync)
	useEffect(() => {
		if (!user) {
			setDailyLog(null);
			return;
		}

		// Always listen to *Today's* log
		const today = getFormattedDate();
		const logRef = doc(db, 'dailyLogs', today);

		// Listen to document changes
		const unsubscribeLog = onSnapshot(logRef, (docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();
				setDailyLog(data);
				calculateStats(data);
			} else {
				// No plan exists for today -> Triggers "Morning Greeting" flow in UI
				setDailyLog(null);
				setStats({ totalPV: 0, lovePV: 0, healthPV: 0, freedomPV: 0, completionRate: 0 });
			}
		}, (error) => {
			console.error("Error listening to dailyLog:", error);
		});

		return () => unsubscribeLog();
	}, [user, todayDate]);

	// 3. STATS CALCULATOR ENGINE (v0.3 Logic)
	// Calculates totals on-the-fly based on task completion status
	const calculateStats = (log) => {
		let total = 0;
		let love = 0;
		let health = 0;
		let freedom = 0;
		let totalTasks = 0;
		let completedTasks = 0;

		// Helper: Process a list of tasks (Core or Flex)
		const processTaskList = (taskList) => {
			if (!taskList) return;
			taskList.forEach(task => {
				totalTasks++;
				if (task.status === 'completed') {
					completedTasks++;

					// Add Base PV
					const pv = task.pvEarned || 0;
					total += pv;

					// Add Pillar Distribution (if present)
					if (task.pillarDistribution) {
						love += task.pillarDistribution.love || 0;
						health += task.pillarDistribution.health || 0;
						freedom += task.pillarDistribution.freedom || 0;
					}
				}
			});
		};

		// A. Process Core & Flex Tasks
		if (log.plannedTasks) {
			processTaskList(log.plannedTasks.core);
			processTaskList(log.plannedTasks.flex);
		}

		// B. Process Protocols (Bonus Logic)
		// Note: Protocol Habits usually count as individual tasks or internal items.
		// For v0.3 Spec, we look for the 'completionBonus' if the protocol is marked complete.
		if (log.protocolProgress) {
			log.protocolProgress.forEach(proto => {
				if (proto.isComplete) {
					total += (proto.completionBonus || 0);
				}
				// Note: Individual habits within protocols are tracked separately
				// in the UI, but their PV is often summed here if they are stored
				// as completed items. For now, we rely on the log's structure.
			});
		}

		// C. Update State
		setStats({
			totalPV: total,
			lovePV: love,
			healthPV: health,
			freedomPV: freedom,
			completionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
		});
	};

	const value = {
		user,
		loading,
		dailyLog,
		stats,
		todayDate
	};

	return (
		<GuardianContext.Provider value={value}>
			{!loading && children}
		</GuardianContext.Provider>
	);
};
