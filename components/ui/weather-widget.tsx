"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherWidget() {
    const [temp, setTemp] = useState<number | null>(null);
    const [isDay, setIsDay] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                // Eilat coordinates: 29.5581° N, 34.9482° E
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.5581&longitude=34.9482&current=temperature_2m,is_day&timezone=auto');
                const data = await res.json();

                if (data && data.current) {
                    setTemp(Math.round(data.current.temperature_2m));
                    setIsDay(data.current.is_day === 1);
                }
            } catch (error) {
                console.error("Failed to fetch Eilat weather:", error);
                // Fallback to average pleasant temp if network fails
                setTemp(25);
                setIsDay(true);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 bg-zinc-50/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-400 text-sm font-bold shadow-sm animate-pulse w-24 h-8">
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-zinc-50/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-800 text-sm font-bold hover:bg-white transition-all cursor-default select-none shadow-sm">
            {isDay ? (
                <Sun className="text-gold animate-spin-slow" size={16} />
            ) : (
                <Moon className="text-blue-500 hover:text-blue-600 transition-colors" size={16} />
            )}
            <span>אילת {temp}°</span>
        </div>
    );
}
