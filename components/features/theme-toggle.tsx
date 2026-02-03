"use client";

import { useTheme } from "next-themes";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark' || theme === 'system';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-white' : 'text-yellow-500 bg-yellow-100 hover:bg-yellow-200'}`}
            title={isDark ? "Turn Lights On" : "Turn Lights Off"}
        >
            {isDark ? <LightbulbOff className="w-6 h-6" /> : <Lightbulb className="w-6 h-6 fill-current" />}
        </button>
    );
}
