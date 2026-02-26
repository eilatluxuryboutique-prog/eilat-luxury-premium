"use client";

import { CloudSun, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherWidget() {
    // Eilat is almost always sunny. 
    // We can fetch real data or just mock a pleasant temp for "Premium Feel".
    // Let's do a simple mock for now that changes by time of day.

    const [temp, setTemp] = useState(28);

    useEffect(() => {
        const hour = new Date().getHours();
        // Simple day/night logic
        if (hour >= 6 && hour <= 10) setTemp(24);
        else if (hour > 10 && hour <= 16) setTemp(32);
        else if (hour > 16 && hour <= 20) setTemp(29);
        else setTemp(22);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-100 text-zinc-800 text-sm font-medium hover:bg-white transition-colors cursor-default select-none shadow-sm">
            <Sun className="text-gold animate-spin-slow" size={16} />
            <span>אילת {temp}°</span>
        </div>
    );
}
