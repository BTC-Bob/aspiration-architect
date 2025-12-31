import React from 'react';

// THE "DESIGN A" GAUGE COMPONENT
// Locked Version 1.0
const ArcGauge = ({ value, max, color, label, subLabel, gradientFrom, gradientTo }) => {
	const radius = 80;
	const stroke = 12;
	const normalizedValue = Math.min(Math.max(value, 0), max);
	const percentage = normalizedValue / max;

	// FIXED GEOMETRY: Top-half "Rainbow" Arch
	// Path string for a perfect 180-degree arch
	const trackPath = "M 20 100 A 80 80 0 0 1 180 100";

	// Calculate stroke dash for progress
	const arcLength = Math.PI * radius;
	const dashOffset = arcLength * (1 - percentage);

	return (
		<div className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-800 bg-gradient-to-b ${gradientFrom} ${gradientTo} min-h-[220px]`}>

			{/* SVG Container */}
			<div className="relative w-[200px] h-[100px] flex items-end justify-center mb-2 overflow-hidden">
				<svg className="w-[200px] h-[100px] absolute top-0" viewBox="0 0 200 100">
					{/* Background Track (Darker) */}
					<path
						d={trackPath}
						fill="none"
						stroke="#1e293b" // slate-800
						strokeWidth={stroke}
						strokeLinecap="round"
					/>
					{/* Progress Arc (Colored) */}
					<path
						d={trackPath}
						fill="none"
						stroke={color}
						strokeWidth={stroke}
						strokeLinecap="round"
						strokeDasharray={arcLength}
						strokeDashoffset={dashOffset}
						className="transition-all duration-1000 ease-out"
					/>
				</svg>

				{/* Center Value */}
				<div className="absolute bottom-0 mb-[-5px] text-center">
					<span className="text-4xl font-bold text-white drop-shadow-lg">{value}</span>
				</div>
			</div>

			{/* Labels */}
			<div className="text-center mt-4 z-10">
				<div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: color }}>
					{label}
				</div>
				<div className="text-slate-500 text-xs">
					{subLabel}
				</div>
			</div>
		</div>
	);
};

export default ArcGauge;
