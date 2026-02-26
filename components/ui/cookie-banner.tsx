'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

export default function CookieBanner() {
    const t = useTranslations('Property'); // or general
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:bottom-4 lg:left-4 lg:right-auto lg:w-96 bg-card border border-border p-4 shadow-2xl z-[9999] rounded-none lg:rounded-2xl" dir="rtl">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-foreground">אנו משתמשים בעוגיות</h3>
                <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                אנו משתמשים בעוגיות (Cookies) על מנת להבטיח את החוויה הטובה ביותר באתר. המשך הגלישה מהווה הסכמה לכך.
            </p>
            <div className="flex gap-2">
                <button
                    onClick={acceptCookies}
                    className="flex-1 bg-primary text-black font-bold py-2 rounded-lg text-sm hover:brightness-110 transition-all"
                >
                    אישור
                </button>
                <a
                    href="/privacy"
                    className="flex-1 text-center bg-muted text-foreground py-2 rounded-lg text-sm hover:bg-neutral-800 transition-all"
                >
                    מדיניות פרטיות
                </a>
            </div>
        </div>
    );
}
