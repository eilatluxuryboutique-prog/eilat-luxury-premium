"use client";

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UrgencyTimer() {
    const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s === 0) {
                    if (prev.m === 0) return { m: 14, s: 59 }; // Reset loop
                    return { m: prev.m - 1, s: 59 };
                }
                return { m: prev.m, s: prev.s - 1 };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-md border border-orange-400/20">
            <Clock size={12} className="animate-spin-slow" />
            <span>המבצע מסתיים ב: {timeLeft.m}:{timeLeft.s.toString().padStart(2, '0')}</span>
        </div>
    );
}
