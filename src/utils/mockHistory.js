// src/utils/mockHistory.js
import { subDays, format } from 'date-fns';

// Helper to generate random integer
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// THE TIME MACHINE: Generates 90 days of realistic history
export const generateMockHistory = () => {
    const history = [];
    const today = new Date();

    // Start with a baseline weight
    let currentWeight = 215.0;

    for (let i = 89; i >= 0; i--) {
        const date = subDays(today, i);
        const dateKey = format(date, 'yyyy-MM-dd');

        // Randomize Daily Performance
        // 10% Chance of Zenith (High PV), 60% Good, 30% Average
        const performanceRoll = Math.random();
        let pv;
        if (performanceRoll > 0.9) pv = randomInt(20, 35); // ZENITH
        else if (performanceRoll > 0.4) pv = randomInt(10, 18); // GOOD
        else pv = randomInt(4, 9); // AVERAGE

        // Simulate Weight Loss (Fluctuating but trending down)
        const weightChange = (Math.random() - 0.6) * 0.4; // Slight bias towards weight loss
        currentWeight += weightChange;

        // Simulate Sleep (Usually good, sometimes bad)
        const sleepScore = Math.random() > 0.8 ? randomInt(50, 70) : randomInt(75, 95);

        history.push({
            date: dateKey,
            day: format(date, 'MMM dd'),
            pv: pv,
            weight: parseFloat(currentWeight.toFixed(1)),
            sleep: sleepScore,
            digitalSunset: Math.random() > 0.3, // 70% success rate
            pureView: Math.random() > 0.2, // 80% success rate
            tasks: [
                { label: 'Morning Prayer', completed: true },
                { label: 'Gym Session', completed: pv > 10 }, // Only on good days
                { label: 'Deep Work', completed: pv > 15 },
                { label: 'Digital Sunset', completed: Math.random() > 0.3 }
            ]
        });
    }
    return history;
};
